import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class Shop extends Model {
  #name;

  constructor({ name }) {
    super();
    this.#name = name;
  }

  async save() {
    const res = await dbClient.insert("shops", [this.#name]);
    this._id = res.rows[0].id;

    return res;
  }
}

export default Shop;
