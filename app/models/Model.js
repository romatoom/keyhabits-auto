import dbClient from "#app/db/dbClient.js";

class Model {
  _id;
  #attributes;

  constructor(attributes) {
    this._id = null;
    this.#attributes = attributes;
  }

  get id() {
    return this._id;
  }

  static entityId(entityOrId) {
    return typeof entityOrId === "number" ? entityOrId : entityOrId.id;
  }

  async save() {
    const res = await dbClient.insert(
      this.constructor.tableName,
      this.#attributes
    );

    this._id = res.rows[0].id;

    return res.rows[0];
  }
}

export default Model;
