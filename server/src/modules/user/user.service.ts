import prisma from "../../utils/prisma";
import { CreateConnectionInput, CreateUserInput } from "./user.schema";
import { hashPassword } from "../../utils/hash";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
}

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
      email: false,
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
}


export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: {
      id
    },
    select: {
      email: true,
      username: true,
      image: true,
    }
  });
};



// Connections services

export async function createConnection(input: CreateConnectionInput) {
  return prisma.connection.create({
    data: input
  });
};

export async function deleteConnection(connectedWithId: string, connectedById: string) {
  return prisma.connection.delete({
    where: {
      ConnectionId: {
        connectedWithId,
        connectedById
      }
    }
  });
};

export async function getConnections(userId: string) {

  return prisma.connection.findMany({
    where: {
      connectedById: userId,
      accepted: true
    },
    include: {
      connectedWith: {
        select: {
          username: true,
          image: true,
          id: true
        }
      }
    }
  })
}


export async function getConnectedBy({ userId }: { userId: string }) {
  return prisma.connection.findMany({
    where: {
      connectedWithId: userId,
      accepted: true,
    },
    include: {
      connectedBy: {
        select: {
          username: true,
          image: true,
          id: true
        }
      }
    }
  })
}

interface acceptConnectionInput {
  connectedById: string,
  userId: string
}

export async function acceptConnection({ connectedById, userId }: acceptConnectionInput) {
  return prisma.connection.update({
    where: {
      ConnectionId: { connectedWithId: userId, connectedById }
    },
    data: {
      accepted: true
    }
  })
}


// Profile services

export async function findGalleryRecipes({ userId }: { userId: string }) {

  let rated = await prisma.rating.groupBy({
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
    take: 10,
  });



  let recipes = await prisma.recipe.findMany({
    where: {
      id: {
        in: rated.map(({ recipeId }) => recipeId)
      }
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
      }
    }
  })

  // Adding the average rating field to return typr of recipes
  return rated.map(({ _avg, recipeId }) => ({ averageRating: _avg.value, ...recipes.find(({ id }) => id === recipeId) }));
};


// Account services

export async function changeUserPassword(input : { id: string, password: string}) {
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

