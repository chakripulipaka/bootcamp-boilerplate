import * as path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv'

const __dirname = path.resolve()
dotenv.config({ path: path.resolve(__dirname, '.env') })

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

let database

export const connectToServer = async () => {
    try {
      // Connect the client to the server
      await client.connect();
      
      // Verify connection by pinging the database
      await client.db(process.env.DATABASE_NAME).command({ ping: 1 });
      console.log("✅ MongoDB cluster connection established successfully!");

      const { databases } = await client.db().admin().listDatabases();
      const exists = databases.some(d => d.name === process.env.DATABASE_NAME);
      if (!exists) {
        throw new Error(`Database name ${process.env.DATABASE_NAME} not found on server (check your DATABASE_NAME environment variable!).`);
      }

      database = client.db(process.env.DATABASE_NAME);
      console.log(`✅ Connection to database "${process.env.DATABASE_NAME}" established successfully!`);
      return true; // Return success status
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err);
      return false; // Return failure status
    }
};

export const getDb = () => {
  return database
}
