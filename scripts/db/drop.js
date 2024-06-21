import dbClient from "#app/db/dbClient.js";
import { drop } from "./index.js";

console.log("Удаление таблиц...");

await drop();
await dbClient.close();

console.log("Таблицы удалены");
