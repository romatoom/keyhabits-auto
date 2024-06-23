import fs from "node:fs/promises";
import path from "path";
import getCurrentPath from "#app/utils/getCurrentPath.js";
import Model from "#app/models/Model.js";

const queriesFolderPath = `${getCurrentPath(import.meta.url)}/queries`;

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
  #tablesFieldsOrders = {};

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
    dbClientInstance.#initTablesFieldsOrders();

    return dbClientInstance;
  }

  async #initQueries() {
    this.#queries = {};

    try {
      const folders = (
        await fs.readdir(queriesFolderPath, {
          withFileTypes: true,
        })
      )
        .filter((f) => f.isDirectory())
        .map((f) => f.name);

      for (const folderName of folders) {
        this.#queries[folderName] = {};

        const files = await fs.readdir(`${queriesFolderPath}/${folderName}`);

        for (const file of files) {
          var tableName = path.basename(file, ".sql");

          this.#queries[folderName][tableName] = await fs.readFile(
            `${queriesFolderPath}/${folderName}/${file}`,
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

  get queries() {
    return this.#queries;
  }

  #initTablesFieldsOrders() {
    const regex = /\(([^)]+)\)/;

    for (const tableName in this.#queries.insert) {
      const sql = this.#queries.insert[tableName];

      const match = regex.exec(sql);

      this.#tablesFieldsOrders[tableName] = match[1]
        .split(",")
        .map((field) => field.trim());
    }
  }

  get tablesFieldsOrders() {
    return this.#tablesFieldsOrders;
  }

  async createTables() {
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

  async dropTables() {
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

  async insert(tableName, attributes) {
    const fieldsOrder = this.tablesFieldsOrders[tableName];

    const insertedValues = fieldsOrder.map((field) => {
      return field.endsWith("_id")
        ? Model.entityId(attributes[field.replace("_id", "")])
        : attributes[field];
    });

    return this.#db.query(this.#queries.insert[tableName], insertedValues);
  }

  async execQuery(...args) {
    const res = await this.#db.query(...args);
    return res.rows;
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
