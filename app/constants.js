import dotenv from "dotenv";
dotenv.config();

const { PORT, DOMAIN, PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT } =
  process.env;

const HOST = `${DOMAIN}:${PORT}`;
const API_URL = `${HOST}/api`;

export {
  HOST,
  PORT,
  DOMAIN,
  API_URL,
  PG_USER,
  PG_HOST,
  PG_DATABASE,
  PG_PASSWORD,
  PG_PORT,
};
