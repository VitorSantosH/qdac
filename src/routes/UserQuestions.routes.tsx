/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { ThemeContext } from 'styled-components';
import UserQuestionsPage from '../pages/UserQuestions';
import { useAuth } from '../hooks/auth';

const Questions = createStackNavigator();

const UserQuestions: React.FC = () => {
  const { colors } = useContext(ThemeContext);
  const { user } = useAuth();

  const navigation = useNavigation();

  return (
    <Questions.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#312E38' },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomColor: colors.lineSeparator,
          borderBottomWidth: 1,
        },
        headerTintColor: `${colors.text}`,
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 30,
        },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 25 }}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={30} color={`${colors.text}`} />
          </TouchableOpacity>
        ),
      }}>
      <Questions.Screen
        name="UserQuestionsPage"
        component={UserQuestionsPage}
        initialParams={{ isProfile: false, userId: user?.id, isEditable: true }}
        options={{
          headerTitle: 'Suas Perguntas',
          headerTintColor: `${colors.text}`,

          headerLeft: () => null,
        }}
      />
    </Questions.Navigator>
  );
};

export default UserQuestions;
