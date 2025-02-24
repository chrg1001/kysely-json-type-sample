import { CamelCasePlugin, Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import type { DB } from './types';

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL is not set');
}

export const dbClient = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool({
      uri: url,
      timezone: 'Z',
    }),
  }),
  plugins: [new CamelCasePlugin()],
});
