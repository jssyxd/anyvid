import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export class FFmpegService {
  private static instance: FFmpeg;
  private static loaded: boolean = false;

  public static async getInstance(): Promise<FFmpeg> {
    if (!this.instance) {
      this.instance = new FFmpeg();
    }

    if (!this.loaded) {
      await this.load();
    }

    return this.instance;
  }

  private static async load() {
    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const ffmpeg = this.instance;

    // Load ffmpeg.wasm-core script and wasm
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    });

    this.loaded = true;
  }
  
  public static isLoaded() {
    return this.loaded;
  }
}
