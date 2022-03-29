import firebase, { firebaseConfig } from '../../../firebase';
import firebaseApi from '../../services/firebaseApi';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, BackHandler, LogBox, View } from 'react-native';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from '@react-native-firebase/admob';

import {
  Send,
  GiftedChat,
  InputToolbar,
  Bubble,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InAppReview from 'react-native-in-app-review';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { ThemeContext } from 'styled-components';
import { ReplyFooter } from '../../components/ReplyFooter';
import { Modal, ModalHandles } from '../../components/Modal';
import { Reply } from '../../components/Reply';
import { useChat } from '../../hooks/chat';

import { getDayCountSinceDate } from '../../utils/dateUtils';

interface ChatProps {
  children: ReactNode;
}

interface IUser {
  _id: string | number;
  name: string;
  avatar: string;
}

interface ReplyContent {
  isReplied: boolean;
  to_message_id: string;
  to_message_text: string;
  to_user_name: string;
  to_user_id: string;
}

interface IMessage extends ReplyContent {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: IUser;
  isDeleted: boolean;
  message_replied_isDeleted: boolean;
}

interface IRouteParams {
  id: string;
}

function Chat({ }: ChatProps) {
  const { colors } = useContext(ThemeContext);
  const { createNotification, markMessageAsRead } = useChat();
  const { user } = useAuth();
  const messageOptionsModalRef = useRef<ModalHandles>(null);
  const navigation = useNavigation();

  const route = useRoute();
  const routeParams = route.params as IRouteParams;

  const formatedUser = {
    _id: user?.id,
    name: user?.name,
    avatar: user?.avatar
      ? `https://qandac.herokuapp.com/files/${user?.avatar}`
      : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
  };

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [owner_id, setOwner_id] = useState('');
  const [selectedMessage, setSelectedMessage] = useState({
    message_user_id: '',
    message_id: '',
  });
  const [reply, setReply] = useState<Omit<ReplyContent, 'isReplied'> | null>(
    null,
  );

  const isCurrentUserWhoSentThisMessage =
    selectedMessage.message_user_id === user?.id;

  const showInterstitialAd = useCallback(() => {
    // firebase.initializeApp(firebaseConfig);

    const interstitialAd = InterstitialAd.createForAdRequest(
      process.env.NODE_ENV === 'development'
        ? TestIds.INTERSTITIAL
        : 'ca-app-pub-4182205118133604/6614133011',
    );

    interstitialAd.onAdEvent((type, error) => {
      if (type === AdEventType.LOADED) {
        interstitialAd.show();
      }
    });

    interstitialAd.load();

    navigation.goBack();

    return true;
  }, [navigation]);

  const updatePreviousMessages = useCallback(async message => {
    setLoading(true);

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, message),
    );
  }, []);

  function handleInAppReview(isMessage: boolean) {
    const shouldShow = () => {
      return new Promise(resolve => {
        AsyncStorage.getItem('@Qandac:lastShownReviewPopup').then(lastShownReviewPopup => {
          lastShownReviewPopup = JSON.parse(lastShownReviewPopup);
  
          if (lastShownReviewPopup) {
            resolve(getDayCountSinceDate(lastShownReviewPopup.date) >= 7); // 7 Days cooldown
          } else {
            resolve(true);
          }
        })
      })
    }

    const showPopup = async () => {
      if (await shouldShow()) {
        if (InAppReview.isAvailable()) {
          console.log('InAppReview popup has been triggered.');

          InAppReview.RequestInAppReview()
            .then(success => {
              if (success) {
                console.log('InAppReview flow has been succeeded.');

                // Save current's date in order to calculate cooldown later
                AsyncStorage.setItem('@Qandac:lastShownReviewPopup', JSON.stringify({ date: new Date() }));
              }
            })
            .catch(console.error);
        }
      }
    }

    if (isMessage) {
      showPopup();
    }

    AsyncStorage.getItem('@Qandac:roomHistory').then(roomsHistory => {
      if (roomsHistory) {
        roomsHistory = JSON.parse(roomsHistory);

        if (!roomsHistory.rooms.includes(routeParams.id)) {
          roomsHistory.rooms.push(routeParams.id);
          AsyncStorage.setItem('@Qandac:roomHistory', JSON.stringify(roomsHistory));
        }

        if (roomsHistory.rooms.length >= 3) {
          showPopup();
        }

        if (roomsHistory.rooms.length > 100) { // Clear history to prevent app from using huge storage
          AsyncStorage.setItem('@Qandac:roomHistory', JSON.stringify({ rooms: [] }));
        }
      } else {
        AsyncStorage.setItem('@Qandac:roomHistory', JSON.stringify({ rooms: [routeParams.id] }));
      }
    });
  }

  function handleDismissReplay() {
    setReply(null);
  }

  useEffect(() => {
    LogBox.ignoreAllLogs();

    firebaseApi.updateMessages(routeParams.id, updatePreviousMessages, () =>
      setLoading(false),
    );

    api.get(`/rooms/${routeParams.id}`).then(room => {
      setOwner_id(room.data.owner_id);
    });

    setLoading(false);
  }, [updatePreviousMessages, routeParams.id]);

  useEffect(() => {
    handleInAppReview(false);
  }, [])

  useEffect(() => {
    markMessageAsRead(user?.id, routeParams.id);
  }, [markMessageAsRead, user?.id, routeParams.id]);

  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      showInterstitialAd,
    );

    return () => unsubscribe.remove();
  }, [showInterstitialAd]);

  const handleSendMessage = useCallback(
    async messages => {
      messages.forEach(message => {
        message.createdAt = new Date().getTime();
        message.room_id = routeParams.id;

        if (reply) {
          const {
            to_message_text,
            to_message_id,
            to_user_name,
            to_user_id,
          } = reply;

          firebase
            .database()
            .ref('messages')
            .push({
              ...message,
              isReplied: true,
              to_message_id,
              to_message_text,
              to_user_name,
              to_user_id,
            });

          handleDismissReplay();
        } else {
          firebaseApi.createMessage(message);
        }

        createNotification(user?.id, routeParams.id, message._id);
      });

      if (owner_id === user?.id) {
        return;
      }

      const owner = await api.get(`/users/${owner_id}`);

      if (owner.data.notifications === false) {
        return;
      }

      await api.post('notifications', {
        from_user_id: user?.id,
        user_id: owner_id,
        room_id: routeParams.id,
      });

      handleInAppReview(true);
    },
    [routeParams.id, owner_id, user?.id, reply, createNotification],
  );

  const handleDeleteMessage = useCallback(() => {
    const messageId = selectedMessage.message_id;

    firebaseApi.removeOneMessage(messageId);
    firebaseApi.updateReplyMessage(messageId);
    const newMessages = messages.map(message => {
      if (message._id === messageId) {
        return {
          ...message,
          isDeleted: true,
          text: 'Essa mensagem foi deletada',
        };
      }

      if (message.isReplied) {
        if (message.to_message_id === messageId) {
          return {
            ...message,
            message_replied_isDeleted: true,
            to_message_text: 'Essa mensagem foi deletada',
          };
        }
      }

      return message;
    });

    setMessages(newMessages);
  }, [selectedMessage.message_id, messages]);

  async function handleReplyMessage() {
    const messageToReplay = messages.find(
      message => message._id === selectedMessage.message_id,
    );

    if (!messageToReplay) {
      return;
    }

    setReply({
      to_user_name: messageToReplay.user?.name,
      to_user_id: String(messageToReplay.user?._id),
      to_message_id: String(messageToReplay._id),
      to_message_text: messageToReplay.text,
    });
  }

  if (messages.length === 0 && loading) {
    return <ActivityIndicator size="large" color="#fafafa" />;
  }

  return (
    <>
      <Modal
        ref={messageOptionsModalRef}
        description="O que deseja fazer com essa mensagem?"
        icon="message-circle"
        footerContentStyles={{
          flexDirection: isCurrentUserWhoSentThisMessage ? 'column' : 'row',
        }}
        footer={({ handleModalClose }) => {
          let actions: any[] = [
            {
              label: 'Responder',
              variant: 'solid',
              onPress: async () => {
                await handleReplyMessage();
                handleModalClose();
              },
              style: !isCurrentUserWhoSentThisMessage
                ? {
                  width: 80,
                  marginRight: 14,
                }
                : null,
            },
            {
              label: 'Cancelar',
              variant: 'outline',
              onPress: handleModalClose,
              style: !isCurrentUserWhoSentThisMessage
                ? {
                  width: 80,
                }
                : null,
            },
          ];

          if (isCurrentUserWhoSentThisMessage) {
            actions.unshift({
              label: 'Excluir',
              variant: 'solid',
              onPress: async () => {
                await handleDeleteMessage();
                handleModalClose();
              },
            });
          }

          return actions;
        }}
      />
      <GiftedChat
        user={formatedUser}
        messages={messages}
        renderCustomView={props => {
          const message = props.currentMessage;

          if (!message) {
            return;
          }

          if (!message.isReplied) {
            return null;
          }

          return (
            <Reply
              to_message_text={message.to_message_text}
              to_user_name={message.to_user_name}
              to_user_id={message.to_user_id}
              user_id={String(message.user?._id)}
            />
          );
        }}
        onSend={handleSendMessage}
        renderUsernameOnMessage
        showUserAvatar={false}
        messagesContainerStyle={{
          paddingBottom: 10,
        }}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: colors.secundary,
              borderRadius: 10,
              marginLeft: 20,
              marginRight: 20,
              borderTopWidth: 0,
              marginBottom: 10,
            }}
          />
        )}
        placeholder="Digite aqui..."
        textInputProps={{
          color: colors.text,
        }}
        renderSend={props => {
          return (
            <Send
              {...props}
              containerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.primary,
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                }}>
                <Icon name="send" size={30} color="#000" />
              </View>
            </Send>
          );
        }}
        renderChatFooter={() => {
          if (reply) {
            return (
              <ReplyFooter
                to_message_text={reply.to_message_text}
                to_user_name={reply.to_user_name}
                handleDismissReplay={handleDismissReplay}
              />
            );
          }

          return null;
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              containerStyle={{
                left: props.currentMessage?.to_user_id === user?.id && {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  width: '100%',
                  padding: 5,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                },
                right: {},
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: colors.primary,
                  padding: 6,
                  borderRadius: 8,
                  marginBottom: 4,
                },
                left: {
                  backgroundColor: colors.secundary,
                  padding: 6,
                  borderRadius: 8,
                  marginBottom: 4,
                },
              }}
              textStyle={{
                right: {
                  color: props.currentMessage?.isDeleted ? '#595959' : '#000',
                  fontStyle: props.currentMessage?.isDeleted
                    ? 'italic'
                    : 'normal',
                },
                left: {
                  color: props.currentMessage?.isDeleted
                    ? '#727074'
                    : colors.chatText,
                  fontStyle: props.currentMessage?.isDeleted
                    ? 'italic'
                    : 'normal',
                },
              }}
            />
          );
        }}
        renderTime={() => null}
        alwaysShowSend
        onLongPress={(_, message) => {
          if (message.isDeleted) {
            return;
          }

          setSelectedMessage({
            message_user_id: message.user?._id,
            message_id: message._id,
          });
          messageOptionsModalRef.current?.handleModalOpen();
        }}
      />
    </>
  );
}

export default Chat;
