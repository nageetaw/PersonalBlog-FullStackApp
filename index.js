const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
dotenv.config();

app.set("view engine", "ejs");

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", blogRoutes);

const PORT = process.env.PORT | 3000;
const connectionString = process.env.MongoDBConnectionString;
mongoose.connect(connectionString, (error) => {
  if (!error) {
    console.log("connected to DB");
  } else {
    res.send(error);
  }
});

app.listen(PORT, () => console.log("server is listening to port " + PORT));
