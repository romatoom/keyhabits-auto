// Модель для таблицы о автомобилях в магазинах (а также цене)

import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class ShopCar extends Model {
  static tableName = "shops_cars";

  static async getPivotData() {
    return dbClient.execQuery(dbClient.queries.select.pivotData);
  }
}

export default ShopCar;
