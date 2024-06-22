class Model {
  _id;

  constructor() {
    this._id = null;
  }

  get id() {
    return this._id;
  }

  static entityId(entityOrId) {
    return typeof entityOrId === "number" ? entityOrId : entityOrId.id;
  }
}

export default Model;
