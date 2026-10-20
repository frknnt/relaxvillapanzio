import {Audio, Video} from "@remotion/media";
import {
  Composition,
  Easing,
  Img,
  Interactive,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={900}
      fps={60}
      width={1080}
      height={1350}
      defaultProps={{}}
    />
  );
};

export const MyComponent: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <>
      <Video
        name="Source footage"
        src={staticFile("assets/source.mp4")}
        muted
        premountFor={fps}
        objectFit="cover"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />

      <Audio
        name="Background music - Uplifting Bass"
        src={staticFile("assets/uplifting-bass.mp3")}
        durationInFrames={durationInFrames}
        premountFor={fps}
        volume={interpolate(
          frame,
          [0, 1 * fps, durationInFrames - 1 * fps, durationInFrames - 1],
          [0, 0.3, 0.3, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )}
      />

      <Audio
        name="Whoosh 01"
        src={staticFile("assets/whoosh.wav")}
        from={1 * fps}
        volume={0.2}
        premountFor={fps}
      />
      <Audio
        name="Whoosh 02"
        src={staticFile("assets/whoosh.wav")}
        from={3.75 * fps}
        volume={0.18}
        premountFor={fps}
      />
      <Audio
        name="Whoosh 03"
        src={staticFile("assets/whoosh.wav")}
        from={6.5 * fps}
        volume={0.2}
        premountFor={fps}
      />
      <Audio
        name="Whoosh 04"
        src={staticFile("assets/whoosh.wav")}
        from={8.75 * fps}
        volume={0.18}
        premountFor={fps}
      />
      <Audio
        name="Whoosh 05"
        src={staticFile("assets/whoosh.wav")}
        from={10.75 * fps}
        volume={0.2}
        premountFor={fps}
      />
      <Audio
        name="Whoosh 06"
        src={staticFile("assets/whoosh.wav")}
        from={12.75 * fps}
        volume={0.18}
        premountFor={fps}
      />

      <Sequence
        name="Harmony brand lockup"
        from={12.75 * fps}
        durationInFrames={2 * fps}
        premountFor={fps}
      >
        <Interactive.Div
          name="Brand shade"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(11, 18, 24, 0.92) 0%, rgba(11, 18, 24, 0.62) 22%, rgba(11, 18, 24, 0) 48%)",
            opacity: interpolate(frame, [12.75 * fps, 13.35 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
        <Img
          name="Harmony Balaton Villa"
          src={staticFile("assets/logo-white.svg")}
          style={{
            position: "absolute",
            top: 94,
            left: 240,
            width: 600,
            height: 178,
            objectFit: "contain",
            opacity: interpolate(
              frame,
              [12.75 * fps, 13.35 * fps, 14.2 * fps, 14.75 * fps],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            translate: interpolate(
              frame,
              [12.75 * fps, 13.35 * fps],
              ["0px 18px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        />
        <Interactive.Div
          name="Location"
          style={{
            position: "absolute",
            top: 260,
            left: 120,
            width: 840,
            color: "#f5f1e8",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 7,
            lineHeight: 1.4,
            textAlign: "center",
            textTransform: "uppercase",
            textShadow: "0 2px 18px rgba(0, 0, 0, 0.42)",
            opacity: interpolate(
              frame,
              [13 * fps, 13.55 * fps, 14.2 * fps, 14.75 * fps],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
            translate: interpolate(
              frame,
              [13 * fps, 13.55 * fps],
              ["0px 12px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          Badacsonytomaj · Lake Balaton, Hungary
        </Interactive.Div>
      </Sequence>
    </>
  );
};
