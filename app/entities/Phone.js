import dbClient from "#app/db/dbClient.js";
import Entity from "./Entity.js";

class Phone extends Entity {
  #number;
  #shop_id;

  constructor({ number, shop }) {
    super();
    this.#number = number;
    this.#shop_id = Entity.entityId(shop);
  }

  async save() {
    const res = await dbClient.insert("phones", [this.#number, this.#shop_id]);
    this._id = res.rows[0].id;

    return res;
  }
}

export default Phone;
