import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";
dotenv.config();
dotenv.config({ path: `.env.${environment}`, override: true });

export const port = Number(process.env.PORT) || 4000;
export const databaseUrl = process.env.DATABASE_URL;
export const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
