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
    const { userId, providerId, serviceId, date, status = 'pending', notes = null, price = 0 } = req.body || {};
    if (!userId || !providerId || !serviceId || !date) return res.status(400).json({ error: 'missing fields' });

    const item = {
      id: { N: String(numId()) },
      userId: { S: String(userId) },
      providerId: { S: String(providerId) },
      serviceId: { S: String(serviceId) },
      date: { S: new Date(date).toISOString() },
      status: { S: String(status) },
      price: { N: String(Number(price) || 0) },
      notes: notes ? { S: String(notes) } : { NULL: true },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
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

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const names = {}, values = {}, set = [];
    const add = (k, v, isNum = false) => {
      names['#' + k] = k; values[':' + k] = v == null ? { NULL: true } : (isNum ? { N: String(v) } : { S: String(v) });
      set.push(`#${k}=:${k}`);
    };
    if (req.body.date) add('date', new Date(req.body.date).toISOString());
    if (req.body.status) add('status', req.body.status);
    if (req.body.notes !== undefined) add('notes', req.body.notes);
    if (req.body.price !== undefined) add('price', Number(req.body.price) || 0, true);
    add('updatedAt', new Date().toISOString());

    const r = await dynamoDB.send(new ddb.UpdateItemCommand({
      TableName: TABLE,
      Key: { id: { N: String(id) } },
      UpdateExpression: 'SET ' + set.join(','),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
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
      ExpressionAttributeValues: { ':u': { S: userId } }
    }));
    res.json((data.Items || []).map(unmarshall));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET todos los bookings de un provedor
router.get('/provider/:providerId', async (req, res) => {
  try {
    const providerId = String(req.params.providerId);
    const data = await dynamoDB.send(new ddb.QueryCommand({
      TableName: TABLE,
      IndexName: 'providerId-index',
      KeyConditionExpression: 'providerId = :p',
      ExpressionAttributeValues: { ':p': { S: providerId } }
    }));
    res.json((data.Items || []).map(unmarshall));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
