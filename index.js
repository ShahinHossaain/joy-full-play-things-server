const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()


const app = express()
const port = process.env.PORT || 3000

// middleware
app.use(cors())
app.use(express.json())

// toys
// ocqCItHumOtu8YZ6

// console.log(process.env)

const uri = `mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.9jftx5o.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // new added 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10
    // new added end 
});

async function run() {
    try {
        // new added 

        client.connect(err => {
            // if (err) {
            //     console.log(err)
            //     return;
            // }
        })
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toysCollection = client.db("toysDB").collection("toys");

        app.post('/toys', async (req, res) => {
            const newToys = req.body;
            // console.log(newToys);
            const result = await toysCollection.insertOne(newToys);
            res.send(result);
        })

        app.get('/toys', async (req, res) => {
            let query = {};
            if (req.query?.subCategory) {
                query = { subCategory: req.query.subCategory }
            }
            if (req.query?.userEmail) {
                query = { userEmail: req.query.userEmail }
            }

            console.log(query);
            const cursor = toysCollection.find(query);
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);
        })

        app.get('/toys/:id', async (req, res) => {
            id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result)
        })



        app.patch('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedToy = req.body;
            console.log('updated', req.body);
            const updateDoc = {
                $set: {
                    price: updatedToy.price,
                    availableQuantity: updatedToy.availableQuantity,
                    description: updatedToy.description
                },
            };
            const result = await toysCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        }
        )

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!shahin Hossain')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})