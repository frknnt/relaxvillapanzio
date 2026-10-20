import {ALL_FORMATS, FilePathSource, Input} from "mediabunny";

const filePath = process.argv[2];

if (!filePath) {
  throw new Error("Usage: node scripts/inspect-media.mjs <media-file>");
}

const input = new Input({
  formats: ALL_FORMATS,
  source: new FilePathSource(filePath),
});

try {
  const videoTrack = await input.getPrimaryVideoTrack();
  const audioTrack = await input.getPrimaryAudioTrack();
  const duration = await input.getDurationFromMetadata();

  const result = {
    canRead: await input.canRead(),
    duration,
    mimeType: await input.getMimeType(),
    video: videoTrack
      ? {
          codec: await videoTrack.getCodec(),
          width: await videoTrack.getDisplayWidth(),
          height: await videoTrack.getDisplayHeight(),
          rotation: await videoTrack.getRotation(),
          frameRate: await videoTrack.computeFrameRateMetrics(),
        }
      : null,
    audio: audioTrack
      ? {
          codec: await audioTrack.getCodec(),
          channels: await audioTrack.getNumberOfChannels(),
          sampleRate: await audioTrack.getSampleRate(),
        }
      : null,
  };

  console.log(JSON.stringify(result, null, 2));
} finally {
  input.dispose();
}
