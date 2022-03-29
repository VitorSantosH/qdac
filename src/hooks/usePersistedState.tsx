/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

function usePersistedState(key: string, initialState: any, defaultValue: any) {
  const [state, setState] = useState(() => {
    if (initialState) {
      return JSON.parse(initialState);
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
