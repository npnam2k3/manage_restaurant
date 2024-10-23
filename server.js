import express from "express";
import env from "dotenv";

const app = express();
env.config();
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
