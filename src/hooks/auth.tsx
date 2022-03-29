/* eslint-disable prettier/prettier */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import api from '../services/api';
import { SOCIAL_AUTH } from '../services/socialAuth';

interface AuthState {
  token: string;
  user: IUser;
}

interface SignInData {
  email: string;
  password: string;
}

interface IUser {
  avatar: string | null;
  created_at: Date;
  email: string;
  id: string;
  name: string;
  username: string | null;
  blocked_date: Date | null;
  updated_at: Date;
  notifications: boolean;
}

interface AuthContextData {
  user: IUser | null;
  loading: boolean;
  signIn(credentials: SignInData): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): Promise<void>;
  updateUsername(username: string): Promise<void>;
  signWithFacebook(): Promise<void>;
  signWithGoogle(): Promise<void>;
  signUpWithGoogle(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@Qandac:token',
        '@Qandac:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    if (response.data.msg === 'User blocked') {
      Alert.alert(
        'Usuário bloqueado',
        'Sua conta foi bloqueada temporiariamente e não poderá fazer login na aplicação',
      );
      return;
    }

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@Qandac:token', token],
      ['@Qandac:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = async () => {
    await AsyncStorage.multiRemove(['@Qandac:token', '@Qandac:user']);

    setData({} as AuthState);
  };

  const updateUser = useCallback(
    async (user: IUser) => {
      await AsyncStorage.setItem('@Qandac:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data],
  );

  const updateUsername = useCallback(
    async (username: string) => {
      const userUpdated = {
        token: data.token,
        user: {
          ...data.user,
          username,
        },
      };

      await AsyncStorage.setItem('@Qandac:user', JSON.stringify(userUpdated));

      setData(userUpdated);
    },
    [data],
  );

  const signWithFacebook = useCallback(async () => {
    try {
      const profile = await SOCIAL_AUTH.facebook.login(['email']);

      const { accessToken } = profile;

      const response = await api.post<AuthState>(
        `/sessions/facebook/${accessToken}`,
      );

      const { user, token } = response.data;

      await AsyncStorage.multiSet([
        ['@Qandac:token', token],
        ['@Qandac:user', JSON.stringify(user)],
      ]);

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({
        token,
        user,
      });
    } catch (err: any) {
      throw new Error(err);
    }
  }, []);

  const signWithGoogle = useCallback(async () => {
    const profile = await SOCIAL_AUTH.google.login();
    const idToken = await profile.user.getIdToken();

    const response = await api.post<AuthState>(`/sessions/google/${idToken}`);

    const { user, token } = response.data;

    await AsyncStorage.multiSet([
      ['@Qandac:token', token],
      ['@Qandac:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({
      token,
      user,
    });
  }, []);

  const signUpWithGoogle = useCallback(async () => {
    const profile = await SOCIAL_AUTH.google.login();
    const idToken = await profile.user.getIdToken();

    await api.post<AuthState>(`/users/google/${idToken}`);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        loading,
        signIn,
        signOut,
        updateUser,
        updateUsername,
        signWithFacebook,
        signWithGoogle,
        signUpWithGoogle,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
