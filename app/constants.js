import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;
const HOST = `${DOMAIN}:${PORT}`;

const API_URL = `${HOST}/api`;

export { HOST, PORT, DOMAIN, API_URL };
