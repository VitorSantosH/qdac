// @ts-ignore
import { FBLoginManager } from 'react-native-facebook-login';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type Profile = {
  id: string | number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  picture: string;
  accessToken: string;
  tokenExpirationDate: Date;
};

export const SOCIAL_AUTH = {
  facebook: {
    login: (permissions: string[] = ['email']): Promise<Profile> => {
      return new Promise((resolve, reject) => {
        FBLoginManager.loginWithPermissions(
          permissions,
          (error: Error, data: any) => {
            if (error) {
              return reject(error);
            }

            const profile = JSON.parse(data.profile);
            const credentials = data.credentials;

            const formattedData: Profile = {
              id: profile.id,
              first_name: profile.name,
              last_name: profile.last_name,
              email: profile.email,
              name: profile.name,
              picture: profile.picture.data.url,
              accessToken: credentials.token,
              tokenExpirationDate: credentials.tokenExpirationDate,
            };

            return resolve(formattedData);
          },
        );
      });
    },
  },
  google: {
    login: async (): Promise<FirebaseAuthTypes.UserCredential> => {
      GoogleSignin.configure({
        webClientId:
          '821541752418-t0nakvng40l1pij596diapg367f7dd2g.apps.googleusercontent.com',
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    },
  },
};
