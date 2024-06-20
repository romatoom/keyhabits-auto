CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(255),
  model VARCHAR(255),
  UNIQUE(brand, model)
);
