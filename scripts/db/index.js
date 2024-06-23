import dbClient from "#app/db/dbClient.js";

import Car from "#app/models/Car.js";
import Phone from "#app/models/Phone.js";
import Shop from "#app/models/Shop.js";
import ShopCar from "#app/models/ShopCar.js";

async function create() {
  return dbClient.createTables();
}

async function drop() {
  return dbClient.dropTables();
}

async function seed() {
  /***** cars *****/
  const carsData = [
    { brand: "Toyota", model: "Camry" },
    { brand: "Honda", model: "Civic" },
    { brand: "Ford", model: "Mustang" },
    { brand: "BMW", model: "3 Series" },
    { brand: "Nissan", model: "Altima" },
    { brand: "Chevrolet", model: "Silverado" },
    { brand: "Hyundai", model: "Sonata" },
    { brand: "Volkswagen", model: "Jetta" },
    { brand: "Subaru", model: "Outback" },
    { brand: "Kia", model: "Sorento" },
    { brand: "Mazda", model: "CX-5" },
    { brand: "Jeep", model: "Wrangler" },
    { brand: "Mercedes-Benz", model: "C-Class" },
    { brand: "Acura", model: "TLX" },
    { brand: "Audi", model: "A4" },
    { brand: "Lexus", model: "ES" },
    { brand: "Infiniti", model: "Q50" },
    { brand: "Cadillac", model: "XT5" },
    { brand: "Volvo", model: "XC90" },
    { brand: "Genesis", model: "G80" },
    { brand: "Porsche", model: "Cayenne" },
    { brand: "Tesla", model: "Model Y" },
    { brand: "Buick", model: "Enclave" },
    { brand: "GMC", model: "Sierra" },
    { brand: "Ram", model: "1500" },
    { brand: "Mitsubishi", model: "Outlander" },
    { brand: "Dodge", model: "Challenger" },
    { brand: "Fiat", model: "500" },
    { brand: "Land Rover", model: "Range Rover" },
  ];

  const cars = await saveData(Car, carsData);

  /***** shops *****/
  const shopsData = [
    { name: "Premium Auto" },
    { name: "Speed Motors" },
    { name: "Cartown" },
    { name: "Wheels & Deals" },
    { name: "Auto Empire" },
    { name: "Ride Right" },
    { name: "Velocity Cars" },
    { name: "Auto Emporium" },
    { name: "Cruiser Outlet" },
    { name: "Automotive Legends" },
  ];

  const shops = await saveData(Shop, shopsData);

  /***** phones *****/
  let phonesData = [
    { number: "111-111-111", shop: 1 },
    { number: "987-654-321", shop: 1 },
    { number: "222-222-222", shop: 2 },
    { number: "211-623-131", shop: 2 },
    { number: "333-333-333", shop: 3 },
    { number: "782-234-422", shop: 3 },
    { number: "444-444-444", shop: 4 },
    { number: "986-235-133", shop: 4 },
    { number: "555-555-555", shop: 5 },
    { number: "422-552-841", shop: 5 },
    { number: "666-666-666", shop: 6 },
    { number: "777-777-777", shop: 7 },
    { number: "888-888-888", shop: 8 },
    { number: "999-999-999", shop: 9 },
    { number: "123-456-789", shop: 10 },
  ].map((phonesDataItem, index) => ({
    ...phonesDataItem,
    shop: shops[index % shops.length],
  }));

  await saveData(Phone, phonesData);

  /***** shops_cars *****/
  const shopsCarsData = [];

  for (const shop of shops) {
    for (const car of cars) {
      const price = (car.id + shop.id) * 1000;
      shopsCarsData.push({ shop, car, price });
    }
  }

  await saveData(ShopCar, shopsCarsData);

  /********/

  async function saveData(_class, data) {
    const promises = data.map((d) => new _class(d).save());
    return Promise.all(promises);
  }
}

export { create, drop, seed };
