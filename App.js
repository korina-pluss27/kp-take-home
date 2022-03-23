import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, Button } from "react-native";
import { Audio } from "expo-av";

const AUDIO_BASE_URL = "https://www.soundhelix.com/examples/mp3";

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
  new Track(1, "https://img.icons8.com/cute-clipart/452/apple.png"),
  new Track(2, "https://img.icons8.com/cute-clipart/452/banana.png"),
  new Track(3, "https://img.icons8.com/cute-clipart/452/citrus-1.png"),
  new Track(4, "https://img.icons8.com/cute-clipart/452/pineapple.png"),
  new Track(5, "https://img.icons8.com/cute-clipart/452/orange.png"),
  new Track(6, "https://img.icons8.com/cute-clipart/452/pear.png"),
  new Track(7, "https://img.icons8.com/cute-clipart/452/cactus.png"),
  new Track(8, "https://img.icons8.com/cute-clipart/452/tomato.png"),
  new Track(9, "https://img.icons8.com/cute-clipart/452/corn.png"),
  new Track(10, "https://img.icons8.com/cute-clipart/452/carrot.png"),
  new Track(11, "https://img.icons8.com/cute-clipart/452/plum.png"),
  new Track(12, "https://img.icons8.com/cute-clipart/452/cherry.png"),
  new Track(13, "https://img.icons8.com/cute-clipart/452/grapes.png"),
  new Track(14, "https://img.icons8.com/cute-clipart/452/raspberry.png"),
  new Track(15, "https://img.icons8.com/cute-clipart/452/strawberry.png"),
  new Track(16, "https://img.icons8.com/cute-clipart/344/kiwi.png"),
];

const AudioClip = ({
  track,
  currentSound,
  setCurrentlyPlaying,
  isPlaying,
  setPlaying,
}) => {
  const [loading, setLoading] = useState(true);
  const _onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.error) {
      console.log(`Error during playback: ${playbackStatus.error}`);
    }
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        console.log(`Error during playback: ${playbackStatus.error}`);
      }
    } else {
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

const AudioControls = ({ currentSound, isPlaying }) => {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text>{currentSound.title}</Text>
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
  );
};

export default App = () => {
  const [isPlaying, setPlaying] = useState(false);
  const [currentSound, setCurrentlyPlaying] = useState(trackData[0]);
  // TODO - seek +/-30s

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
              currentSound={currentSound}
              setCurrentlyPlaying={setCurrentlyPlaying}
              setPlaying={setPlaying}
              isPlaying={isPlaying}
            />
          )}
        />
      </View>
      <View style={styles.footer}>
        <AudioControls currentSound={currentSound} isPlaying={isPlaying} />
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
    flex: 6,
  },
  footer: {
    flex: 1,
  },
});
