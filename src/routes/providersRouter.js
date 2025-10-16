const express = require('express');

const dynamoDB = require("../data/dynamoClient.js");
const dynamoClient = require('@aws-sdk/client-dynamodb');
const {unmarshall} = require('@aws-sdk/util-dynamodb');


const router = express.Router();
const TABLE_NAME = "Providers"; // el nombre de tu tabla DynamoDB

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
                name: unmarshalled.name,
                image: unmarshalled.avatar,
                service: unmarshalled.service,
                rating: unmarshalled.rating,
                reviews: unmarshalled.reviewCount,
                price: unmarshalled.hourlyRate,
                available: true,

            };
        });
        res.json(cleanData);
    } catch (err) {
        console.error("Couldn't retrieve service:", err);
        res.status(500).json({ error: "Couldn't retrieve service" });
    }
});

router.get('/:id', async(req, res) => {
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