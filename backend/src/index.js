import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send("Health is good");
});

app.listen(3000, () => {
  console.log("App is running on PORT 3000");
});
