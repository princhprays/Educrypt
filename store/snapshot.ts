import AsyncStorage from '@react-native-async-storage/async-storage';

const SNAPSHOT_KEY = 'educrypt_snapshot_hashes';

export async function addHashToSnapshot(hash: string) {
  const hashes = await getSnapshotHashes();
  if (!hashes.includes(hash)) {
    hashes.push(hash);
    await AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(hashes));
  }
}

export async function getSnapshotHashes(): Promise<string[]> {
  const data = await AsyncStorage.getItem(SNAPSHOT_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

export async function clearSnapshot() {
  await AsyncStorage.removeItem(SNAPSHOT_KEY);
} 