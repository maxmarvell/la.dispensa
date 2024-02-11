import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers, getUser, createConnection, getConnections, acceptConnection, findGalleryRecipes, changeUserPassword, removeConnection, getConnectionRequests } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
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
  console.log(body)
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
    message: "Invalid username or password",
  });
};

export async function changeUserPasswordHandler(
  request: FastifyRequest<{
    Body: {
      password: string
    },
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  const { password } = request.body;
  const { userId: id } = request.params;

  try {
    await changeUserPassword({
      id, password
    });
    return reply.code(204).send();
  } catch (error) {
    console.log(error);
    return reply.code(404).send({
      message: "Unable to Change Password"
    });
  };
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
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  const { userId: connectedWithId } = request.params;
  const { id: connectedById } = request.user;
  try {
    const connection = await createConnection({ connectedById, connectedWithId });
    return reply.code(201).send(connection);
  } catch (e) {
    console.log(e);
    return reply.code(400).send(e);
  };
};


export async function removeConnectionHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  const { userId: connectedWithId } = request.params;
  const { id: connectedById } = request.user;
  try {
    const result = await removeConnection({ connectedWithId, connectedById });
    return reply.code(200).send(result);
  } catch (e) {
    console.log(e);
    return reply.code(400);
  };
};

export async function getConnectionsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: userId } = request.user;
  try {
    const connections = await getConnections(userId);
    return reply.code(200).send(
      connections.map(({ connectedById, connectedWithId }) => (
        connectedById === userId ? connectedWithId : connectedById
      ))
    );
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};

export async function getConnectionsOfUserHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  const { userId } = request.params;

  console.log(userId)

  try {
    const connections = await getConnections(userId);
    return reply.code(200).send(
      connections.map(({ connectedById, connectedWithId, ...rest }) => (
        connectedById === userId ? rest.connectedWith : rest.connectedBy
      ))
    );
  } catch (error) {
    console.log(error);
    return reply.code(404).send(error);
  };
};

export async function acceptConnectionHandler(
  request: FastifyRequest<{
    Params: {
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  const { userId: connectedById } = request.params;
  const { id: connectedWithId } = request.user;

  try {
    await acceptConnection({ connectedById, connectedWithId });
    return reply.code(204).send();
  } catch (error) {
    console.log(error);
    return reply.code(404).send(error);
  };
};

export async function getConnectionRequestsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id: userId } = request.user;
  try {
    let requests = await getConnectionRequests(userId);
    return requests;
  } catch (error) {
    console.log(error);
    return reply.code(404).send(error);
  };
};


// Profile controls

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


