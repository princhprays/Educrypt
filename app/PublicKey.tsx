import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getPublicKey } from '../lib/crypto';
import { colors, fontFamilies, fontSizes } from '../theme';

export default function PublicKey() {
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPublicKey(await getPublicKey());
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Public Key</Text>
      <Text style={styles.description}>
        Scan this QR code to share your public key securely. This allows others to verify credentials you issue.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 32 }} />
      ) : (
        <View style={styles.qrWrapper}>
          {publicKey ? (
            <QRCode value={publicKey} size={220} />
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  header: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    alignSelf: 'center',
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 340,
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 260,
    height: 260,
    backgroundColor: colors.card,
    borderRadius: 16,
    shadowColor: colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: 20,
  },
}); 