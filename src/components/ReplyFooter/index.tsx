import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from 'styled-components';

import FeatherIcon from 'react-native-vector-icons/Feather';

interface ReplayFooterProps {
  to_user_name: string;
  to_message_text: string;
  handleDismissReplay: () => void;
}

export function ReplyFooter({
  to_user_name,
  to_message_text,
  handleDismissReplay,
}: ReplayFooterProps) {
  const { colors } = useContext(ThemeContext);

  return (
    <View
      style={{
        height: 50,
        width: '100%',
        flexDirection: 'row',
      }}>
      <View
        style={{
          height: 50,
          width: 5,
          backgroundColor: colors.primary,
        }}
      />
      <View style={{ flexDirection: 'column' }}>
        <Text
          style={{
            color: colors.primary,
            paddingLeft: 10,
            paddingTop: 5,
          }}>
          {to_user_name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: colors.textSecundary,
            paddingLeft: 10,
            paddingTop: 5,
            width: 240,
          }}>
          {to_message_text}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 10,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingRight: 18,
        }}>
        <TouchableOpacity onPress={handleDismissReplay}>
          <FeatherIcon name="x" color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
