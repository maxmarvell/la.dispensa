import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers, getUser, createConnection, deleteConnection, getConnections, acceptConnection, findGalleryRecipes, getConnectedBy } from "./user.service";
import { CreateUserInput, LoginInput, CreateConnectionInput } from "./user.schema";
import { server } from "../../app";
import { addUserPhoto } from "./user.service";
import cloudImageUpload from "../../utils/aws.s3";
import { verifyPassword } from "../../utils/hash";



export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (e) {
    console.log(e);
    return reply.code(500).send(e);
  }
}


export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;
    // generate access token
    return { accessToken: request.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: "Invalid password",
  });
};


export async function getUsersHandler(
  request: FastifyRequest<{
    Querystring: {
      userId?: string
    }
  }>
) {
  const { userId } = request.query;
  const users = await findUsers(userId);
  return users;
};


export async function getUserHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {

  const { userId } = request.params;
  const user = await getUser(userId);

  if (!user) {
    return reply.code(404).send({
      message: "user not found"
    });
  };

  return user;
};


export async function uploadPhotoHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const data = await request.file();

    if (!data) {
      throw new Error('No file provided');
    };

    const upload = await cloudImageUpload(data);

    if (upload.ok) {
      const { userId } = request.params;
      const filepath = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${data.filename}`;
      const user = await addUserPhoto(filepath, userId);
      return user;
    };
    return { ok: false };

  } catch (error) {
    console.log(error);
    return reply.code(401);
  };
};


// Connection controllers

export async function connectHandler(
  request: FastifyRequest<{
    Body: CreateConnectionInput
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const connection = await createConnection(body);
    return reply.code(201).send(connection);
  } catch (e) {
    console.log(e);
    return reply.code(400);
  };
};


export async function connectDeleteHandler(
  request: FastifyRequest<{
    Params: {
      connectedWithId: string
      connectedById: string
    }
  }>,
  reply: FastifyReply
) {
  const { connectedWithId, connectedById } = request.params;
  console.log(connectedWithId, connectedById)
  try {
    const result = await deleteConnection(connectedWithId, connectedById);
    return reply.code(200).send(result);
  } catch (e) {
    console.log(e);
    return reply.code(400);
  };
};

export async function getConnectionsHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;
    const users = await getConnections(userId);
    console.log(users)
    return users;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}

export async function getConnectedByHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const data = await getConnectedBy({
      ...request.params
    });
    return data;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}

export async function acceptConnectionHandler(
  request: FastifyRequest<{
    Params: {
      userId: string,
      connectedById: string,
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { userId, connectedById } = request.params;
    const result = await acceptConnection({ userId, connectedById });
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  }
}


export async function findGalleryRecipesHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const recipes = await findGalleryRecipes({ userId: request.params.userId });
    return recipes;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};


