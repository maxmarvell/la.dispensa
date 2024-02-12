import prisma from "../../utils/prisma"

interface infiniteScroll {
  lastCursor?: string,
  take: string,
};

export async function getDashboard(input: infiniteScroll) {

  let { lastCursor, take } = input

  const results = await prisma.recipe.findMany({
    take: parseInt(take as string),
    ...(lastCursor && {
      skip: 1,
      cursor: {
        id: lastCursor,
      }
    }),
    where: {
      public: true
    },
    orderBy: {
      createdOn: "desc",
    },
    include: {
      author: true,
      tags: true
    }
  });

  if (results.length == 0) {
    return {
      recipes: [],
      lastCursor: null,
      hasNextPage: false,
    };
  };

  let ratings = await prisma.rating.groupBy({
    by: ['recipeId'],
    where: {
      recipeId: {
        in: results.map(({ id }) => id)
      }
    },
    _avg: { value: true },
    _count: true
  });

  let reviews = await prisma.review.groupBy({
    by: ['recipeId'],
    where: {
      recipeId: {
        in: results.map(({ id }) => id)
      }
    },
    _count: true
  });

  const lastPostInResults: any = results[results.length - 1];
  const cursor: any = lastPostInResults.id;

  const nextPage = await prisma.recipe.findMany({
    take: parseInt(take as string),
    skip: 1,
    cursor: {
      id: cursor,
    },
    orderBy: {
      createdOn: "desc",
    }
  });

  return {
    recipes: results.map(el => {
      let { id } = el;
      let rating = ratings.find(({ recipeId }) => (recipeId === id)) || undefined;
      let review = reviews.find(({ recipeId }) => (recipeId === id)) || undefined;
      return { ...el, rating, review }
    }),
    lastCursor: cursor,
    hasNextPage: nextPage.length > 0,
  }
};

interface userFeed {
  take: string,
  userId: string,
  username?: string
};

export async function getDashboardUsers(input: userFeed) {

  let { take, userId, username } = input

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  // console.log(user)

  const connections = await prisma.user.findMany({
    where: {
      ...(username && {
        username: {
          contains: username,
          mode: 'insensitive'
        }
      }),
      id: {
        not: userId
      },
      OR: [
        {
          connectedBy: {
            some: {
              connectedById: userId
            }
          }
        },
        {
          connectedWith: {
            some: {
              connectedWithId: userId
            }
          }
        },
      ]
    },
    take: parseInt(take as string),
    select: {
      username: true,
      image: true,
      id: true,
      connectedBy: true,
      connectedWith: true,
    }
  });

  if (connections.length === parseInt(take as string)) {
    return connections;
  }

  const otherUsers = await prisma.user.findMany({
    where: {
      ...(username && {
        username: {
          contains: username,
          mode: 'insensitive'
        }
      }),
      AND: [
        {
          id: {
            not: userId
          }
        },
        {
          id: {
            notIn: connections.map(({ id }) => id)
          }
        }
      ],
    },
    take: parseInt(take as string) - connections.length,
    select: {
      username: true,
      image: true,
      id: true,
      connectedBy: true,
      connectedWith: true,
    }
  });

  return [...connections, ...otherUsers];
};


interface recipeNotificationsFeed {
  userId: string
}

export async function getRecipeNotifications(input: recipeNotificationsFeed) {

  const { userId } = input;

  const connections = await prisma.user.findMany({
    where: {
      OR: [
        {
          connectedBy: {
            some: {
              connectedById: userId
            }
          }
        },
        {
          connectedWith: {
            some: {
              connectedWithId: userId
            }
          }
        }
      ]
    },
    select: {
      id: true
    }
  });

  return prisma.recipe.findMany({
    where: {
      authorId: {
        in: connections.map(({ id }) => id)
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        }
      }
    }
  })

}