import express from "express";
import { customerRouter } from "./routers/Customer.Routes";
import { CustomerControllers } from "./controllers/Customer.Controllers";
import { RestaurantControllers } from "./controllers/Restaurant.Controllers";
import { restaurantRouter } from "./routers/Restaurant.Routes";

export class ApiServer {
  public static run = async (
    port: number,
    customerControllers: CustomerControllers,
    restaurantControllers: RestaurantControllers
  ): Promise<void> => {
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => res.send("Pong!"));

    app.use("/customers", customerRouter(customerControllers));
    app.use("/restaurants", restaurantRouter(restaurantControllers));

    app.listen(port, () => {
      console.log("Server is running");
    });
  };
}
