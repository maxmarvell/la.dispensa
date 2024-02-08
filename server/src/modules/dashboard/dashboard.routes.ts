import { FastifyInstance } from "fastify";
import { getDashboardHandler, getDashboardUsersHandler } from "./dashboard.controller";



async function dashboardRoutes(server:FastifyInstance) {
  server.get('/recipes', getDashboardHandler);

  server.get('/users',{
    onRequest: [server.authenticate]
  }, getDashboardUsersHandler);
};


export default dashboardRoutes;