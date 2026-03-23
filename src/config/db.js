import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection Successfully");

    const collection = mongoose.connection.collection("documents");

    try {
      await collection.dropIndex("company_1_employeeName_1_joiningDate_1");
      console.log(" Dropped employeeName index");
    } catch (err) {
      console.log(" employeeName index not found");
    }

    try {
      await collection.dropIndex("company_1_candidateName_1_joiningDate_1");
      console.log(" Dropped candidateName index");
    } catch (err) {
      console.log(" candidateName index not found");
    }
  } catch (error) {
    console.log("Database Connection Failed", error.message);
    process.exit(1);
  }
};

export default dbConnection;
