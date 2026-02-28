const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lahorivenkatesh709:p0SkcBwHo67ghvMW@cluster0.y8ucl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('pebly-database');
    const result = await db.collection('subscriptions').updateMany(
      { userId: '69989e0b7edbb8598f05e7f8' },
      {
        $set: {
          planType: 'PRO',
          isActive: true,
          status: 'ACTIVE',
          aiPagesGenerated: 0,
          aiFieldsGenerated: 0
        }
      },
      { upsert: true }
    );
    console.log(`Updated subscriptions. Matched = ${result.matchedCount}, Modified = ${result.modifiedCount}, UpsertedId = ${result.upsertedId}`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
