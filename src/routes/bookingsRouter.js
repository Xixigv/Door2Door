const express = require('express');
const dynamoDB = require('../data/dynamoClient.js');
const ddb = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const router = express.Router();
const TABLE = 'Bookings';
const numId = () => Date.now();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { userId, providerId, service, date, status = 'pending', amount = 0, serviceType, serviceDuration, bookingTime, notes = null } = req.body || {};
    if (!userId || !providerId || !service || !date) return res.status(400).json({ error: 'missing fields' });

    // Validate date format yyyy-mm-dd
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'date must be in yyyy-mm-dd format' });
    }

    const item = {
      id: { N: String(numId()) },
      userId: { N: String(userId) },
      providerId: { N: String(providerId) },
      service: { S: String(service) },
      date: { S: String(date) },
      status: { S: String(status) },
      amount: { N: String(Number(amount) || 0) },
      serviceType: { S: String(serviceType) },
      serviceDuration: { N: String(Number(serviceDuration) || 0) },
      bookingTime: { S: String(bookingTime) },
      notes: notes ? { S: String(notes) } : { NULL: true }
    };

    await dynamoDB.send(new ddb.PutItemCommand({ TableName: TABLE, Item: item, ConditionExpression: 'attribute_not_exists(id)' }));
    res.status(201).json(unmarshall(item));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// READ un booking por id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await dynamoDB.send(new ddb.GetItemCommand({ TableName: TABLE, Key: { id: { N: String(id) } } }));
    if (!data.Item) return res.status(404).json({ error: 'not found' });
    res.json(unmarshall(data.Item));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE - Only allows changing status
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    // Validate that status is provided
    if (!status) {
      return res.status(400).json({ error: 'status field is required' });
    }

    const r = await dynamoDB.send(new ddb.UpdateItemCommand({
      TableName: TABLE,
      Key: { id: { N: String(id) } },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': { S: String(status) } },
      ReturnValues: 'ALL_NEW'
    }));
    
    res.json(unmarshall(r.Attributes || {}));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await dynamoDB.send(new ddb.DeleteItemCommand({ TableName: TABLE, Key: { id: { N: String(id) } } }));
    res.json({ deleted: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// READ muchos bookings con filtros
router.get('/', async (req, res) => {
  try {
    const { status, serviceId, from, to, limit = 50 } = req.query;
    const names = {}, values = {}; const filters = [];

    if (status) { names['#s']='status'; values[':s']={ S:String(status)}; filters.push('#s=:s'); }
    if (serviceId) { names['#sv']='serviceId'; values[':sv']={ S:String(serviceId)}; filters.push('#sv=:sv'); }
    if (from) { names['#d']='date'; values[':f']={ S:new Date(from).toISOString()}; filters.push('#d>=:f'); }
    if (to) { names['#d']='date'; values[':t']={ S:new Date(to).toISOString()}; filters.push('#d<=:t'); }

    const data = await dynamoDB.send(new ddb.ScanCommand({
      TableName: TABLE,
      Limit: Math.min(parseInt(limit), 200) || 50,
      ...(filters.length ? { FilterExpression: filters.join(' AND '), ExpressionAttributeNames: names, ExpressionAttributeValues: values } : {})
    }));

    res.json((data.Items || []).map(unmarshall));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET todos los bookings de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = String(req.params.userId);
    const data = await dynamoDB.send(new ddb.QueryCommand({
      TableName: TABLE,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :u',
      ExpressionAttributeValues: { ':u': { N: userId } }
    }));
    res.json((data.Items || []).map(unmarshall));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET todos los bookings de un provedor con filtros opcionales
router.get('/provider/:providerId', async (req, res) => {
  try {
    const providerId = String(req.params.providerId);
    const { status, future } = req.query;
    
    const names = { '#p': 'providerId' };
    const values = { ':p': { N: providerId } };
    const filters = [];
    
    // Filter by status if provided
    if (status) {
      names['#s'] = 'status';
      values[':s'] = { S: String(status) };
      filters.push('#s = :s');
    }
    
    // Filter for future bookings if requested
    if (future === 'true') {
      const today = new Date().toISOString().split('T')[0]; // Get yyyy-mm-dd format
      names['#d'] = 'date';
      values[':today'] = { S: today };
      filters.push('#d >= :today');
    }
    
    const data = await dynamoDB.send(new ddb.QueryCommand({
      TableName: TABLE,
      IndexName: 'providerId-index',
      KeyConditionExpression: '#p = :p',
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ...(filters.length ? { FilterExpression: filters.join(' AND ') } : {})
    }));
    
    res.json((data.Items || []).map(unmarshall));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;