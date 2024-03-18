import { JWT } from '@fastify/jwt';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import * as Modules from './modules/index';
import dotenv from 'dotenv';

dotenv.config()

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

// export const server = fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    jwt: JWT;
    file: any;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      "email": string,
      "username": string,
      "id": string
    }
  }
}

async function build() {

  const server = fastify();

  // jwt web tokens
  await server.register(require('@fastify/jwt'), {
    secret: "bigsecretbigsecretbigsecretbigsecret"
  })

  // cors
  await server.register(require('@fastify/cors'), {
    origin: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
  })

  // file upload buffer and size limit
  server.register(require('@fastify/multipart'), {
    addToBody: true,
    limits: {
      fileSize: 4 * 1024 * 1024,
    }
  }).after(() => { });

  // authtication decoration
  server.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err)
    }
  });

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  // server healthcheck API
  server.get('/healthcheck', async function () {
    return { status: 'ok', port: PORT };
  });

  return server;
}


async function main() {

  const server = await build();

  const schemas = [...Modules.userSchemas, ...Modules.recipeSchemas, ...Modules.instructionSchemas, ...Modules.ingredientSchemas, ...Modules.iterationSchema]

  for (const schema of schemas) {
    server.addSchema(schema);
  };

  server.register(Modules.userRoutes, { prefix: "api/users" });

  server.register(Modules.recipeRoutes, { prefix: "api/recipes" });

  server.register(Modules.instructionRoutes, { prefix: "api/instructions" })

  server.register(Modules.ingredientRoutes, { prefix: "api/ingredients" })

  server.register(Modules.iterationRoutes, { prefix: "api/iterations" })

  server.register(Modules.tagRoutes, { prefix: "api/tags" })

  server.register(Modules.dashboardRoutes, { prefix: "api/dashboard" })

  server.listen({ port: PORT, host: HOST }, function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1)
    }
    console.log(`server listening on ${address}`)
  });
}


main();