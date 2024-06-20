import dbClient from "#app/db/dbClient.js";

import Car from "#app/entities/Car.js";
import Phone from "#app/entities/Phone.js";
import Shop from "#app/entities/Shop.js";
import ShopCar from "#app/entities/ShopCar.js";

// import { randIntMinMax } from "#app/utils/randomizer.js";

const carsData = [
  ["Toyota", "Camry"],
  ["Honda", "Civic"],
  ["Ford", "Mustang"],
  ["BMW", "3 Series"],
  ["Nissan", "Altima"],
  ["Chevrolet", "Silverado"],
  ["Hyundai", "Sonata"],
  ["Volkswagen", "Jetta"],
  ["Subaru", "Outback"],
  ["Kia", "Sorento"],
  ["Mazda", "CX-5"],
  ["Jeep", "Wrangler"],
  ["Mercedes-Benz", "C-Class"],
  ["Acura", "TLX"],
  ["Audi", "A4"],
  ["Lexus", "ES"],
  ["Infiniti", "Q50"],
  ["Cadillac", "XT5"],
  ["Volvo", "XC90"],
  ["Genesis", "G80"],
  ["Porsche", "Cayenne"],
  ["Tesla", "Model Y"],
  ["Buick", "Enclave"],
  ["GMC", "Sierra"],
  ["Ram", "1500"],
  ["Mitsubishi", "Outlander"],
  ["Dodge", "Challenger"],
  ["Fiat", "500"],
  ["Land Rover", "Range Rover"],
];

const shopsData = [
  ["Premium Auto"],
  ["Speed Motors"],
  ["Cartown"],
  ["Wheels & Deals"],
  ["Auto Empire"],
  ["Ride Right"],
  ["Velocity Cars"],
  ["Auto Emporium"],
  ["Cruiser Outlet"],
  ["Automotive Legends"],
];

const phonesData = [
  ["111-111-111", 1],
  ["987-654-321", 1],
  ["222-222-222", 2],
  ["211-623-131", 2],
  ["333-333-333", 3],
  ["782-234-422", 3],
  ["444-444-444", 4],
  ["986-235-133", 4],
  ["555-555-555", 5],
  ["422-552-841", 5],
  ["666-666-666", 6],
  ["777-777-777", 7],
  ["888-888-888", 8],
  ["999-999-999", 9],
  ["123-456-789", 10],
];

const shopsCarsData = [];

for (let shop_id = 1; shop_id <= shopsData.length; shop_id++) {
  for (let car_id = 1; car_id <= carsData.length; car_id++) {
    const price = (car_id + shop_id) * 1000;
    shopsCarsData.push([shop_id, car_id, price]);
  }
}

let promises;

const cars = carsData.map((d) => new Car({ brand: d[0], model: d[1] }));
promises = [];
for (const car of cars) {
  promises.push(car.save());
}
await Promise.all(promises);

const shops = shopsData.map((d) => new Shop({ name: d[0] }));
promises = [];
for (const shop of shops) {
  promises.push(shop.save());
}
await Promise.all(promises);

const phones = phonesData.map((d) => {
  return new Phone({ number: d[0], shop_id: d[1] });
});

promises = [];
for (const phone of phones) {
  promises.push(phone.save());
}
await Promise.all(promises);

const shopsCars = shopsCarsData.map((d) => {
  return new ShopCar({ shop_id: d[0], car_id: d[1], price: d[2] });
});

promises = [];
for (const shopCar of shopsCars) {
  promises.push(shopCar.save());
}
await Promise.all(promises);

await dbClient.close();
