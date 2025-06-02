import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const collectionsToBackup = ['daily_plans', 'reminders', 'absences', 'users', 'vehicles', 'clients'];

async function backup() {
  const outDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  for (const name of collectionsToBackup) {
    const snap = await db.collection(name).get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(data, null, 2));
    console.log(`✅ ${name} saved (${data.length})`);
  }
}

backup();