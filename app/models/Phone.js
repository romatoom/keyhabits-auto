import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class Phone extends Model {
  static tableName = "phones";

  valide() {
    return typeof this.brand === "string" && typeof this.model === "string";
  }
}

export default Phone;
