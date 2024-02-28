import fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyIO from 'fastify-socket.io';
import fastifyCors from "@fastify/cors";
import Redis from 'ioredis';
import closeWithGrace from 'close-with-grace';
import { randomUUID } from 'crypto';

dotenv.config()

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT;

// count key and channel
const CONNECTION_COUNT_KEY = "test-kitchen:connection-count"
const CONNECTION_COUNT_UPDATED_CHANNEL = "test-kitchen:connection-count-updated"

const NODE_DRAG_CHANNEL = "test-kitchen:node-drag-channel";
const NODE_SELECT_CHANNEL = "test-kitchen:node-select-channel";
const NODE_CREATE_CHANNEL = "test-kitchen:node-create-channel";
const NODE_DELETE_CHANNEL = "test-kitchen:node-delete-channel";

const INGREDIENT_CREATE_CHANNEL = "test-kitchen:ingredient-create-channel";
const INGREDIENT_UPDATE_CHANNEL = "test-kitchen:ingredient-update-channel";
const INGREDIENT_DELETE_CHANNEL = "test-kitchen:ingredient-delete-channel";

const INSTRUCTION_CREATE_CHANNEL = "test-kitchen:instruction-create-channel";
const INSTRUCTION_UPDATE_CHANNEL = "test-kitchen:instruction-update-channel";
const INSTRUCTION_DELETE_CHANNEL = "test-kitchen:instruction-delete-channel";

const COMMENT_FEED_CHANNEL = "test-kitchen:comment-feed-channel";


if (!REDIS_ENDPOINT) {
    console.error("missing")
    process.exit(1)
}

const publisher = new Redis(REDIS_ENDPOINT);
const subscriber = new Redis(REDIS_ENDPOINT);

let connectedClients = 0;

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
        io: any;
    }
}

async function buildServer() {
    const app = fastify();

    await app.register(fastifyCors, {
        origin: CORS_ORIGIN,
    });

    await app.register(fastifyIO);

    const currentCount = await publisher.get(CONNECTION_COUNT_KEY);

    // set a default value
    if (!currentCount) {
        await publisher.set(CONNECTION_COUNT_KEY, 0);
    };

    app.io.on("connection", async (io: any) => {

        // handle increase connection count
        connectedClients++;
        const incResult = await publisher.incr(CONNECTION_COUNT_KEY);

        // publish change
        await publisher.publish(
            CONNECTION_COUNT_UPDATED_CHANNEL,
            String(incResult)
        );

        // handle node drags
        io.on(NODE_DRAG_CHANNEL, async (payload: any) => {
            const { layout, userId } = payload;

            if (!layout) return;

            await publisher.publish(NODE_DRAG_CHANNEL, JSON.stringify(payload))
        });

        // handle node creation
        io.on(NODE_CREATE_CHANNEL, async (payload: any) => {
            await publisher.publish(NODE_CREATE_CHANNEL, JSON.stringify(payload))
        });

        // handle node delete
        io.on(NODE_DELETE_CHANNEL, async (payload: any) => {
            let { iterationId } = payload;

            if (!iterationId) return;

            await publisher.publish(NODE_DELETE_CHANNEL, JSON.stringify(payload));
        });

        // ingredient mutations
        io.on(INGREDIENT_CREATE_CHANNEL, async (payload: any) => {
            await publisher.publish(INGREDIENT_CREATE_CHANNEL, JSON.stringify(payload));
        });

        io.on(INGREDIENT_DELETE_CHANNEL, async (payload: any) => {
            await publisher.publish(INGREDIENT_DELETE_CHANNEL, JSON.stringify(payload));
        });

        io.on(INGREDIENT_UPDATE_CHANNEL, async (payload: any) => {
            await publisher.publish(INGREDIENT_UPDATE_CHANNEL, JSON.stringify(payload));
        });

        // preparation mutations
        io.on(INSTRUCTION_CREATE_CHANNEL, async (payload: any) => {
            await publisher.publish(INSTRUCTION_CREATE_CHANNEL, JSON.stringify(payload));
        });

        io.on(INSTRUCTION_DELETE_CHANNEL, async (payload: any) => {
            await publisher.publish(INSTRUCTION_DELETE_CHANNEL, JSON.stringify(payload));
        });

        io.on(INSTRUCTION_UPDATE_CHANNEL, async (payload: any) => {
            await publisher.publish(INSTRUCTION_UPDATE_CHANNEL, JSON.stringify(payload));
        });

        // comments
        io.on(COMMENT_FEED_CHANNEL, async (payload: any) => {
            await publisher.publish(COMMENT_FEED_CHANNEL, JSON.stringify(payload));
        });

        // handle disconncetion
        io.on("disconnect", async () => {
            connectedClients--;
            const decrResult = await publisher.decr(CONNECTION_COUNT_KEY);
            await publisher.publish(
                CONNECTION_COUNT_UPDATED_CHANNEL,
                String(decrResult)
            );
        });
    });

    subscriber.subscribe(CONNECTION_COUNT_UPDATED_CHANNEL, (err, count) => {
        if (err) {
            console.error(
                `Error subscribing to ${CONNECTION_COUNT_UPDATED_CHANNEL}`,
                err
            );
            return;
        }

        console.log(
            `${count} clients subscribes to ${CONNECTION_COUNT_UPDATED_CHANNEL} channel`
        );
    });

    subscriber.subscribe(NODE_DRAG_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${NODE_DRAG_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${NODE_DRAG_CHANNEL} channel`
        );
    });

    subscriber.subscribe(NODE_CREATE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${NODE_CREATE_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${NODE_CREATE_CHANNEL} channel`
        );
    });

    subscriber.subscribe(NODE_DELETE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${NODE_DELETE_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${NODE_DELETE_CHANNEL} channel`
        );
    });

    // ingredient mutations
    subscriber.subscribe(INGREDIENT_CREATE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${INGREDIENT_CREATE_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${INGREDIENT_CREATE_CHANNEL} channel`
        );
    });

    subscriber.subscribe(INGREDIENT_DELETE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${INGREDIENT_DELETE_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${INGREDIENT_DELETE_CHANNEL} channel`
        );
    });

    subscriber.subscribe(INGREDIENT_UPDATE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${INGREDIENT_UPDATE_CHANNEL}`);
            return;
        };

        console.log(
            `${count} clients subscribes to ${INGREDIENT_UPDATE_CHANNEL} channel`
        );
    });

    // preparation mutations
    subscriber.subscribe(INSTRUCTION_CREATE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${INSTRUCTION_CREATE_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${INSTRUCTION_CREATE_CHANNEL} channel`
        );
    });

    subscriber.subscribe(INSTRUCTION_DELETE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${INSTRUCTION_DELETE_CHANNEL}`);
            return;
        }

        console.log(
            `${count} clients subscribes to ${INSTRUCTION_DELETE_CHANNEL} channel`
        );
    });

    subscriber.subscribe(INSTRUCTION_UPDATE_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${INSTRUCTION_UPDATE_CHANNEL}`);
            return;
        };

        console.log(
            `${count} clients subscribes to ${INSTRUCTION_UPDATE_CHANNEL} channel`
        );
    });

    subscriber.subscribe(COMMENT_FEED_CHANNEL, (err, count) => {
        if (err) {
            console.error(`Error subscribing to ${COMMENT_FEED_CHANNEL}`);
            return;
        };

        console.log(
            `${count} clients subscribes to ${COMMENT_FEED_CHANNEL} channel`
        );
    });


    subscriber.on("message", (channel, message) => {
        if (channel === CONNECTION_COUNT_UPDATED_CHANNEL) {
            app.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
                count: message,
            });

            return;
        };


        if (channel === NODE_DRAG_CHANNEL) {

            let { userId, layout, recipeId } = JSON.parse(message);

            console.log(JSON.parse(message))

            app.io.emit(NODE_DRAG_CHANNEL, {
                layout,
                userId,
                recipeId,
                id: randomUUID(),
                port: PORT,
            });
        };

        if (channel === NODE_CREATE_CHANNEL) {
            let { userId, newNode, newEdge, recipeId } = JSON.parse(message);

            app.io.emit(NODE_CREATE_CHANNEL, {
                newNode,
                newEdge,
                userId,
                recipeId,
                id: randomUUID(),
                port: PORT,
            });
        };

        if (channel === NODE_DELETE_CHANNEL) {
            let { userId, iterationId } = JSON.parse(message);

            app.io.emit(NODE_DELETE_CHANNEL, {
                iterationId,
                userId,
                id: randomUUID(),
                port: PORT,
            });
        };

        if (channel === INGREDIENT_CREATE_CHANNEL) {
            let { recipeId, userId, newIngredients, iterationId } = JSON.parse(message);

            app.io.emit(INGREDIENT_CREATE_CHANNEL, {
                iterationId,
                newIngredients,
                userId,
                recipeId,
                id: randomUUID(),
                port: PORT
            });
        };

        if (channel === INGREDIENT_DELETE_CHANNEL) {
            let { recipeId, userId, ingredientId, iterationId } = JSON.parse(message);

            app.io.emit(INGREDIENT_DELETE_CHANNEL, {
                iterationId,
                ingredientId,
                userId,
                recipeId,
                id: randomUUID(),
                port: PORT
            });
        };

        if (channel === INGREDIENT_UPDATE_CHANNEL) {
            let { recipeId, userId, ingredient, iterationId, ingredientId } = JSON.parse(message);

            app.io.emit(INGREDIENT_UPDATE_CHANNEL, {
                iterationId,
                ingredientId,
                userId,
                recipeId,
                ingredient,
                id: randomUUID(),
                port: PORT
            });
        };

        // preparation mutations
        if (channel === INSTRUCTION_CREATE_CHANNEL) {
            let { recipeId, userId, newInstructions, iterationId } = JSON.parse(message);

            app.io.emit(INSTRUCTION_CREATE_CHANNEL, {
                iterationId,
                newInstructions,
                userId,
                recipeId,
                id: randomUUID(),
                port: PORT
            });
        };

        if (channel === INSTRUCTION_DELETE_CHANNEL) {
            let { recipeId, userId, step, iterationId } = JSON.parse(message);

            app.io.emit(INSTRUCTION_DELETE_CHANNEL, {
                iterationId,
                step,
                userId,
                recipeId,
                id: randomUUID(),
                port: PORT
            });
        };

        if (channel === INSTRUCTION_UPDATE_CHANNEL) {
            let { recipeId, userId, instruction, iterationId } = JSON.parse(message);

            app.io.emit(INSTRUCTION_UPDATE_CHANNEL, {
                iterationId,
                userId,
                recipeId,
                instruction,
                id: randomUUID(),
                port: PORT
            });
        };

        if (channel === COMMENT_FEED_CHANNEL) {
            let { userId, newComment } = JSON.parse(message);

            app.io.emit(COMMENT_FEED_CHANNEL, {
                userId,
                newComment,
                id: randomUUID(),
                port: PORT,
            });
        };
    });

    app.get("/healthcheck", () => {
        return {
            status: "ok",
            port: PORT,
        };
    });

    return app;
}

async function main() {
    const app = await buildServer();

    try {
        await app.listen({
            port: PORT,
            host: HOST,
        });

        closeWithGrace({ delay: 2000 }, async ({ signal, err }) => {
            if (connectedClients > 0) {
                const currentCount = parseInt(
                    (await publisher.get(CONNECTION_COUNT_KEY)) || "0",
                    10
                );

                const newCount = Math.max(currentCount - connectedClients, 0);

                await publisher.set(CONNECTION_COUNT_KEY, newCount);
            }

            await app.close();
        });

        console.log(`Server started at http://${HOST}:${PORT}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();