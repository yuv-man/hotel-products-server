import express from "express";
import router from "./router.js";
import cors from 'cors';

class Server {
  constructor() {
    const app = express();
    
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true
    }));

    app.use(express.json());
    app.use(router);

    this.app = app;
  }
  
  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(5000, () => {
        resolve(this.server);
        console.log("server started", `http://localhost:5000`);
      });
    });
  }
}

export const server = new Server();
