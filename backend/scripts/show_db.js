import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/researchhub';

async function displayDatabase() {
  console.log('\n======================================================');
  console.log('🍃 RESEARCHHUB MONGODB DATABASE INSPECTOR');
  console.log(`📡 Connection URI: ${MONGODB_URI}`);
  console.log('======================================================\n');

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    console.log(`📁 Database: researchhub (${collections.length} collections found)\n`);

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`------------------------------------------------------`);
      console.log(`📦 Collection: [ ${col.name} ] (${count} documents)`);
      console.log(`------------------------------------------------------`);

      const docs = await db.collection(col.name).find().limit(3).toArray();
      if (docs.length === 0) {
        console.log('  (Collection is empty)');
      } else {
        docs.forEach((doc, idx) => {
          console.log(`\n  Document #${idx + 1}:`);
          if (col.name === 'publications') {
            console.log(`    • ID:     ${doc.id}`);
            console.log(`    • Title:  ${doc.title}`);
            console.log(`    • Author: ${doc.facultyName} (${doc.department})`);
            console.log(`    • Status: ${doc.status}`);
            console.log(`    • Year:   ${doc.year} [${doc.type}]`);
          } else if (col.name === 'faculties') {
            console.log(`    • ID:         ${doc.id}`);
            console.log(`    • Name:       ${doc.name}`);
            console.log(`    • Department: ${doc.department}`);
            console.log(`    • Email:      ${doc.email}`);
            console.log(`    • Citations:  ${doc.citations || 0} | h-index: ${doc.hIndex || 0}`);
          } else if (col.name === 'users') {
            console.log(`    • ID:    ${doc.id}`);
            console.log(`    • Name:  ${doc.name}`);
            console.log(`    • Role:  ${doc.role}`);
            console.log(`    • Email: ${doc.email}`);
          } else if (col.name === 'pdfrequests') {
            console.log(`    • ID:          ${doc.id}`);
            console.log(`    • Paper:       "${doc.publicationTitle}"`);
            console.log(`    • Author:      ${doc.facultyName}`);
            console.log(`    • Requester:   ${doc.requesterName} (${doc.requesterEmail})`);
            console.log(`    • Status:      ${doc.status}`);
          } else {
            console.log(JSON.stringify(doc, null, 2));
          }
        });
        if (count > 3) {
          console.log(`\n  ... and ${count - 3} more documents in this collection.`);
        }
      }
      console.log('\n');
    }

    console.log('======================================================');
    console.log('✅ All collections successfully queried from MongoDB!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

displayDatabase();
