const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
// use express from the client side
app.use(cors());
// get data from the post request & convert stringify to js object
app.use(express.json());

// user: dbUser2
// pass: PqBn1ljfhe8Ycu9X

// Database connection
const uri = "mongodb+srv://dbUser2:PqBn1ljfhe8Ycu9X@cluster0.twsrnvr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Connect replace by Inserting a document
async function run() {
    try {
        // Create a database & collection
        const userCollection = client.db('nodeMongoCrud').collection('users');

        // READ::
        // Create a get API to load data from the database (find operation)
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        // CREATE::
        // Create a post API to send data to the database (insert operation)
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result)
        });

        // DELETE::
        // Create a delete API to delete a specific data from the database (delete operation)
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Trying to delete', id);
            // Set query to delete a specific data
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // UPDATE::
        // Create a get API to load data to the browser for update
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        // Create a put API to update data to the database (update operation)
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })
    }
    finally {

    }
}
// Call the function with catch
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('Hello from node mongo crud server');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
