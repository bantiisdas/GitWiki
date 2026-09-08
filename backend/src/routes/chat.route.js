import { Router } from "express";
import { parseRepo } from "../service/github.js";
import { inngest } from "../inngest/client.js";

const router = Router();

router.post("/", async (req, res) => {
  const { repo, question } = req.body;

  if (!repo || !question) {
    return res.status(400).json({ error: "repo and question are required" });
  }

  const { repoKey } = parseRepo(repo);

  try {
    await inngest.send({
      name: "chat/question.requested",
      data: { repo, question },
    });

    return res.status(202).json({
      repo: repoKey,
      question,
      status: "Queued",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message ?? "Failed to queue question",
    });
  }
});

export default router;
