import { FastifyReply } from "fastify"
import { searchTags } from "./tags.service"
import { FastifyRequest } from "fastify"



export async function searchTagsHandler(
  request: FastifyRequest<{
    Querystring: {
      name: string,
      excludeTags: string
    }
  }>,
  reply: FastifyReply
) {
  try {

    const { excludeTags, name } = request.query;
    let exlude = excludeTags.split(',');

    const tags = searchTags({
      name, excludeTags: exlude
    });
    return tags;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}