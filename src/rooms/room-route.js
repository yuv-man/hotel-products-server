import express from "express";
import { getReservationSummaries } from "./products.service.js";
import { reservationCache } from './cache.js';

const router = express.Router();
const BASE_PATH = "/api/reservations";

router
  .route(BASE_PATH)
  // find all
  .get(async (req, res, next) => {
    const reservationSummaries = await getReservationSummaries();
    res.send(reservationSummaries);
  });

// Add cache-clearing endpoint as a separate route
router.post(`${BASE_PATH}/clear-cache`, (req, res) => {
  reservationCache.invalidate();
  res.sendStatus(200);
});

router
  .route(`${BASE_PATH}/:id`)
  // get one
  .get((req, res, next) => {
    const reservationUuid = req.params.id;
    const products = getProductsByReservationUuid(reservationUuid);
    res.send(products);
  })

export default router;
