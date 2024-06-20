INSERT INTO phones (number, shop_id) VALUES ($1, $2) RETURNING *;
