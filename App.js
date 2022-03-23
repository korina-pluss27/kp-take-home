import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, FlatList, Image, Button } from "react-native";
import { Audio } from "expo-av";

const AUDIO_BASE_URL = "https://www.soundhelix.com/examples/mp3";
const IMAGE_BASE_URL = "https://img.icons8.com/cute-clipart";

class Track {
  constructor(id, image) {
    this.key = id.toString();
    this.title = `Track #${id}`;
    this.uri = `${AUDIO_BASE_URL}/SoundHelix-Song-${id}.mp3`;
    this.image = image;
    this.sound = null;
  }
}

const trackData = [
  new Track(1, `${IMAGE_BASE_URL}/452/apple.png`),
  new Track(2, `${IMAGE_BASE_URL}/452/banana.png`),
  new Track(3, `${IMAGE_BASE_URL}/452/citrus-1.png`),
  new Track(4, `${IMAGE_BASE_URL}/452/pineapple.png`),
  new Track(5, `${IMAGE_BASE_URL}/452/orange.png`),
  new Track(6, `${IMAGE_BASE_URL}/452/pear.png`),
  new Track(7, `${IMAGE_BASE_URL}/452/cactus.png`),
  new Track(8, `${IMAGE_BASE_URL}/452/tomato.png`),
  new Track(9, `${IMAGE_BASE_URL}/452/corn.png`),
  new Track(10, `${IMAGE_BASE_URL}/452/carrot.png`),
  new Track(11, `${IMAGE_BASE_URL}/452/plum.png`),
  new Track(12, `${IMAGE_BASE_URL}/452/cherry.png`),
  new Track(13, `${IMAGE_BASE_URL}/452/grapes.png`),
  new Track(14, `${IMAGE_BASE_URL}/452/raspberry.png`),
  new Track(15, `${IMAGE_BASE_URL}/452/strawberry.png`),
  new Track(16, `${IMAGE_BASE_URL}/344/kiwi.png`),
];

const AudioClip = ({
  track,
  trackPosition,
  soundDuration,
  currentSound,
  setCurrentlyPlaying,
  isPlaying,
  setPlaying,
}) => {
  const [loading, setLoading] = useState(true);
  const _onPlaybackStatusUpdate = (playbackStatus) => {
    // update refs to keep track of current position of the track, duration
    trackPosition.current = playbackStatus.positionMillis;
    soundDuration.current = playbackStatus.durationMillis;

    if (playbackStatus.error) {
      console.log(`Error during playback: ${playbackStatus.error}`);
    }
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        console.log(`Error during playback: ${playbackStatus.error}`);
      }
    } else {
      // use status returned from expo-av to update UI state elements
      setLoading(false);
      if (playbackStatus.isPlaying) {
        setPlaying(true);
      } else {
        setPlaying(false);
      }
      if (playbackStatus.isBuffering) {
        console.log(`buffering track ${track.title}`);
      }
    }
  };

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: isPlaying },
        _onPlaybackStatusUpdate,
        true
      );
      track.sound = sound;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSound();
    return track.sound ? track.sound.unloadAsync() : undefined;
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: track.image }}
        style={{ width: 120, height: 120 }}
      />
      <Text>{track.title}</Text>
      <View style={{ alignSelf: "flex-end" }}>
        <Button
          title={loading ? "loading..." : "play"}
          disabled={loading}
          accessibilityLabel={`play ${track.title}`}
          onPress={async () => {
            if (currentSound.sound) {
              await currentSound.sound.stopAsync();
            }
            setCurrentlyPlaying(track);
            await track.sound.playAsync();
          }}
        />
      </View>
    </View>
  );
};

const SEEK_VALUE_MS = 30000;

const AudioControls = ({
  currentSound,
  isPlaying,
  trackPosition,
  soundDuration,
}) => {
  const getFwdMs = () => {
    return Math.min(
      trackPosition.current + SEEK_VALUE_MS,
      soundDuration.current
    );
  };

  const getRevMs = () => {
    return Math.max(trackPosition.current - SEEK_VALUE_MS, 0);
  };

  const seekTrack = async (positionInMs) => {
    if (isPlaying) {
      await currentSound.sound.playFromPositionAsync(positionInMs);
    } else {
      await currentSound.sound.setPositionAsync(positionInMs);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ flex: 1, marginTop: 20 }}>{currentSound.title}</Text>
      {/* if i had more time, i would display progress of the song here */}
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Button
          title="-30s"
          onPress={async () => {
            const millis = getRevMs();
            await seekTrack(millis);
          }}
        />
        <View style={{ marginHorizontal: 30 }}>
          <Button
            title={isPlaying ? "pause" : "play"}
            onPress={async () => {
              if (isPlaying) {
                await currentSound.sound.pauseAsync();
              } else {
                await currentSound.sound.playAsync();
              }
            }}
          />
        </View>
        <Button
          title="+30s"
          onPress={async () => {
            const millis = getFwdMs();
            await seekTrack(millis);
          }}
        />
      </View>
    </View>
  );
};

export default App = () => {
  const trackPosition = useRef(0);
  const soundDuration = useRef(0);
  const [isPlaying, setPlaying] = useState(false);
  const [currentSound, setCurrentlyPlaying] = useState(trackData[0]);

  useEffect(() => {
    (async () =>
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      }))();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 26 }}>Scrollable Audio Streaming</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={trackData}
          renderItem={({ item }) => (
            <AudioClip
              track={item}
              trackPosition={trackPosition}
              soundDuration={soundDuration}
              currentSound={currentSound}
              setCurrentlyPlaying={setCurrentlyPlaying}
              setPlaying={setPlaying}
              isPlaying={isPlaying}
            />
          )}
        />
      </View>
      <View style={styles.footer}>
        <AudioControls
          currentSound={currentSound}
          isPlaying={isPlaying}
          trackPosition={trackPosition}
          soundDuration={soundDuration}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: 60,
    flex: 1,
  },
  content: {
    alignSelf: "stretch",
    flex: 5,
  },
  footer: {
    flex: 1,
  },
});
