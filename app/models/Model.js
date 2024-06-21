class Model {
  _id;

  constructor() {
    this._id = null;
  }

  get id() {
    return this._id;
  }

  static modelId(entityOrId) {
    return typeof entityOrId === "number" ? entityOrId : entityOrId.id;
  }
}

export default Model;
