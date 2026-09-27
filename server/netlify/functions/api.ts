// server/netlify/functions/api.ts
import serverless from "serverless-http";
import { app } from "../../src/index"; // Adjust path if your structure is different

export const handler = serverless(app);