const { MongoClient } = require("mongodb");

const db = async function () {
  const url = "mongodb://localhost:27017/";
  const client = new MongoClient(url);
  await client.connect();
  const database = client.db("week-6");
  return database;
};

const collections = async () => {
  const database = await db();
  return {
    adminCollection: database.collection("admins"),
    userCollection: database.collection("users"),
  };
};

module.exports = collections;
