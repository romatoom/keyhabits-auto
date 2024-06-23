import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class Phone extends Model {
  #number;
  #shop_id;

  constructor({ number, shop }) {
    super();
    this.#number = number;
    this.#shop_id = Model.entityId(shop);
  }

  async save() {
    const res = await dbClient.insert("phones", [this.#number, this.#shop_id]);
    this._id = res.rows[0].id;

    return res.rows[0];
  }
}

export default Phone;
