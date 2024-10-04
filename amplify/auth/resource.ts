import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET')
      },
      callbackUrls: [
        'http://localhost:3000/home',
        'https://mywebsite.com/home'
      ],
      logoutUrls: ['http://localhost:3000/', 'https://mywebsite.com'],
    },
  },
  userAttributes: {
    preferredUsername: {
      mutable: false,
      required: true,
    },
  },
});
