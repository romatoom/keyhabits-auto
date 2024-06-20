INSERT INTO shops_cars (shop_id, car_id, price) VALUES ($1, $2, $3) RETURNING *;
