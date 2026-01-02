import { z } from 'zod';
import { insertItinerarySchema, insertMessageSchema, itineraries, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  travel: {
    search: {
      method: 'GET' as const,
      path: '/api/travel/search',
      input: z.object({
        city: z.string(),
      }),
      responses: {
        200: z.object({
          summary: z.string(),
          coordinates: z.object({ lat: z.number(), lon: z.number() }),
          weather: z.any(),
          attractions: z.array(z.object({
            name: z.string(),
            description: z.string(),
            rating: z.number().optional(),
            image: z.string().optional(),
          })),
        }),
      },
    },
  },
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat',
      input: z.object({
        message: z.string(),
      }),
      responses: {
        200: z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        }),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/chat/history',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
  itineraries: {
    list: {
      method: 'GET' as const,
      path: '/api/itineraries',
      responses: {
        200: z.array(z.custom<typeof itineraries.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/itineraries',
      input: insertItinerarySchema,
      responses: {
        201: z.custom<typeof itineraries.$inferSelect>(),
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/itineraries/generate',
      input: z.object({
        city: z.string(),
        days: z.number().min(1).max(14),
        preferences: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof itineraries.$inferSelect>(),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/itineraries/:id',
      responses: {
        200: z.custom<typeof itineraries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
