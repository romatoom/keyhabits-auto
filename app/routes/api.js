import express from "express";
import * as controllerShopsCars from "#app/controllers/controllerShopsCars.js";

const router = express.Router();

// Роутер для отображения таблицы цен на автомобили
router.get("/shops-cars/pivot-table", controllerShopsCars.getPivotTable);

export default router;
