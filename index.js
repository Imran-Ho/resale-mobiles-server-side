const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gof4ucb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
  try{
    const categoriesCollection = client.db("resale-mobiles").collection("categories");
    const itemsCollection = client.db("resale-mobiles").collection("products");
    const bookingCollection = client.db("resale-mobiles").collection("booking");

// get categories in home page.
    app.get("/categories", async (req, res) =>{
      const query = {};
      const result = await categoriesCollection.find(query).toArray()
      res.send(result)
    })

// get individual item.
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = {item_id: id}
      // const query = { _id: ObjectId(id) };
      const items = await itemsCollection.find(query).toArray();
      res.send(items)
  })

// booking info posted to database
    app.post('/booking', async (req, res) =>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

  }
  finally{

  }
}
run().catch(err => console.dir(err))



app.get('/', (req, res) => {
  res.send('project 12 server is running')
})

app.listen(port, () => {
  console.log(`project 12 server is running on port ${port}`)
})