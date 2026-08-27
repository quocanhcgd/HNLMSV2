export default () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.API_PORT ?? 4001),
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://lms:lms_dev@127.0.0.1:5432/educ_lms',
  },
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-only-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  },
});
