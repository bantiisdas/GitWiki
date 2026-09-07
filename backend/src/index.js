import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/client.js";

const app = express();

// Important: ensure you add JSON middleware to process incoming JSON POST payloads.
app.use(express.json());
// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", (req, res) => {
  res.send("Health is good");
});

app.listen(3000, () => {
  console.log("App is running on PORT 3000");
});
