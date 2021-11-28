import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const WIDGET_WIDTH = width - 40;
const WIDGET_HEIGHT = 200;

export default function App() {
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const animationState = useSharedValue(-1);

  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => scrollTo(scrollViewRef, 0, scrolling, false)
  );

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (animationState.value != 0) {
        animationState.value = 1;
      }
    },
    onActive: (event, ctx) => {},
    onEnd: (_) => {
      animationState.value = 0;
    },
  });

  const widgetStyle = useAnimatedStyle(() => {
    return {
      top: animationState.value === 0 ? 0 : 0,
      position: "absolute",
      width:
        animationState.value === 0
          ? withTiming(width, {
              duration: 300,
            })
          : WIDGET_WIDTH,
      marginVertical: animationState.value === 0 ? 0 : 20,
      height:
        animationState.value === 0
          ? withTiming(height, {
              duration: 300,
            })
          : WIDGET_HEIGHT,
      borderRadius: animationState.value === 0 ? 0 : 15,
      backgroundColor: "red",
      transform: [
        {
          scale: withTiming(
            animationState.value === -1 || animationState.value === 0
              ? 1
              : 0.95,
            {
              duration: 300,
            }
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.animatedScrollView]}
        contentContainerStyle={{
          height: height * 2,
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TapGestureHandler {...{ onGestureEvent }}>
          <Animated.View style={widgetStyle}></Animated.View>
        </TapGestureHandler>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  animatedScrollView: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
});
