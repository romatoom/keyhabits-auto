import dbClient from "#app/db/dbClient.js";
import Model from "./Model.js";

class ShopCar extends Model {
  #shop_id;
  #car_id;
  #price;

  constructor({ shop, car, price }) {
    super();
    this.#shop_id = Model.entityId(shop);
    this.#car_id = Model.entityId(car);
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

  static async getPivotData() {
    return dbClient.execQuery(dbClient.queries.select.pivotData);
  }
}

export default ShopCar;
