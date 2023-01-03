import { z } from 'zod';

export const validateEnvFile = z.object({
  nodeEnv: z.string().optional().default('development'),
  server: z.object({
    port: z.number(),
    apiPrefix: z.string().optional(),
    origin: z.array(z.string()),
    credentials: z.boolean(),
  }),
  logs: z.object({
    format: z.string(),
    directory: z.string(),
  }),
  databases: z.array(
    z.object({
      key: z.string(),
      clientUrl: z.string().optional(),
      port: z.number().optional(),
      dbName: z.string().optional(),
      host: z.string().optional(),
      type: z.enum(['mongo', 'mysql', 'mariadb', 'postgresql', 'sqlite', 'better-sqlite']),
      user: z.string().optional(),
      password: z.string().optional(),
    }),
  ),
});

export type ServerConfig = z.infer<typeof validateEnvFile>;
