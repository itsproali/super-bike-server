const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json());

//********  Left JWT for Unwanted Error  ********/

// const verifyJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }
//   const token = authHeader.split(" ")[1];
//   console.log(token);
//   jwt.verify(token, process.env.ACCESS_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden Access" });
//     }
//     console.log("decoded", decoded);
//     req.decoded = decoded;
//   });
//   // console.log(authHeader);
//   next();
// };

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
    const memberCollection = client.db("SuperBike").collection("members");

    // Count Product
    app.get("/item-count", async (req, res) => {
      const count = await itemCollection.estimatedDocumentCount();
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
    app.get("/my-items", async (req, res) => {
      const uid = req.query.uid;
      // const decodedUid = req.decoded.uid;
      // if (uid === decodedUid) {
      const query = { uid: uid };
      const cursor = itemCollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems);
      // } else {
      //   res.status(403).send({ message: "Forbidden Access" });
      // }
    });

    // Load All Members
    app.get("/members", async (req, res) => {
      const query = {};
      const cursor = memberCollection.find(query);
      const members = await cursor.toArray();
      res.send(members);
    });

    // get Token
    app.post("/getToken", async (req, res) => {
      const user = req.body.userId;
      console.log(user);
      const accessToken = jwt.sign({ user }, process.env.ACCESS_SECRET, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
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
