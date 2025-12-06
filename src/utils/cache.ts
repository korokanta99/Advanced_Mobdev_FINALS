import AsyncStorage from "@react-native-async-storage/async-storage";

export async function cacheData(key: string, data: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Cache error:", err);
  }
}

export async function getCachedData(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Read cache error:", err);
    return null;
  }
}
