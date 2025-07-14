import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, fontSizes } from '../theme';
import Button from './components/Button';
import Card from './components/Card';

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>EduCrypt Creator</Text>
        <Text style={styles.subtitle}>
          For university staff to issue, sign, and export academic credentials securely. Digitally sign credentials, export them as JSON or QR, and manage your institution's credential records with cryptographic security.
        </Text>
        <Button title="Issue Credential" onPress={() => router.replace('/CredentialForm' as any)} style={styles.button} />
        <Button title="Snapshot Export" onPress={() => router.replace('/SnapshotExport' as any)} type="secondary" style={styles.button} />
        <Button title="View Issued Credentials" onPress={() => router.replace('/CredentialList' as any)} type="secondary" style={styles.button} />
        <Button title="View Public Key" onPress={() => router.replace('/PublicKey' as any)} type="secondary" style={styles.button} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 350,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subtitle,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
