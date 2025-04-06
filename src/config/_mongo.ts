import mongoose, { connect } from "mongoose";
import logger from "../utils/logger";
import "dotenv/config";
const MONGO_URI =
	process.env.NODE_ENV === "production"
		? process.env.MONGODB_URI || ""
		: "mongodb://localhost:27017/BusDrivers";
const connectToMongo = async () => {
	try {
		mongoose.set("strictQuery", false);
		await connect(MONGO_URI, { autoCreate: true });
		logger.info("Connected to db");
	} catch (e) {
		logger.error(e);
	}
};

export default connectToMongo;