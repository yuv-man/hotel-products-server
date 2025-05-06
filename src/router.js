import express from "express";
import roomRouter from "./rooms/room-route.js";

const router = express.Router();
router
  .use(roomRouter)
  .use((error, req, res, next) => {
    res.status(500).send({
      code: error.code,
      message: error.message,
    });
  });

export default router;
