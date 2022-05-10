const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jh56u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const carsCollection = client.db("carsinventory").collection("inventory");
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query);
            const products = await cursor.limit(6).toArray();
            res.send(products)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await carsCollection.findOne(query);
            res.send(service);
        });

        // update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            console.log(updatedProduct)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {

                    quantity: updatedProduct.quantity

                }
            };
            const result = await carsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })
        // delete a user
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carsCollection.deleteOne(query);
            res.send(result);
        })
    } finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello Worldfghfhdjgfd!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})