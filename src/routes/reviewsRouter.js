const express = require('express');
const dynamoDB = require('../data/dynamoClient.js');
const ddb = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const router = express.Router();
const TABLE = 'Reviews';
const numId = () => Date.now();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { providerId, userId, bookingId = null, rating, comment = '' } = req.body || {};
    if (!providerId || !userId || rating === undefined) return res.status(400).json({ error: 'missing fields' });

    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) return res.status(400).json({ error: 'rating 1..5' });

    const item = {
      id: { N: String(numId()) },
      providerId: { S: String(providerId) },
      userId: { S: String(userId) },
      bookingId: bookingId ? { S: String(bookingId) } : { NULL: true },
      rating: { N: String(r) },
      comment: { S: String(comment) },
      createdAt: { S: new Date().toISOString() },
      updatedAt: { S: new Date().toISOString() }
    };

    await dynamoDB.send(new ddb.PutItemCommand({ TableName: TABLE, Item: item, ConditionExpression: 'attribute_not_exists(id)' }));
    res.status(201).json(unmarshall(item));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// READ una reseña por id
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
    const add = (k, v, isNum = false) => { names['#'+k]=k; values[':'+k]=isNum?{N:String(v)}:{S:String(v)}; set.push(`#${k}=:${k}`); };

    if (req.body.rating !== undefined) {
      const r = Number(req.body.rating);
      if (Number.isNaN(r) || r < 1 || r > 5) return res.status(400).json({ error: 'rating 1..5' });
      add('rating', r, true);
    }
    if (req.body.comment !== undefined) add('comment', req.body.comment);
    add('updatedAt', new Date().toISOString());

    const rUpd = await dynamoDB.send(new ddb.UpdateItemCommand({
      TableName: TABLE,
      Key: { id: { N: String(id) } },
      UpdateExpression: 'SET ' + set.join(','),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW'
    }));
    res.json(unmarshall(rUpd.Attributes || {}));
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

// READ muchas reseñas de un proveedor
router.get('/', async (req, res) => {
  try {
    const { providerId, userId, minRating, limit = 50 } = req.query;

    let data;
    if (providerId) {
      data = await dynamoDB.send(new ddb.QueryCommand({
        TableName: TABLE, IndexName: 'providerId-index',
        KeyConditionExpression: 'providerId = :p',
        ExpressionAttributeValues: { ':p': { S: String(providerId) } },
        Limit: Math.min(parseInt(limit), 200) || 50
      }));
    } else if (userId) {
      data = await dynamoDB.send(new ddb.QueryCommand({
        TableName: TABLE, IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': { S: String(userId) } },
        Limit: Math.min(parseInt(limit), 200) || 50
      }));
    } else {
      data = await dynamoDB.send(new ddb.ScanCommand({
        TableName: TABLE, Limit: Math.min(parseInt(limit), 200) || 50
      }));
    }

    let items = (data.Items || []).map(unmarshall);
    if (minRating) items = items.filter(x => Number(x.rating || 0) >= Number(minRating));

    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET todas las reseñas de un proveedor (con promedio)
router.get('/provider/:providerId', async (req, res) => {
  try {
    const providerId = String(req.params.providerId);
    const data = await dynamoDB.send(new ddb.QueryCommand({
      TableName: TABLE, IndexName: 'providerId-index',
      KeyConditionExpression: 'providerId = :p',
      ExpressionAttributeValues: { ':p': { S: providerId } }
    }));
    const reviews = (data.Items || []).map(unmarshall);
    const avg = reviews.length ? Number((reviews.reduce((a,b)=>a+Number(b.rating||0),0)/reviews.length).toFixed(2)) : 0;
    res.json({ reviews, averageRating: avg, count: reviews.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;


/* -- Para agregar en app/server.js para hacer pruebas --
app.use('/users', require('./routes/usersRouter'));
app.use('/bookings', require('./routes/bookingsRouter'));
app.use('/reviews', require('./routes/reviewsRouter'));
*/
