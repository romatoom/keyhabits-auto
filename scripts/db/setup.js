import dbClient from "#app/db/dbClient.js";
import { create, seed } from "./index.js";

console.log("Создание таблиц и заполение их фейковыми данными...");

await create();
await seed();

await dbClient.close();

console.log("Таблицы созданы и заполнены данными.");
