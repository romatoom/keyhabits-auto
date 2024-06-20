CREATE TABLE IF NOT EXISTS phones (
  id SERIAL PRIMARY KEY,
  number VARCHAR(50) UNIQUE,
  shop_id INTEGER REFERENCES shops (id)
);

ALTER TABLE phones
  ADD CONSTRAINT fk_phones_shops
  FOREIGN KEY (shop_id)
  REFERENCES shops (id);
