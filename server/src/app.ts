import { JWT } from '@fastify/jwt';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import * as Modules from './modules/index'

export const server = fastify();

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

server.register(require('@fastify/jwt'), {
  secret: "bigsecretbigsecretbigsecretbigsecret"
})

server.register(require('@fastify/cors'), {
  origin: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})

server.register(require('@fastify/multipart'), {
  addToBody: true,
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
}).after(() => { });

server.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err)
  }
});

server.get('/healthcheck', async function () {
  return { status: 'ok' };
});

server.addHook("preHandler", (req, reply, next) => {
  req.jwt = server.jwt;
  return next();
});


async function main() {

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

  const port = Number(process.env.PORT) || 3000;
  const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

  server.listen({ port: port, host: host }, function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1)
    }
    console.log(`server listening on ${address}`)
  })
}


main();