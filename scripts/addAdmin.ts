import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // или serviceAccount
  });
}

const db = admin.firestore();

async function addAdmin() {
  const email = 'merkon.rl@gmail.com';
  const name = 'Romans Latvels';

  try {
    // Добавим пользователя в Authentication, если его ещё нет
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('Пользователь уже существует:', userRecord.uid);
    } catch (error) {
      userRecord = await admin.auth().createUser({
        email,
        password: 'RomansDumlers1993',
        displayName: name,
      });
      console.log('Создан новый пользователь:', userRecord.uid);
    }

    // Добавим роль admin в Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Администратор успешно добавлен в Firestore ✅');
  } catch (err) {
    console.error('Ошибка при добавлении администратора:', err);
  }
}

addAdmin();
