import express, { Request, Response, NextFunction } from "express";
import { getReservationSummaries, getProductsByReservationUuid } from "./products.service";
import { reservationCache } from './cache';

const router = express.Router();
const BASE_PATH = "/api/reservations";

router
  .route(BASE_PATH)
  // find all
  .get(async (_req: Request, res: Response, _next: NextFunction) => {
    const reservationSummaries = await getReservationSummaries();
    res.send(reservationSummaries);
  });

// Add cache-clearing endpoint as a separate route
router.post(`${BASE_PATH}/clear-cache`, (_req: Request, res: Response) => {
  reservationCache.invalidate();
  res.sendStatus(200);
});

router
  .route(`${BASE_PATH}/:id`)
  // get one
  .get((_req: Request, res: Response, _next: NextFunction) => {
    const reservationUuid = _req.params.id;
    const products = getProductsByReservationUuid(reservationUuid);
    res.send(products);
  })

export default router;
