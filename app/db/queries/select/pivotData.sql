SELECT
  cars.brand AS car_brand,
  cars.model AS car_model,
  shops_cars.price AS price,
  shops.name AS shop_name,
  array_agg(phones.number) AS shop_phones
FROM shops_cars
INNER JOIN cars ON shops_cars.car_id = cars.id
INNER JOIN shops ON shops_cars.shop_id = shops.id
INNER JOIN phones ON phones.shop_id = shops.id
GROUP BY shops.id, cars.id, shops_cars.price
ORDER BY cars.brand, cars.model;
