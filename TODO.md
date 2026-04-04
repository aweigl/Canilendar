## Sign in with Apple

Use the @invertase/react-native-apple-authentication library:
javascriptimport appleAuth from '@invertase/react-native-apple-authentication';

```
const signIn = async () => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const { email, fullName } = appleAuthRequestResponse;
  // fullName: { givenName: 'John', familyName: 'Doe' }
  // email may be null if user chose "Hide My Email"
};
```
