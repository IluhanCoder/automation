import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/automation_beta";

const levels = [
  { id: "1", points: 1 },
  { id: "2", points: 1 },
  { id: "3", points: 1 },
  { id: "4", points: 1 },
  { id: "5", points: 1 },
  { id: "6", points: 1 },
];

try {
  await mongoose.connect(mongoUrl);

  const result = await mongoose.connection.db
    .collection("games")
    .updateOne(
      { id: "html-builder" },
      { $set: { name: "HTML Builder", levels } }
    );

  console.log(`matched=${result.matchedCount} modified=${result.modifiedCount}`);
} catch (error) {
  console.error("Failed to update html-builder levels", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
