const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Yay Super Bike server is running smoothly !!!");
});

app.listen(port, () => {
  console.log("My super server is running on: ", port);
});
