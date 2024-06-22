import express from "express";
import * as controllerShopsCars from "#app/controllers/controllerShopsCars.js";

const router = express.Router();
router.get("/shops-cars/pivot-table", controllerShopsCars.getPivotTable);

export default router;
