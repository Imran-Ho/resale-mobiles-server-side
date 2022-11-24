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

    app.get("/categories", async (req, res) =>{
      const query = {};
      const result = await categoriesCollection.find(query).toArray()
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