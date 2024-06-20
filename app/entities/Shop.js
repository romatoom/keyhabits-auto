import dbClient from "#app/db/dbClient.js";
import Entity from "./Entity.js";

class Shop extends Entity {
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
