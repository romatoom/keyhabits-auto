import dbClient from "#app/db/dbClient.js";
import Entity from "./Entity.js";

class ShopCar extends Entity {
  #shop_id;
  #car_id;
  #price;

  constructor({ shop, car, price }) {
    super();
    this.#shop_id = Entity.entityId(shop);
    this.#car_id = Entity.entityId(car);
    this.#price = price;
  }

  async save() {
    const res = await dbClient.insert("shops_cars", [
      this.#shop_id,
      this.#car_id,
      this.#price,
    ]);

    this._id = res.rows[0].id;

    return res;
  }
}

export default ShopCar;
