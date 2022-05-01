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

    // Update Quantity
    app.put("/item/:id", async (req, res) => {
      const query = req.body;
      console.log(query);
      res.send()
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
