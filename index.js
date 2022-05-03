const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://itsproali:${process.env.DB_PASSWORD}@bikecluster.vxpkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const itemCollection = client.db("SuperBike").collection("items");

    // Count Product
    app.get("/item-count", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

    //   Load All Items
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //   Load 6 Items
    app.get("/items/6", async (req, res) => {
      const query = {};
      const cursor = itemCollection.find(query).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Load specific data by id
    app.get("/item/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });

    // Update Quantity & Sold
    app.put("/item/:id", async (req, res) => {
      const quantity = req.body.quantity;
      const sold = req.body.sold;
      const data = { quantity: quantity - 1, sold: sold + 1 };
      const query = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const updateQuantity = await itemCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(updateQuantity);
    });

    // Update Stock
    app.put("/stockItem/:id", async (req, res) => {
      const quantity = req.body.quantity;
      const stock = req.body.stock;
      const data = { quantity: quantity + stock };
      const query = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const updateQuantity = await itemCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(updateQuantity);
    });

    // Update Item Details
    app.put("/edit/:id", async (req, res) => {
      const item = req.body.item;
      const query = { _id: ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: item,
      };
      const updateQuantity = await itemCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(updateQuantity);
    });

    // Add a new Product
    app.post("/add", async (req, res) => {
      const item = req.body.item;
      const result = await itemCollection.insertOne(item);
      res.send(result);
    });

    // Delete a Product
    app.delete("/delete/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    // My Items
    app.post("/my-items", async (req, res) => {
      const email = req.body.email;
      const query = { email: { $in: [email] } };
      const cursor = itemCollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems);
    });
  } finally {
    // client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Yay Super Bike server is running smoothly !!!");
});

app.listen(port, () => {
  console.log("My super server is running on: ", port);
});
