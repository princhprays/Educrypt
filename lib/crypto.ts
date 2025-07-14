import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';

const PRIVATE_KEY_STORAGE_KEY = 'educrypt_private_key';

// Generate or load the RSA private key
export async function getOrCreatePrivateKey() {
  let pem = await AsyncStorage.getItem(PRIVATE_KEY_STORAGE_KEY);
  if (pem) {
    return forge.pki.privateKeyFromPem(pem);
  }
  // Generate a new 2048-bit RSA key pair
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  pem = forge.pki.privateKeyToPem(keypair.privateKey);
  await AsyncStorage.setItem(PRIVATE_KEY_STORAGE_KEY, pem);
  return keypair.privateKey;
}

// Get the public key PEM (for sharing with verifiers)
export async function getPublicKey() {
  const privKey = await getOrCreatePrivateKey();
  const pubKey = forge.pki.setRsaPublicKey(privKey.n, privKey.e);
  return forge.pki.publicKeyToPem(pubKey);
}

// Hash data using SHA-256
export function hashData(data: string) {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

// Sign data (string) with the private key
export async function signData(data: string) {
  const privKey = await getOrCreatePrivateKey();
  const md = forge.md.sha256.create();
  md.update(data, 'utf8');
  const signature = privKey.sign(md);
  return forge.util.encode64(signature);
} 