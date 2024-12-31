import * as musicMetadata from 'music-metadata-browser';

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const extractMetadata = async (file: File): Promise<{
  title: string;
  artist: string;
  duration: number;
  albumArt?: string;
  album?: string;
}> => {
  // Create an audio element for fallback duration detection
  const audio = new Audio();
  const audioUrl = URL.createObjectURL(file);
  audio.src = audioUrl;

  try {
    // Try to parse metadata using music-metadata-browser
    const metadata = await musicMetadata.parseBlob(file);
    
    let albumArt: string | undefined;
    if (metadata.common.picture?.[0]) {
      const picture = metadata.common.picture[0];
      const blob = new Blob([picture.data], { type: picture.format });
      albumArt = URL.createObjectURL(blob);
    }

    // Get duration from audio element if not available in metadata
    const duration = metadata.format.duration || await new Promise<number>((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
    });

    const result = {
      title: metadata.common.title?.trim() || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist?.trim() || "Unknown Artist",
      album: metadata.common.album?.trim(),
      duration,
      albumArt
    };

    return result;
  } catch (error) {
    console.warn('Metadata extraction failed, falling back to basic info:', error);
    
    // Fallback to basic file information
    return new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          duration: audio.duration
        });
      });

      audio.addEventListener('error', () => {
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          duration: 0
        });
      });
    });
  } finally {
    // Cleanup
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(audioUrl);
    });
  }
};