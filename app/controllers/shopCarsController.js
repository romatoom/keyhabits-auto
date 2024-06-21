import dbClient from "#app/db/dbClient.js";

async function getPivotData(_, res) {
  let items = [];

  try {
    items = await dbClient.getPivotData();
  } catch (err) {}

  const data = JSON.stringify({
    items,
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

export { getPivotData };
