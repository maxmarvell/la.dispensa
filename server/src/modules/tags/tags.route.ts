import { FastifyInstance } from "fastify";
import { searchTagsHandler } from "./tags.controller";


async function tagRoutes(server: FastifyInstance) {
  server.get('/', searchTagsHandler)
};

export default tagRoutes;