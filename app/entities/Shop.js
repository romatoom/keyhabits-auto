import dbClient from "#app/db/dbClient.js";

class Shop {
  #name;

  constructor({ name }) {
    this.#name = name;
  }

  async save() {
    return dbClient.insert("shops", [this.#name]);
  }
}

export default Shop;
