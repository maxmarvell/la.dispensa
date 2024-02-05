import { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt, { JWT } from '@fastify/jwt';
import { fastifyMultipart } from '@fastify/multipart';
import * as Modules from './modules/index'

export const server = require('fastify')();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    jwt: JWT;
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

type FastifyRequestVerify<T> = Partial<T> & { jwtVerify: any }

server.register(fastifyJwt, {
  secret: "bigsecretbigsecretbigsecretbigsecret"
})

// server.register(multer.contentParser);

server.register(require('@fastify/cors'), {
  origin: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})

server.register(fastifyMultipart, {
  addToBody: true,
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
}).after(() => { });

server.decorate("authenticate", async function (request: FastifyRequestVerify<FastifyRequest>, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err)
  }
});

server.get('/healthcheck', async function () {
  return { status: 'ok' };
});

// server.addHook("preHandler", (req, reply, next) => {
//   req.jwt = server.jwt;
//   return next();
// });





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

  const port = process.env.PORT || 3000;
  const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

  try {
    await server.listen({host: host, port: port });
    console.log(`Server ready at http://${host}:${port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  };
}


main();