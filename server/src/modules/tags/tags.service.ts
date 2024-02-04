import prisma from "../../utils/prisma";


export async function searchTags({ name, excludeTags }: { name: string, excludeTags: string[] }) {

  return prisma.tag.groupBy({
    by: ['name'],
    where: {
      AND: {
        name: {
          contains: name,
          mode: 'insensitive',
          notIn: excludeTags
        }
      }
    },
    orderBy: {
      _count: {
        recipeId: 'desc'
      }
    },
    take: 10
  });

};