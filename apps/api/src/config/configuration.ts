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
    // access 15 phút + refresh 7 ngày (docs/05-api/api-spec.md §1)
    accessTtlSeconds: Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900),
    refreshTtlSeconds: Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 604800),
  },
});
