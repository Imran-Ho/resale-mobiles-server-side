const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gof4ucb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const categoriesCollection = client.db("resale-mobiles").collection("categories");
    const itemsCollection = client.db("resale-mobiles").collection("products");
    const bookingCollection = client.db("resale-mobiles").collection("booking");
    const usersCollection = client.db("resale-mobiles").collection("users");
    const paymentsCollection = client.db("resale-mobiles").collection("payments");
    const addProductsCollection = client.db("resale-mobiles").collection("addProducts");
    const advertisementCollection = client.db("resale-mobiles").collection("advertisement");

    // get categories in home page.
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray()
      res.send(result)
    })

    // get individual item.
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { item_id: id }
      // const query = { _id: ObjectId(id) };
      const items = await itemsCollection.find(query).toArray();
      res.send(items)
    })

    // booking info posted to database
    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

    // get booking data
    app.get('/booking', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray()
      res.send(bookings)
    })

    // for payment data show with id.
    app.get('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query)
      res.send(booking)
    })

    // post created user to database
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result);
    })


    // Payment section connected with client side
    app.post('/create-payment-intent', async (req, res) => {
      const booking = req.body;

      const price = booking.resalePrice;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        "payment_method_types": [
          "card"
        ]
      })
      res.send({
        clientSecret: paymentIntent.client_secret,
      })
    })

    // payment details post to database
    app.post('/payments', async (req, res) => {
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment)
      const id = payment.bookingId
      const filter = { _id: ObjectId(id) }
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId
        }
      }

      const updatedResult = await bookingCollection.updateOne(filter, updateDoc)
      res.send(result)
    })




    // post products info posted to database
    app.post('/addedProducts', async (req, res) => {
      const products = req.body;
      const result = await addProductsCollection.insertOne(products);
      res.send(result);
    })

    // get posted doctors info
    app.get('/addedProducts', async (req, res) => {
      const query = {};
      const products = await addProductsCollection.find(query).toArray();
      res.send(products)
    })
    // delete added product
    app.delete('/addedProducts/:id', async (req, res) => {
      const id = req = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await addProductsCollection.deleteOne(filter);
      res.send(result);
  })

  // post product for advertisement
  app.post('/advertisement', async (req, res) =>{
    const product = req.body;
    const advertisement = await advertisementCollection.insertOne(product);
    res.send(advertisement);
  })

  // get advertisement products
  app.get('/advertisement', async (req, res) =>{
    const query = {};
    const advertiseProduct = await advertisementCollection.find(query).toArray();
    res.send(advertiseProduct)
  })

  // delete advertising product
  app.delete('/advertisement/:id', async (req, res) => {
    const id = req = req.params.id;
    const filter = { _id: ObjectId(id) };
    const result = await advertisementCollection.deleteOne(filter);
    res.send(result);
})

  }
  finally {

  }
}
run().catch(err => console.dir(err))



app.get('/', (req, res) => {
  res.send('project 12 server is running')
})

app.listen(port, () => {
  console.log(`project 12 server is running on port ${port}`)
})