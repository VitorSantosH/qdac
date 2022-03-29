import { useNavigation } from '@react-navigation/core';
import React from 'react';

import { Container, Image, Title, Description } from './styles';

interface CardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  nextRoute: string;
  category?: string;
  sub_category?: string;
}

function Card({
  title,
  description,
  image,
  id,
  nextRoute,
  category,
  sub_category,
}: CardProps) {
  const navigation = useNavigation();

  return (
    <Container
      onPress={() =>
        navigation.navigate(nextRoute, {
          category_id: id,
          category,
          sub_category,
        })
      }>
      <Image
        source={{
          uri: image,
        }}
      />
      <Title adjustsFontSizeToFit>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
}

export default Card;
