const express = require('express');

const dynamoDB = require("../data/dynamoClient.js");
const dynamoClient = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const router = express.Router();
const TABLE_NAME = "Services"; // el nombre de tu tabla DynamoDB

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const command = new dynamoClient.ScanCommand({
            TableName: TABLE_NAME,
            Limit: limit
        });
        const data = await dynamoDB.send(command);

        // Convierte y filtra cada item
        const cleanData = data.Items.map(item => {
            const unmarshalled = unmarshall(item);
            return {
                id: unmarshalled.id,
                name: unmarshalled.category,
                description: unmarshalled.shortDescription,
                image: unmarshalled.image,
                rating: unmarshalled.provider?.rating,
                providers: unmarshalled.providers
            };
        });
        res.json(cleanData);
    } catch (err) {
        console.error("Couldn't retrieve service:", err);
        res.status(500).json({ error: "Couldn't retrieve service" });
    }
});

router.get("/popular", async (req, res) => {
    try {

        const command = new dynamoClient.ScanCommand({
            TableName: TABLE_NAME,
        });

        const data = await dynamoDB.send(command);

        const cleanItems = data.Items.map(item => {
            const unmarshalled = unmarshall(item);
            return {
                id: unmarshalled.id,
                name: unmarshalled.category,
                description: unmarshalled.shortDescription,
                image: unmarshalled.image,
                rating: unmarshalled.provider?.rating,
                providers: unmarshalled.providers
            };
        });

        const uniqueByCategory = [];
        const seenCategories = new Set();

        for (const item of cleanItems) {
            if (!seenCategories.has(item.name)) {
                seenCategories.add(item.name);
                uniqueByCategory.push(item);
            }
            if (uniqueByCategory.length === 5) break; 
        }

        res.json(uniqueByCategory);

    } catch (err) {
        console.error("Couldn't retrieve service:", err);
        res.status(500).json({ error: "Couldn't retrieve service" });
    }
});


router.get("/all", async (req, res) => {
    try {
        const command = new dynamoClient.ScanCommand({ TableName: TABLE_NAME });
        const data = await dynamoDB.send(command);
        const cleanData = data.Items.map(item => unmarshall(item));
        res.json(cleanData);
    } catch (err) {
        console.error("Couldn't retrieve service:", err);
        res.status(500).json({ error: "Couldn't retrieve service" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const command = new dynamoClient.GetItemCommand({
            TableName: TABLE_NAME,
            Key: { id: { N: id.toString() } }
        });

        const data = await dynamoDB.send(command);

        if (!data.Item) {
            return res.status(404).json({ error: "Service not found" });
        }

        const service = unmarshall(data.Item);
        res.json(service);
    } catch (err) {
        console.error("Couldn't retrieve service:", err);
        res.status(500).json({ error: "Couldn't retrieve service" });
    }
});


module.exports = router;