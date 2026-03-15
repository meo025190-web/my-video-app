import * as Haptics from "expo-haptics";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const videoSource = require("@/assets/videos/video.mp4");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const getRandomSpeed = () => Math.random() * 1.5 + 0.5;

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.playbackRate = getRandomSpeed();
  });

  useEffect(() => {
    const sub = player.addListener("playToEnd", () => {
      player.playbackRate = getRandomSpeed();
    });
    return () => sub.remove();
  }, [player]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 50,
        bounciness: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePlay = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsPlaying(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      player.play();
    });
  };

  const handleTapVideo = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background with play button */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <ImageBackground
          source={require("@/assets/images/background.jpeg")}
          style={styles.background}
          resizeMode="cover"
        >
          <View
            style={[
              styles.overlay,
              { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
          >
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handlePlay}
              accessibilityLabel="Play video"
              accessibilityRole="button"
            >
              <Animated.View
                style={[
                  styles.playButtonOuter,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                  },
                ]}
              >
                <View style={styles.playButtonInner}>
                  <View style={styles.triangle} />
                </View>
              </Animated.View>
            </Pressable>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Video player */}
      {isPlaying && (
        <Pressable style={StyleSheet.absoluteFill} onPress={handleTapVideo}>
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            nativeControls
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  playButtonOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  playButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 22,
    borderRightWidth: 0,
    borderBottomWidth: 14,
    borderTopWidth: 14,
    borderLeftColor: "#1a1a1a",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginLeft: 6,
  },
});
