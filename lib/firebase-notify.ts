import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase';

export async function initNotifications() {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: 'FAKE_VAPID_PUBLIC_KEY'
    });
    console.log('FCM token:', token);
    return token;
  } catch (err) {
    console.warn('FCM init failed:', err);
    return null;
  }
}

export function listenToMessages(callback: (payload: any) => void) {
  const messaging = getMessaging(app);
  onMessage(messaging, payload => {
    callback(payload);
  });
}
