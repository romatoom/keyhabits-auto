import fs from "node:fs/promises";
import path from "path";
import getCurrentPath from "#app/utils/getCurrentPath.js";
import Model from "#app/models/Model.js";

// путь до папки, в которой хранятся тексты запросов к БД
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
  // инстанс клиента для работы с БД
  #db;

  // здесь хранятся тексты sql-запросов
  #queries;

  // определяет порядок полей для каждой из таблиц (используется для вставки данных в БД)
  #tablesFieldsOrders = {};

  // Порядок создания таблиц
  static #tableCreationOrder = ["cars", "shops", "phones", "shops_cars"];

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

  // Функция для создания и настройки инстанса DatabaseClient
  static async init({ user, host, database, password, port }) {
    const dbClientInstance = new DatabaseClient({
      user,
      host,
      database,
      password,
      port,
    });

    // формируем объект, хранящий тексты запросов к БД
    await dbClientInstance.#initQueries();

    // Определяем порядок полей для таблиц (на основе порядка полей в INSERT запросах)
    dbClientInstance.#initTablesFieldsOrders();

    return dbClientInstance;
  }

  // Инициализируем объект, хранящий тексты sql-запросов
  async #initQueries() {
    this.#queries = {};

    try {
      // подпапки в папке с запросами
      const folders = (
        await fs.readdir(queriesFolderPath, {
          withFileTypes: true,
        })
      )
        .filter((f) => f.isDirectory())
        .map((f) => f.name);

      // заполняем объект для хранения запросов
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

  // Инициализируем объект, хранящий порядок полей для вставки данных для каждой из таблиц
  #initTablesFieldsOrders() {
    const regex = /\(([^)]+)\)/;

    // С помощью цикла проходим по всем sql запросам для вставки данных
    for (const tableName in this.#queries.insert) {
      const sql = this.#queries.insert[tableName];

      // Находим содержимое первых скобок (там содержатся поля для вставки в нужном порядке)
      const match = regex.exec(sql);

      // Сохраняем порядок полей для каждой таблицы
      this.#tablesFieldsOrders[tableName] = match[1]
        .split(",")
        .map((field) => field.trim());
    }
  }

  get tablesFieldsOrders() {
    return this.#tablesFieldsOrders;
  }

  // Создание таблиц в БД
  async createTables() {
    try {
      // Выполняем запросы по созданию таблиц в нужном порядке
      for (var tableName of DatabaseClient.#tableCreationOrder) {
        await this.#db.query(this.#queries.createTable[tableName]);
      }
    } catch (err) {
      console.error(err);
      await this.close();
      throw Error(`Ошибка при создании таблицы ${tableName}`);
    }
  }

  // Создание таблиц из БД
  async dropTables() {
    try {
      // Выполняем запросы по удалению таблиц в порядке, обратном их созданию
      for (var tableName of DatabaseClient.#tableCreationOrder.reverse()) {
        await this.#db.query(this.#queries.dropTable[tableName]);
      }
    } catch (err) {
      console.error(err);
      await this.close();
      throw Error(`Ошибка при удалении таблицы ${tableName}`);
    }
  }

  // Вставка данных в таблицу
  async insert(tableName, attributes) {
    const fieldsOrder = this.tablesFieldsOrders[tableName];

    // Формируем из объекта атрибутов массив данных для вставки, исходя из порядка полей
    // Если поле хранит ссылку на id из другой таблицы (имеет окончание _id),
    // то вместо самого аттрибута используем его id (с помощью Model.entityId)
    const insertedValues = fieldsOrder.map((field) => {
      return field.endsWith("_id")
        ? Model.entityId(attributes[field.replace("_id", "")])
        : attributes[field];
    });

    return this.#db.query(this.#queries.insert[tableName], insertedValues);
  }

  // Возможность выполнения произвользого запроса к БД
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
