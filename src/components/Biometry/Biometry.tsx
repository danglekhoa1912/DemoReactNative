import CryptoES from 'crypto-es';
import React, { useMemo } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const Biometry = () => {
  const rnBiometrics = useMemo(() => {
    return new ReactNativeBiometrics();
  }, []);

  const enable = async () => {
    const {publicKey} = await rnBiometrics.createKeys();
    console.log(publicKey);
    const key = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtHCD8JJn7zBuunZ1F/c8vPrNBc2e2GNVAQOoGwd0y1KvAxgCCbes2n3VdXArJq1XfxWgU1hyX1776R5R0WwRPWhSZToFPL5JsxTnoEros9KWCfkxTgxCp+8mrzI16cimsnxN1T4tBODgzM63UzgZqJPoe6/WUxpBxQPYndCVVbDk1XiwIW4EJOtrG468wS1ZkK6sToECOOxUm84rmwyo18lvyIeeUNsPve82ZhCe9VwGGPgrN6JM1GzsjUYG6iS+FCcTMnB+MOX8UzBJHwhTuFW4VGL4fc2Xt2aH+lDypdnX4TmG9/+JUzUmfgBZznrrBfOqsP1vOad/OxRzJDfpdwIDAQAB'
    try {
      const encrypted = CryptoES.AES.encrypt('Message1233234','');
      CryptoES.HmacSHA512
      const decrypted = CryptoES.AES.decrypt(encrypted, '');
      console.log(encrypted.toString(),"---",decrypted.toString(CryptoES.enc.Utf8));
    } catch (e) {
      console.log(e);
    }
  };

  const authenticate = async () => {
    // rnBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
    const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    const payload = epochTimeSeconds + 'some message';
    try {
      const {signature, success, error} = await rnBiometrics.createSignature({
        payload: 'some message',
        promptMessage: 'Confirmation',
      });
      console.log(signature, success, error);
    } catch (e) {
      console.log(e);
    }
    // if (success) {
    //   //... send signature and payload
    // }
  };

  return (
    <View>
      <Button title="Enable" onPress={enable} />
      <Button title="Authenticate" onPress={authenticate} />
    </View>
  );
};

export default Biometry;

const styles = StyleSheet.create({});
