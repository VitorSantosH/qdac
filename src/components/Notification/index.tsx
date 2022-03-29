import React from 'react';
import {isSameDay, parseISO, subHours, format} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {
  Container,
  Header,
  UserInfo,
  UserAvatar,
  UserName,
  Description,
  Content,
} from './styles';

interface NotificationProps {
  notificationProps: {
    from_user: {
      avatar: string;
      name: string;
    };
    room: {
      name: string;
      question: {
        title: string;
      };
    };
    created_at: string;
  };
}

function Notification({notificationProps}: NotificationProps) {
  const date = subHours(parseISO(notificationProps.created_at), 3);

  const sameDay = isSameDay(date, new Date());

  const formattedDate = sameDay
    ? format(date, 'k:mm')
    : format(date, 'd MMM', {locale: ptBR});

  return (
    <Container>
      <Header>
        <UserInfo>
          <UserAvatar
            source={{
              uri: notificationProps.from_user.avatar
                ? `https://qandac.herokuapp.com/files/${notificationProps.from_user.avatar}`
                : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
            }}
          />
          <UserName>{notificationProps.from_user.name}</UserName>
        </UserInfo>

        <Description>{formattedDate}</Description>
      </Header>
      <Content numberOfLines={3}>
        Acabou de mandar uma mensagem na {notificationProps.room.name} sobre{' '}
        {notificationProps.room.question.title}
      </Content>
    </Container>
  );
}

export default Notification;
