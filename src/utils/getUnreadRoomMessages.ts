import firebase from 'firebase';

interface Message {
  id: string | number;
  from_user_id: string;
  to_user_id: string;
  room_id: string;
  message_id: string;
  isRead: boolean;
  deliveryAt: Date;
  readAt: Date | undefined;
}

type MessageFirebase = Record<string, Omit<Message, 'id'>>;

export function getUnreadMessagesNotifications(
  snapshot: firebase.database.DataSnapshot,
  user_id: string,
  room_id: string,
) {
  const notificationMessagesSnapshot = snapshot.val();
  const firebaseNotificationMessages: MessageFirebase =
    notificationMessagesSnapshot ?? {};

  const parsedNotificationMessages = Object.entries(
    firebaseNotificationMessages,
  ).map(([key, value]) => {
    return {
      id: key,
      room_id: value.room_id,
      to_user_id: value.to_user_id,
      from_user_id: value.from_user_id,
      message_id: value.message_id,
      readAt: value.readAt,
      isRead: value.isRead,
      deliveryAt: value.deliveryAt,
    };
  });

  const filteredNotification = parsedNotificationMessages.filter(
    notification => {
      return (
        notification.to_user_id === user_id &&
        notification.room_id === room_id &&
        !notification.isRead
      );
    },
  );

  return filteredNotification;
}
