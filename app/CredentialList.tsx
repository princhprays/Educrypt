import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Credential, getCredentials } from '../store/credentials';
import { colors, fontFamilies, fontSizes } from '../theme';
import Button from './components/Button';
import Card from './components/Card';

export default function CredentialList() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selected, setSelected] = useState<Credential | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setCredentials(await getCredentials());
      setLoading(false);
    })();
  }, []);

  const handleExportJson = async (credential: Credential) => {
    setExporting(true);
    setSuccess(false);
    try {
      const fileName = `credential_${credential.hash}.json`;
      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(credential, null, 2));
      setSuccess(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to export credential.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Issued Credentials</Text>
      <Card style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            data={credentials}
            keyExtractor={(item) => item.hash}
            renderItem={({ item }) => (
              <View style={styles.credentialItem}>
                <Text style={styles.credentialText}>{item.name} — {item.degree}</Text>
                <Button title="View" onPress={() => { setSelected(item); setModalVisible(true); }} type="secondary" style={styles.viewBtn} />
              </View>
            )}
            ListEmptyComponent={<Text>No credentials issued yet.</Text>}
          />
        )}
      </Card>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Credential Details</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.credentialText}>
                {selected ? JSON.stringify(selected, null, 2) : ''}
              </Text>
            </ScrollView>
            {selected && (
              <Button title={exporting ? "Exporting..." : "Export as JSON"} onPress={() => handleExportJson(selected)} disabled={exporting} />
            )}
            {success && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>Credential exported successfully!</Text>
              </View>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </Card>
        </View>
      </Modal>
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
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    width: 500,
    maxWidth: '98%',
  },
  title: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  credentialText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.small,
    flex: 1,
  },
  viewBtn: {
    marginLeft: 12,
    minWidth: 90,
  },
  successBox: {
    backgroundColor: colors.success + '22',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  successText: {
    color: colors.success,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 350,
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.subtitle,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
  },
}); 