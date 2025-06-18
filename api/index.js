import { createServer } from "../server/server.js";

const server = createServer();

export default async function handler(request, response) {
  await server.ready();

  server.server.emit("request", request, response);
}
