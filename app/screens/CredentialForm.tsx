import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { hashData, signData } from '../../lib/crypto';
import { addCredential } from '../../store/credentials';
import { addHashToSnapshot } from '../../store/snapshot';
import { colors, fontFamilies, fontSizes } from '../../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function CredentialForm() {
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationDate, setGraduationDate] = useState('');
  const [issuer, setIssuer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [signedCredential, setSignedCredential] = useState<any>(null);
  const [showQr, setShowQr] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const errs = [];
    if (!name.trim()) errs.push('Name is required.');
    if (!degree.trim()) errs.push('Degree is required.');
    if (!graduationDate.trim()) errs.push('Graduation date is required.');
    if (!issuer.trim()) errs.push('Issuer is required.');
    if (graduationDate && !/^\d{4}-\d{2}-\d{2}$/.test(graduationDate)) errs.push('Graduation date must be in YYYY-MM-DD format.');
    setErrors(errs);
    if (errs.length > 0) return;
    setLoading(true);
    setSuccess(false);
    try {
      const credential = {
        name,
        degree,
        graduationDate,
        issuer,
      };
      const canonical = JSON.stringify(credential);
      const hash = hashData(canonical);
      const signature = await signData(canonical);
      const signed = { ...credential, hash, signature };
      await addHashToSnapshot(hash);
      await addCredential(signed);
      setSignedCredential(signed);
      setModalVisible(true);
      setSuccess(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to issue credential.');
    } finally {
      setLoading(false);
    }
  };

  // Export signed credential as JSON file
  const handleExportJson = async () => {
    if (!signedCredential) return;
    const fileName = `credential_${Date.now()}.json`;
    const fileUri = FileSystem.cacheDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(signedCredential, null, 2));
    // Use DocumentPicker to let user pick a location to save the file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: false,
      multiple: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const destUri = result.assets[0].uri;
      await FileSystem.copyAsync({ from: fileUri, to: destUri });
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Issue Credential</Text>
        <Input
          placeholder="Enter full name"
          value={name}
          onChangeText={setName}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Enter degree (e.g., Bachelor of Science)"
          value={degree}
          onChangeText={setDegree}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Graduation Date (YYYY-MM-DD)"
          value={graduationDate}
          onChangeText={setGraduationDate}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Enter issuer (e.g., University Name)"
          value={issuer}
          onChangeText={setIssuer}
          containerStyle={styles.input}
        />
        <Button title="Submit" onPress={handleSubmit} loading={loading} />
        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Credential issued successfully!</Text>
          </View>
        )}
        {errors.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            {errors.map((err, idx) => (
              <Text key={idx} style={styles.errorText}>{err}</Text>
            ))}
          </View>
        )}
      </Card>
      {/* Modal remains, but use Card for modalContent */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Signed Credential</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.credentialText}>
                {signedCredential ? JSON.stringify(signedCredential, null, 2) : ''}
              </Text>
            </ScrollView>
            <Button title="Close" onPress={() => setModalVisible(false)} />
            {signedCredential && (
              <Button title="Export as JSON" onPress={handleExportJson} />
            )}
            {signedCredential && !showQr && (
              <Button title="Show QR Code" onPress={() => setShowQr(true)} />
            )}
            {signedCredential && showQr && (
              <View style={{ marginVertical: 16 }}>
                <QRCode value={JSON.stringify(signedCredential)} size={200} />
                <Button title="Hide QR Code" onPress={() => setShowQr(false)} />
              </View>
            )}
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
    justifyContent: 'center',
  },
  card: {
    width: 400,
    maxWidth: '95%',
  },
  title: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
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
  errorText: {
    color: colors.error,
    marginBottom: 2,
    textAlign: 'center',
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
  credentialText: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.small,
    marginBottom: 16,
  },
}); 