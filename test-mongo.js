const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

async function testAtlas() {
  if (!uri) {
    console.error('MONGODB_URI is not set.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas.');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in DB:', collections.map((c) => c.name));

    await mongoose.disconnect();
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err);
    process.exit(1);
  }
}

testAtlas();
