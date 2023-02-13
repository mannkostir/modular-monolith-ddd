import * as process from 'process';

export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 5432,
  },
  globalPrefix: process.env.GLOBAL_PREFIX,
});
