import express from "express";
import fs from "fs";
import { resolve } from "path";
import { API_URL } from "#app/constants.js";
import getCurrentPath from "#app/utils/getCurrentPath.js";

const router = express.Router();

router.get("/", async (_, res) => {
  let html = await fs.promises.readFile(
    resolve(getCurrentPath(import.meta.url), "../../public/index.html"),
    "utf8"
  );

  // Прокидываем API_URL в html (для доступа к API_URL из скриптов на фронте)
  html = html.replace(
    "###script-constants###",
    `<script>const API_URL="${API_URL}"</script>`
  );

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(html);
  res.end();
});

export default router;
