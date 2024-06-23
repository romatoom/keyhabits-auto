import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class Car extends Model {
  static tableName = "cars";
}

export default Car;
