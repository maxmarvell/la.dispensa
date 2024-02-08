import userRoutes from "./user/user.route"
import { userSchemas } from "./user/user.schema";
import recipeRoutes from "./recipe/recipe.route";
import { recipeSchemas } from "./recipe/recipe.schema";
import ingredientRoutes from "./ingredient/ingredient.route";
import { ingredientSchemas } from "./ingredient/ingredient.schema";
import instructionRoutes from "./instruction/instruction.route";
import { instructionSchemas } from "./instruction/instruction.schema";
import iterationRoutes from "./test_kitchen/test.kitchen.route";
import { iterationSchema } from "./test_kitchen/test.kitchen.schema";
import tagRoutes from "./tags/tags.route";
import dashboardRoutes from "./dashboard/dashboard.routes";


export {
  userRoutes,
  userSchemas,
  recipeRoutes,
  recipeSchemas,
  ingredientRoutes,
  ingredientSchemas,
  instructionRoutes,
  instructionSchemas,
  iterationRoutes,
  iterationSchema,
  tagRoutes,
  dashboardRoutes
}