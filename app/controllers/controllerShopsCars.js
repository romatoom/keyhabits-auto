import ShopCar from "#app/models/ShopCar.js";

// Контроллер для отображения таблицы цен на автомобили (с указанием их модели и марки) в различных магазинах (с телефонами магазинов)
async function getPivotTable(_, res) {
  let items = [];

  try {
    // Получаем данные из соответвующей модели
    items = await ShopCar.getPivotData();
  } catch (err) {}

  const data = JSON.stringify({
    // Данные таблицы
    items,

    // Заголовки для столбцов
    column_titles: {
      car_brand: "Марка авто",
      car_model: "Модель авто",
      price: "Цена",
      shop_name: "Название магазина",
      shop_phones: "Номер телефона магазина",
    },
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(data);
  res.end();
}

export { getPivotTable };
