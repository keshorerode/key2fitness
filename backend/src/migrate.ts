import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DATA_FILE = path.join(__dirname, '../cms-data.json');
const CMS_COLLECTION = 'site_data';
const CMS_DOC = 'cms';

async function migrate() {
  console.log('Starting migration to Firebase Firestore...');

  if (!fs.existsSync(DATA_FILE)) {
    console.error('Local data file not found at:', DATA_FILE);
    process.exit(1);
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    process.exit(1);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    const db = admin.firestore();

    console.log('Reading local data from:', DATA_FILE);
    const localData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    await db.collection(CMS_COLLECTION).doc(CMS_DOC).set(localData, { merge: true });
    console.log('Successfully uploaded data to Firestore collection "site_data", document "cms".');
    
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
