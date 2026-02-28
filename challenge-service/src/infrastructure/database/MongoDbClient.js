import mongoose from 'mongoose';
import "dotenv/config";

export class MongoDbClient {
    static async connect() {
        try {
            const conn = await mongoose.connect(
                process.env.MONGO_URI, {dbName: process.env.MONGO_DB_NAME},
            );
            console.log(`MongoDB is connected: ${conn.connection.host}`)
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}