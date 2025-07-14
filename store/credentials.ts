import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDENTIALS_KEY = 'educrypt_issued_credentials';

export type Credential = {
  name: string;
  degree: string;
  graduationDate: string;
  issuer: string;
  hash: string;
  signature: string;
};

export async function addCredential(credential: Credential) {
  const credentials = await getCredentials();
  credentials.push(credential);
  await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export async function getCredentials(): Promise<Credential[]> {
  const data = await AsyncStorage.getItem(CREDENTIALS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

export async function clearCredentials() {
  await AsyncStorage.removeItem(CREDENTIALS_KEY);
} 