import express from "express";
import { customerRouter } from "./routers/Customer.Routes";
import { CustomerControllers } from "./controllers/Customer.Controllers";

export class ApiServer {
  public static run = async (
    port: number,
    customerControllers: CustomerControllers  
  ): Promise<void> => {
    const app = express();
    
    app.use(express.json());

    app.get("/", (req, res) => res.send("Pong!"));

    app.use('/customers', customerRouter(customerControllers))

    app.listen(port, () => {
      console.log("Server is running");
    });
  };
}
