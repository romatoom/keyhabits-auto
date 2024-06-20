import dbClient from "#app/db/dbClient.js";

class Phone {
  #number;
  #shop_id;

  constructor({ number, shop_id }) {
    this.#number = number;
    this.#shop_id = shop_id;
  }

  /*#shop_id() {
    return typeof this.#shop === "number" ? this.#shop : this.#shop.id
  }*/

  async save() {
    return dbClient.insert("phones", [this.#number, this.#shop_id]);
  }
}

export default Phone;
