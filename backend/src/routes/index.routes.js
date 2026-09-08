import { Router } from "express";
import { inngest } from "../inngest/client.js";

const router = Router();
router.post("/", async (req, res) => {
  const gitToken = process.env.GITHUB_TOKEN;
  const { repo } = req.body;
  if (!repo) {
    return res.status(400).json({ error: "repo is required" });
  }
  if (!gitToken) {
    return res.status(500).json({ error: "GITHUB_TOKEN is not configured" });
  }

  await inngest.send({
    name: "repo/index.requested",
    data: { gitToken, repo },
  });

  res.json("Repo Indexing");
});

export default router;
