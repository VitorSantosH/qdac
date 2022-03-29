import { useCallback } from 'react';
import firebase from 'firebase';

import api from '../services/api';
import { getUnreadMessagesNotifications } from '../utils/getUnreadRoomMessages';

export interface Notification {
  id: string | number;
  from_user_id: string;
  to_user_id: string;
  room_id: string;
  message_id: string;
  isRead: boolean;
  deliveryAt: Date;
  readAt: Date | undefined;
}

/**
 * Quando essa aplicação crescer, essa implementação com certeza vai causar problemas de performece.
 * Não conseguimos fazer filtros "complexos" no firebase database realtime.
 * O ideal seria usar uma alternativa ja pronta de chat, como por exemplo o
 * GetStream/stream-chat-react-native/.
 */
export function useChat() {
  function markMessageAsRead(user_id: string, room_id: string) {
    try {
      firebase
        .database()
        .ref('notifications/messages')
        .orderByChild('to_user_id')
        .equalTo(user_id)
        .once('value', messagesNotifications => {
          if (!messagesNotifications) {
            return;
          }

          const parsedMessagesNotifications = getUnreadMessagesNotifications(
            messagesNotifications,
            user_id,
            room_id,
          );

          parsedMessagesNotifications.forEach(message => {
            firebase
              .database()
              .ref(`/notifications/messages/${message.id}`)
              .set({
                isRead: true,
              });
          });
        });
    } catch (err) {
      console.error(err);
    }
  }

  async function createNotification(
    from_user_id: string,
    room_id: string,
    message_id: string,
  ) {
    const participants = await api.get(`/rooms/${room_id}/participants`);
    const data: any[] = participants.data;

    try {
      for (let participant of data) {
        if (participant.user_id === from_user_id) {
          continue;
        }

        firebase.database().ref('notifications/messages').push({
          from_user_id,
          to_user_id: participant.user_id,
          room_id,
          message_id,
          isRead: false,
          deliveryAt: Date.now(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchUnreadMessagesNotifications = useCallback(
    async (room_id: string, user_id: string, callback: any) => {
      firebase
        .database()
        .ref('/notifications/messages')
        .orderByChild('to_user_id')
        .equalTo(user_id)
        .on('value', notification => {
          if (!notification) {
            return;
          }

          const notificationsParsed = getUnreadMessagesNotifications(
            notification,
            user_id,
            room_id,
          );

          callback(notificationsParsed);
        });
    },
    [],
  );

  return {
    createNotification,
    markMessageAsRead,
    fetchUnreadMessagesNotifications,
  };
}
