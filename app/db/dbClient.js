import fs from "node:fs/promises";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

const currentPath = dirname(fileURLToPath(import.meta.url));

import {
  PG_USER as user,
  PG_HOST as host,
  PG_DATABASE as database,
  PG_PASSWORD as password,
  PG_PORT as port,
} from "#app/constants.js";

import pkg from "pg";
const { Client } = pkg;

class DatabaseClient {
  #db;
  #queries;

  constructor({ user, host, database, password, port }) {
    this.#db = new Client({
      user,
      host,
      database,
      password,
      port,
    });

    this.#db.connect();
  }

  static async init({ user, host, database, password, port }) {
    const dbClientInstance = new DatabaseClient({
      user,
      host,
      database,
      password,
      port,
    });

    await dbClientInstance.#initQueries();
    await dbClientInstance.#dropTables();
    await dbClientInstance.#createTables();

    return dbClientInstance;
  }

  async #initQueries() {
    this.#queries = {};

    try {
      const folders = (
        await fs.readdir(`${currentPath}/queries`, {
          withFileTypes: true,
        })
      )
        .filter((f) => f.isDirectory())
        .map((f) => f.name);

      for (const folder of folders) {
        this.#queries[folder] = {};

        const files = await fs.readdir(`${currentPath}/queries/${folder}`);

        for (const file of files) {
          var tableName = path.basename(file, ".sql");

          this.#queries[folder][tableName] = await fs.readFile(
            `${currentPath}/queries/${folder}/${file}`,
            {
              encoding: "utf8",
            }
          );
        }
      }
    } catch (err) {
      console.error(err);
      await this.close();
      throw Error(`Ошибка при инициализации набора запросов`);
    }
  }

  async #createTables() {
    console.log("Создание таблиц");

    const tableCreationOrder = ["cars", "shops", "phones", "shops_cars"];

    try {
      for (var tableName of tableCreationOrder) {
        await this.#db.query(this.#queries.createTable[tableName]);
      }
    } catch (err) {
      console.error(err);
      await this.close();
      throw Error(`Ошибка при создании таблицы ${tableName}`);
    }
  }

  async #dropTables() {
    console.log("Удаление таблиц");

    const tableDropOrder = ["shops_cars", "phones", "cars", "shops"];

    try {
      for (var tableName of tableDropOrder) {
        await this.#db.query(this.#queries.dropTable[tableName]);
      }
    } catch (err) {
      console.error(err);
      await this.close();
      throw Error(`Ошибка при удалении таблицы ${tableName}`);
    }
  }

  async seed() {
    /*console.log("Заполнение таблиц тестовыми данными");

    try {
      const files = await fs.readdir(`${currentPath}/sql/seeds`);

      const queries = [];

      for (const fileName of files) {
        var tableName = path.basename(fileName, ".sql");

        const sql = await fs.readFile(`${currentPath}/sql/seeds/${fileName}`, {
          encoding: "utf8",
        });

        const rowJSON = await fs.readFile(
          `${currentPath}/sql/seeds/${tableName}.json`,
          {
            encoding: "utf8",
          }
        );

        const values = JSON.parse(rowJSON);

        queries.push(this.#db.query(sql, values));
      }

      await Promise.all(queries);
    } catch (err) {
      console.error(err);
      await this.close();
      throw Error(`Ошибка при создании сидов для таблицы ${tableName}`);
    }*/
  }

  async insert(tableName, values) {
    return this.#db.query(this.#queries.insert[tableName], values);
  }

  async close() {
    return this.#db.end();
  }
}

const dbClient = await DatabaseClient.init({
  user,
  host,
  database,
  password,
  port,
});

export default dbClient;