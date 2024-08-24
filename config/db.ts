import mongoose from "mongoose";
const dbURL = process.env.dbURL || "";
export const dbConnection = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("db is connected successfully");
  } catch (error) {}
};
