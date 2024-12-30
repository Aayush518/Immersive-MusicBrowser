const CACHE_NAME = 'audio-cache-v1';

export async function cacheAudioFile(url: string): Promise<void> {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(url);
  } catch (error) {
    console.error('Error caching audio file:', error);
  }
}

export async function getAudioFromCache(url: string): Promise<Response | undefined> {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    return response;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return undefined;
  }
}

export async function clearAudioCache(): Promise<void> {
  try {
    await caches.delete(CACHE_NAME);
  } catch (error) {
    console.error('Error clearing audio cache:', error);
  }
}