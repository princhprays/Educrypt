import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { getSnapshotHashes } from '../../store/snapshot';
import { colors, fontFamilies, fontSizes } from '../../theme';
import Button from '../components/Button';
import Card from '../components/Card';

export default function SnapshotExport() {
  const [hashes, setHashes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setHashes(await getSnapshotHashes());
      setLoading(false);
    })();
  }, []);

  const handleExportSnapshot = async () => {
    setExporting(true);
    setSuccess(false);
    try {
      const fileName = `snapshot_${Date.now()}.json`;
      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(hashes, null, 2));
      setSuccess(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to export snapshot.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Snapshot Export</Text>
      <Card style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            data={hashes}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <Text style={styles.hashItem}>{index + 1}. {item}</Text>
            )}
            ListEmptyComponent={<Text>No hashes issued yet.</Text>}
          />
        )}
        <Button title={exporting ? "Exporting..." : "Export Snapshot as JSON"} onPress={handleExportSnapshot} disabled={hashes.length === 0 || exporting} />
        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Snapshot exported successfully!</Text>
          </View>
        )}
      </Card>
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
  hashItem: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.small,
    marginBottom: 8,
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
}); 