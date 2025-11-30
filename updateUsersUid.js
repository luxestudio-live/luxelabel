
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateUsersWithUid() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  const batch = db.batch();
  snapshot.forEach(doc => {
    batch.update(doc.ref, { uid: doc.id });
  });

  await batch.commit();
  console.log('All user documents updated with uid field.');
}

updateUsersWithUid().catch(console.error);
