import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';

import {Container, Title, TextInput, Button} from './styles';

interface IRouteParams {
  description: string;
  title: string;
  category: string;
  subCategory: string;
  users: string;
  question: string;
  id: string;
}

function EditDescription() {
  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const navigation = useNavigation();

  const [description, setDescription] = useState(routeParams.description);

  const handleEditDescription = useCallback(async () => {
    if (description.length > 512) {
      Alert.alert(
        'Limite de 512 caracteres',
        'Voce passou do limite de 512 caracteres.',
      );
      return;
    }

    await api.post(`/rooms/${routeParams.id}/description`, {
      description,
    });

    navigation.navigate('RoomInfo', {
      title: routeParams.title,
      category: routeParams.category,
      subCategory: routeParams.subCategory,
      users: routeParams.users,
      question: routeParams.question,
      description: description,
      id: routeParams.id,
    });
  }, [
    description,
    routeParams.id,
    navigation,
    routeParams.title,
    routeParams.question,
    routeParams.users,
    routeParams.category,
    routeParams.subCategory,
  ]);

  return (
    <>
      <Container>
        <Title>Descrição:</Title>

        <TextInput
          placeholder="Adicione uma descrição"
          placeholderTextColor="#6E6C73"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </Container>

      <Button onPress={handleEditDescription}>
        <Icon name="check" size={30} color="#000" />
      </Button>
    </>
  );
}

export default EditDescription;
