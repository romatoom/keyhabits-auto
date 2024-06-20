import express from "express";
import { PORT, API_URL } from "#app/constants.js";
import fs from "fs";
import dbClient from "#app/db/dbClient.js";

const app = express();

app.use(express.static("public", { index: false }));

app.get("/", async (req, res) => {
  let html = await fs.promises.readFile("./public/index.html", "utf8");

  // Прокидываем API_URL в html
  html = html.replace(
    "###script-constants###",
    `<script>const API_URL="${API_URL}"</script>`
  );

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(html);
  res.end();
});

app.get("/api/pivot-table", async (req, res) => {
  const items = await dbClient.getPivotData();

  const data = JSON.stringify({
    items,
    column_names_hashes: {
      car_brand: "Марка",
      car_model: "Модель",
      price: "Цена",
      shop_name: "Магазин",
      shop_phones: "Номер телефона",
    },
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(data);
  res.end();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
