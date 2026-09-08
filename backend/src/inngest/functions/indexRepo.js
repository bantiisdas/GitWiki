import { chunkFiles } from "../../service/chunker.js";
import { fetchRepoFiles, parseRepo } from "../../service/github.js";
import { saveChunks } from "../../service/vectorStore.js";
import { inngest } from "../client.js";

export const indexRepo = inngest.createFunction(
  {
    id: "index-repo",
    triggers: [{ event: "repo/index.requested" }],
  },
  async ({ event, step }) => {
    const { gitToken, repo } = event.data;

    const { owner, repoName, repoKey } = parseRepo(repo);

    const files = await step.run("fetch-git-files", async () => {
      return fetchRepoFiles(gitToken, owner, repoName);
    });

    const documents = await step.run("chunk-files", async () => {
      return chunkFiles(files, repoKey);
    });

    const saveResults = await step.run("save-to-pinecone", async () => {
      return saveChunks(repoKey, documents);
    });

    return {
      repo: repoKey,
      fileCount: files.length,
      chunkCount: saveResults.chunkCount,
      saved: saveResults.saved,
    };
  },
);
