// Модель для таблицы телефонов, с указанием магазина, которому принадлежит этот номер

import Model from "./Model.js";

class Phone extends Model {
  static tableName = "phones";
}

export default Phone;
