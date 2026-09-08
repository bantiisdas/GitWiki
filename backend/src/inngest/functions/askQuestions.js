import { parseRepo } from "../../service/github.js";
import { retrieveAnswer } from "../../service/rag.js";
import { inngest } from "../client.js";

export const askQuestion = inngest.createFunction(
  { id: "ask-question", triggers: [{ event: "chat/question.requested" }] },
  async ({ event, step }) => {
    const { repo, question } = event.data;
    const { repoKey } = parseRepo(repo);

    try {
      const result = await step.run("retrieve-and-answer", async () => {
        return retrieveAnswer(repoKey, question);
      });

      return {
        repo: repoKey,
        question,
        status: "Completed",
        answer: result.answer,
        sources: result.sources,
      };
    } catch (error) {
      throw error;
    }
  },
);
