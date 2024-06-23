import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class Shop extends Model {
  static tableName = "shops";
}

export default Shop;
