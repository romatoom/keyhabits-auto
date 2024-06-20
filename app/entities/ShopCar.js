import dbClient from "#app/db/dbClient.js";

class ShopCar {
  #shop_id;
  #car_id;
  #price

  constructor({ shop_id, car_id, price }) {
    this.#shop_id = shop_id;
    this.#car_id = car_id;
    this.#price = price;
  }

  async save() {
    return dbClient.insert("shops_cars", [this.#shop_id, this.#car_id, this.#price]);
  }
}

export default ShopCar;
