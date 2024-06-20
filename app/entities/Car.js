import dbClient from "#app/db/dbClient.js";
import Entity from "./Entity.js";

class Car extends Entity {
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
    
    return res;
  }
}

export default Car;
