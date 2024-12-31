import * as musicMetadata from 'music-metadata-browser';

export interface AudioMetadata {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  albumArt?: string;
}

export class MetadataExtractor {
  private static async getDurationFromAudio(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      const cleanup = () => {
        URL.revokeObjectURL(url);
        audio.remove();
      };
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        cleanup();
        resolve(duration);
      });
      
      audio.addEventListener('error', (e) => {
        cleanup();
        reject(e);
      });
      
      audio.src = url;
    });
  }

  private static async extractPicture(picture: musicMetadata.IPicture): Promise<string> {
    try {
      const blob = new Blob([picture.data], { type: picture.format });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to extract album art:', error);
      return '';
    }
  }

  static async extract(file: File): Promise<AudioMetadata> {
    try {
      const metadata = await musicMetadata.parseBlob(file);
      
      let albumArt: string | undefined;
      if (metadata.common.picture?.[0]) {
        albumArt = await this.extractPicture(metadata.common.picture[0]);
      }

      const duration = metadata.format.duration || await this.getDurationFromAudio(file);

      return {
        title: metadata.common.title?.trim() || file.name.replace(/\.[^/.]+$/, ""),
        artist: metadata.common.artist?.trim() || "Unknown Artist",
        album: metadata.common.album?.trim(),
        duration,
        albumArt
      };
    } catch (error) {
      console.warn('Metadata extraction failed:', error);
      const duration = await this.getDurationFromAudio(file);
      
      return {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        duration,
        albumArt: undefined
      };
    }
  }
}