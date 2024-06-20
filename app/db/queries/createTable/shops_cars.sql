CREATE TABLE IF NOT EXISTS shops_cars (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER REFERENCES shops (id),
  car_id INTEGER REFERENCES cars (id),
  price INTEGER,
  UNIQUE(shop_id, car_id)
);

ALTER TABLE shops_cars
  ADD CONSTRAINT fk_shopscars_shops
  FOREIGN KEY (shop_id)
  REFERENCES shops (id);

ALTER TABLE shops_cars
  ADD CONSTRAINT fk_shopscars_cars
  FOREIGN KEY (car_id)
  REFERENCES cars (id);
