import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class Car extends Model {
  #brand;
  #model;

  constructor({ brand, model }) {
    super();
    this.#brand = brand;
    this.#model = model;
  }

  async save() {
    const res = await dbClient.insert("cars", [this.#brand, this.#model]);
    this._id = res.rows[0].id;

    return res.rows[0];
  }
}

export default Car;
