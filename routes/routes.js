const router = require("express").Router();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://itsproali:${process.env.DB_PASSWORD}@bikecluster.vxpkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const itemCollection = client.db("SuperBike").collection("items");
    const memberCollection = client.db("SuperBike").collection("members");

    // Count Product
    router.get("/item-count", async (req, res) => {
      const count = await itemCollection.estimatedDocumentCount();
      res.send({ count });
    });

    router.get("/check", async (req, res) => {
      res.send("Api Working properly");
    });
  } finally {
    //client.close()
  }
};

run().catch(console.dir);

module.exports = router;
