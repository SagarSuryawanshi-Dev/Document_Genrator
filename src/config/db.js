import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection Successfully");

    const collection = mongoose.connection.collection("documents");

    // 🔍 Print all indexes (VERY IMPORTANT for debugging)
    const indexes = await collection.indexes();
    console.log("📌 Existing Indexes:", indexes);

    // ❌ Drop OLD employeeId unique index (THIS is your real problem)
    try {
      await collection.dropIndex("employeeId_1");
      console.log("✅ Dropped employeeId_1 index");
    } catch (err) {
      console.log("⚠️ employeeId_1 index not found");
    }

    // (Optional cleanup - keep your old ones if needed)
    try {
      await collection.dropIndex("company_1_employeeName_1_joiningDate_1");
      console.log("✅ Dropped employeeName index");
    } catch (err) {
      console.log("⚠️ employeeName index not found");
    }

    try {
      await collection.dropIndex("company_1_candidateName_1_joiningDate_1");
      console.log("✅ Dropped candidateName index");
    } catch (err) {
      console.log("⚠️ candidateName index not found");
    }

  } catch (error) {
    console.log("Database Connection Failed", error.message);
    process.exit(1);
  }
};

export default dbConnection;