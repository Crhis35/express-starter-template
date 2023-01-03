import { config } from 'dotenv';
import { ServerConfig, validateEnvFile } from './environment/types';
import validateEnv from './environment/validateEnv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
validateEnv();
const input = JSON.parse(Buffer.from(process.env.SERVER_CONFIG, 'base64').toString());

const result = validateEnvFile.safeParse(input);

if (!result.success) console.log((result as Record<string, unknown>)?.error);

export const environment = (result as Record<string, unknown>)?.data as ServerConfig;

console.table(environment.databases);
