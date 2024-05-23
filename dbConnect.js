const { MongoClient } = require("mongodb");

const db = async function () {
  try {
    const url = "mongodb://localhost:27017/";
    const client = new MongoClient(url);
    await client.connect();
    const database = client.db("week-6");
    return database;
  } catch (error) {
    console.log(error);
  }
};

const mongo = async () => {
  const database = await db();
  return {
    adminCollection: database.collection("admins"),
    userCollection: database.collection("users"),
  
  };
};

module.exports = mongo

