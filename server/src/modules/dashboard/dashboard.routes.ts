import { FastifyInstance } from "fastify";
import { getDashboardHandler, getDashboardUsersHandler, getRecipeNotificationsHandler } from "./dashboard.controller";



async function dashboardRoutes(server:FastifyInstance) {
  server.get('/recipes', getDashboardHandler);

  server.get('/users', {
    onRequest: [server.authenticate]
  }, getDashboardUsersHandler);

  server.get('/recipe-notifications', {
    onRequest: [server.authenticate]
  }, getRecipeNotificationsHandler);

};


export default dashboardRoutes;