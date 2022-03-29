/* eslint-disable prettier/prettier */
const config = {
  screens: {
    Profile: '*',
    Chat: {
      path: 'chat',
    },
  },
};

const linking = {
  prefixes: ['qandac://app'],
  config,
};

export default linking;
