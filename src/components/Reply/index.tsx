import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';

interface ReplayProps {
  to_user_id: string;
  user_id: string;
  to_user_name: string;
  to_message_text: string;
}

export function Reply({
  to_user_name,
  to_message_text,
  to_user_id,
  user_id,
}: ReplayProps) {
  const { user } = useAuth();
  const { colors } = useContext(ThemeContext);

  const isCurrentUserMessage = user_id === user?.id;

  return (
    <View>
      <View>
        <View
          style={{
            backgroundColor: isCurrentUserMessage ? colors.primary : '',
            borderRadius: 15,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                height: 50,
                width: 4,
                backgroundColor: colors.background,
              }}
            />
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  color: colors.background,
                  paddingHorizontal: 10,
                  paddingTop: 4,
                  fontWeight: '700',
                }}>
                {user?.id === to_user_id ? 'Você' : to_user_name}
              </Text>
              <Text
                style={{
                  color: colors.textSecundary,
                  paddingHorizontal: 10,
                  paddingTop: 5,
                  paddingBottom: 4,
                }}>
                {to_message_text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
