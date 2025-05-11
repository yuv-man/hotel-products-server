import express, { Request, Response, NextFunction, Router } from "express";
import roomRouter from "./rooms/room-route";

interface CustomError extends Error {
  code?: string | number;
}

const router: Router = express.Router();
router
  .use(roomRouter)
  .use((error: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({
      code: error.code,
      message: error.message,
    });
  });

export default router;
