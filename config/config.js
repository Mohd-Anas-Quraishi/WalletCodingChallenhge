import dotenv from 'dotenv';

dotenv.config();

const config = {
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  serverPort: process.env.SERVER_PORT,
};

export default config;
