import dbClient from "#app/db/dbClient.js";

class Car {
  #brand;
  #model;

  constructor({ brand, model }) {
    this.#brand = brand;
    this.#model = model;
  }

  async save() {
    return dbClient.insert("cars", [this.#brand, this.#model]);
  }
}

export default Car;
