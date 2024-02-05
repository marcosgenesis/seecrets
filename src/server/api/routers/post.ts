import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
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
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish()
      }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.post.findMany({
        where: {
          senderId: input.userId,
        },
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
              deslikes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor
      }
    }),
  commentPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        userId: z.string(),
        comment: z
          .string()
          .min(3, { message: "Comentário deve ter no mínimo 3 caracteres" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.comment.create({
        data: {
          postId: input.postId,
          content: input.comment,
          senderId: input.userId,
        },
      });
    }),
  getPostById: publicProcedure.input(z.object({ postId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.post.findUnique({
      where: {
        id: input.postId,
      },
      include: {
        comments: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            deslikes: true,
          },
        },
      }
    });
  })
});
