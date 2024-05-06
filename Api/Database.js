import mongoose from "mongoose";
import { MONGO_DB } from "./Config/index.js";
import Logger from "./Helpers/Logger.js";

export default class Database {
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      try {
        const connection = await mongoose.connect(MONGO_DB, {});
        this.instance = connection.connection;
        Logger.info("=> DB STATE: Database connected");
        return this.instance;
      } catch (err) {
        Logger.error("=> DB STATE:",err.message);
        throw new Error(err.message);
      }
    }

    return this.instance;
  }
}
