const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcpxy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        await client.connect();
        const userCollection = client.db('libraryManagementSystem').collection('userCollection');

        // UserData REST API
        app.put("/userData/:email", async (req, res) => {
            const userEmail = req.params.email;
            const user = req.body;
            const filter= {email: userEmail};
            const options = {upsert: true};
            const updatedDoc= {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.get("/userData/:email", async(req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const result = await userCollection.findOne(query);
            res.send(result);
        })
    }
    finally {

    }
};

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server Calming")
})

app.listen(port, () => {
    console.log("Server Running")
})