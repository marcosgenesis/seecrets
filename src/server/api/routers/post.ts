import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(3),
        content: z.string().min(3),
        senderId: z.string(),
        uniqueView: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          senderId: input.senderId,
          uniqueView: input.uniqueView,
        },
      });
    }),

  getRandomPost: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: {
          views: {
            gte: 0,
          },
          senderId: {
            not: input.userId,
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      await ctx.db.post.update({
        where: {
          id: post.id,
        },
        data: {
          views: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
      });
      return post;
    }),
  like: publicProcedure
    .input(z.object({ senderId: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.like.create({
        data: {
          senderId: input.senderId,
          postId: input.postId,
        },
      });
    }),
  removeLike: publicProcedure
    .input(z.object({ senderId: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.like.deleteMany({
        where: {
          senderId: input.senderId,
          postId: input.postId,
        },
      });
    }),
  deslike: publicProcedure
    .input(z.object({ senderId: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deslike.create({
        data: {
          senderId: input.senderId,
          postId: input.postId,
        },
      });
    }),

  removeDeslike: publicProcedure
    .input(z.object({ senderId: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.deslike.deleteMany({
        where: {
          senderId: input.senderId,
          postId: input.postId,
        },
      });
    }),
  getAllFromUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.post.findMany({
        where: {
          senderId: input.userId,
        },
        include: {
          comments: true,
        },
      });
    }),
});
