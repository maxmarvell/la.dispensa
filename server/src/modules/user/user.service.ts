import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import { hashPassword } from "../../utils/hash";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
};

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    }
  });
};

export async function findUsers(userId?: string) {
  return prisma.user.findMany({
    where: {
      NOT: {
        id: userId
      }
    },
    select: {
      password: false,
      salt: false,
      email: true,
      image: true,
      id: true,
      username: true,
      connectedWith: true,
      connectedBy: true,
    }
  });
};

export async function addUserPhoto(filepath: string, userId: string) {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      image: filepath
    }
  })
};

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id
    },
    select: {
      password: false,
      salt: false,
      email: true,
      image: true,
      id: true,
      username: true,
      connectedWith: true,
      connectedBy: true,
    }
  });
};



// Connections services

interface connectionInput {
  connectedById: string,
  connectedWithId: string,
};

export async function getConnections(userId: string) {
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        {
          connectedById: userId
        },
        {
          connectedWithId: userId
        }
      ],
      accepted: true
    },
    include: {
      connectedWith: {
        select: {
          username: true,
          image: true,
          id: true
        }
      },
      connectedBy: {
        select: {
          username: true,
          image: true,
          id: true
        }
      }
    }
  });

  return connections.map(({ connectedById, connectedWithId }) => (
    connectedById === userId ? connectedWithId : connectedById
  ));
};

export async function createConnection(input: connectionInput) {
  return prisma.connection.create({
    data: input
  });
};

export async function removeConnection(input: connectionInput) {

  const { connectedById, connectedWithId } = input;

  return prisma.connection.deleteMany({
    where: {
      OR: [
        {
          connectedById,
          connectedWithId
        },
        {
          connectedWithId: connectedById,
          connectedById: connectedWithId
        }
      ]
    }
  });
};

export async function acceptConnection(input: connectionInput) {
  return prisma.connection.update({
    where: {
      ConnectionId: input
    },
    data: {
      accepted: true
    }
  });
};

export async function getConnectionRequests(userId: string) {
  return prisma.connection.findMany({
    where: {
      connectedWithId: userId,
      accepted: false,
    },
    orderBy: {
      createdOn: 'desc'
    },
    include: {
      connectedBy: {
        select: {
          username: true,
          image: true
        }
      }
    }
  });
};


// Profile services

export async function findGalleryRecipes({ userId }: { userId: string }) {

  let recipes = await prisma.recipe.findMany({
    where: {
      authorId: userId,
      public: true,
    },
    include: {
      author: {
        select: {
          username: true,
          id: true
        }
      },
      editors: {
        include: {
          user: {
            select: {
              username: true,
              id: true
            }
          }
        }
      },
    }
  });

  let ratings = await prisma.rating.groupBy({
    by: ['recipeId'],
    where: {
      recipe: {
        authorId: userId
      }
    },
    _avg: { value: true },
    orderBy: {
      _avg: {
        value: "desc"
      }
    },
  });

  // Adding the average rating field to return type of recipes
  return recipes.map(el => {
    let { id } = el;
    let rating = ratings.find(({ recipeId }) => (recipeId === id)) || undefined;
    return { ...el, rating }
  });
};

export async function getRecipeCount({ userId }: { userId: string }) {
  return prisma.recipe.count({
    where: {
      authorId: userId,
      public: true,
    }
  });
};

export async function getConnnectionCount({ userId }: { userId: string }) {
  return prisma.connection.count({
    where: {
      OR: [
        {
          connectedById: userId
        },
        {
          connectedWithId: userId
        }
      ]
    }
  });
};


// Account services

export async function changeUserPassword(input: { id: string, password: string }) {
  const { password, id } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.update({
    where: {
      id
    },
    data: {
      salt,
      password: hash
    }
  });

  return user;
}

