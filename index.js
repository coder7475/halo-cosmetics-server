// Imports - required libraries
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
// mongo
const { MongoClient, ServerApiVersion } = require("mongodb");

// Initializations
const app = express();
const port = process.env.PORT || 3002;
dotenv.config();

// mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjslrno.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middlewares
app.use(express.json());
app.use(cors());

// root routes - methods
app.get("/", (req, res) => {
  res.send("Halo Server is running");
});

// connection with mongodb
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // access comapnies db
    const myDB = await client.db("companies");
    const myCol = await myDB.collection("brands");
    const slidersCol = await myDB.collection("sliders");
    const productsCol = await client.db("allProducts").collection("products");
    const cartCol = await client.db("Cart").collection("cartProducts");

    app.get('/brands', async(req, res) => {
      const cursor = myCol.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    })

    app.get('/sliders', async(req, res) => {
      const cursor = slidersCol.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    })

    app.get('/products', async(req, res) => {
      const cursor = productsCol.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    })
    // access products collection
    app.get("/cart", async(req, res) => {
      const cursor = productsCol.find();
      // console.log(product);
      const result = await cursor.toArray();
      res.send(result);
    })
    // insert a product to the database
    app.post("/products", async(req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await productsCol.insertOne(product);
      res.send(result);
    })

    app.post("/cart", async(req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await cartCol.insertOne(product);
      res.send(result);
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log("Now connection is close. connection close");
  }
}
run().catch(console.dir);

// listening
app.listen(port, () => {
  console.log(`Halo app is listening to port ${port}`);
});
