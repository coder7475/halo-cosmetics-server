// Imports - required libraries
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
// mongo
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Initializations
const app = express();
const port = process.env.PORT || 3002;
dotenv.config();

// mongo
const uri = `mongodb+srv://robiulhossain7475:OmCCSErjAPs51DKY@cluster0.xjslrno.mongodb.net/?retryWrites=true&w=majority`;
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
      co
      nst cursor = myCol.find();
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
      const cursor = cartCol.find();
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

    // update a product in the database
    app.put("/updateProduct", async(req, res) => {
      const info = req.body;
      // console.log(info);
      const { id } = info;
      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true};

      const updatedProduct = {
        $set: {
          name: info.name,
          image: info.image,
          brand: info.brand,
          price: info.price,
          type: info.type,
          rating: info.rating,
          description: info.description
        }
      }

      const result = await productsCol.updateOne(filter, updatedProduct, options);

      res.send(result);

    })

    // insert products in a cart with user id
    app.post("/cart", async(req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await cartCol.insertOne(product);
      res.send(result);
    })

    app.delete("/cart", async(req, res) => {
      // const id = req.params.id;
      const product = req.body;
      const { id, uid } = product;
      const query = { _id: new ObjectId(id), uid };
      // console.log(id, product);
      // console.log(query);
      const result = await cartCol.deleteOne(query);
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
