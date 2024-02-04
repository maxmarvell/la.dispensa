import userRoutes from "./user/user.route"
import { userSchemas } from "./user/user.schema";
import recipeRoutes from "./recipe/recipe.route";
import { recipeSchemas } from "./recipe/recipe.schema";
import ingredientRoutes from "./ingredient/ingredient.route";
import { ingredientSchemas } from "./ingredient/ingredient.schema";
import instructionRoutes from "./instruction/instruction.route";
import { instructionSchemas } from "./instruction/instruction.schema";
import permissionRoutes from "./permission/permission.route";
import { permissionSchema } from "./permission/permission.schema";
import iterationRoutes from "./test_kitchen/test.kitchen.route";
import { iterationSchema } from "./test_kitchen/test.kitchen.schema";
import tagRoutes from "./tags/tags.route";


export {
  userRoutes,
  userSchemas,
  recipeRoutes,
  recipeSchemas,
  ingredientRoutes,
  ingredientSchemas,
  instructionRoutes,
  instructionSchemas,
  permissionRoutes,
  permissionSchema,
  iterationRoutes,
  iterationSchema,
  tagRoutes
}