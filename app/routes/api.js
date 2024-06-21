import express from "express";
import * as shopsCarsController from "#app/controllers/shopCarsController.js";

const router = express.Router();
router.get("/pivot-table", shopsCarsController.getPivotData);

export default router;
