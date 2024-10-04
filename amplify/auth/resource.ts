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
        clientId: secret(
          '97848104411-glooh38d9duk8c0930s716a4ckb37asl.apps.googleusercontent.com'
        ),
        clientSecret: secret('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'),
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
