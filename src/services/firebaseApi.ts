import firebase from '../../firebase';

const firebaseApi = {
  createMessage: function (messages) {
    firebase.database().ref('messages').push(messages);
  },

  updateMessages: function (room_id, callback, callback2) {
    firebase
      .database()
      .ref('messages')
      .orderByChild('room_id')
      .equalTo(room_id)
      .on('child_added', snapshot => {
        const {
          text,
          user,
          createdAt,
          _id,
          isReplied,
          to_message_id,
          to_message_text,
          to_user_name,
          to_user_id,
          isDeleted,
          message_replied_isDeleted,
        } = snapshot.val();

        const message = {
          text,
          user,
          createdAt,
          isReplied,
          to_message_id,
          to_message_text,
          to_user_name,
          to_user_id,
          _id,
          isDeleted,
          message_replied_isDeleted,
        };

        callback(message);
      });

    callback2();
  },

  removeMessage: function (user_id: string, roomId: string) {
    const messagesSent: firebase.database.Reference[] = [];

    firebase
      .database()
      .ref('messages')
      .orderByChild('room_id')
      .equalTo(roomId)
      .on('child_added', snapshot => {
        const { user, room_id } = snapshot.val();

        if (user?._id === user_id && room_id === roomId) {
          messagesSent.push(snapshot.ref);
        }
      });

    messagesSent.forEach(message => {
      message.remove();
    });
  },

  removeOneMessage: function (message_id: string) {
    firebase
      .database()
      .ref('messages')
      .orderByChild('_id')
      .equalTo(message_id)
      .on('child_added', snapshot => {
        snapshot.ref.update({
          text: 'Essa mensagem foi deletada',
          isDeleted: true,
        });
      });
  },

  updateReplyMessage: function (message_id: string) {
    firebase
      .database()
      .ref('messages')
      .orderByChild('to_message_id')
      .equalTo(message_id)
      .on('child_added', snapshot => {
        snapshot.ref.update({
          to_message_text: 'Essa mensagem foi deletada',
          message_replied_isDeleted: true,
        });
      });
  },
};

export default firebaseApi;
