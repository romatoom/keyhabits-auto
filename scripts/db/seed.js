import dbClient from "#app/db/dbClient.js";
import { seed } from "./index.js";

console.log("Заполнение таблиц фейковыми данными...");

await seed();
await dbClient.close();

console.log("Данные добавлены.");
