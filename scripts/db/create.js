import dbClient from "#app/db/dbClient.js";
import { create } from "./index.js";

console.log("Создание таблиц...");

await create();
await dbClient.close();

console.log("Таблицы успешно созданы.");
