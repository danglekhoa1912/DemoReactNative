import React, { useRef } from 'react';
import { Dimensions, PanResponder, StyleSheet, View } from 'react-native';

type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
};

const Slider = ({ onValueChange, value }: SliderProps) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        const { moveX } = gestureState;
        const trackWidth = Dimensions.get('window').width - 56; // Dynamic width based on the window width
        const newValue = Math.min(
          Math.max(Math.round(((moveX - 50) / trackWidth) * 100), 0),
          100,
        );
        onValueChange(newValue);
      },
    }),
  ).current;

  return (
    <View
      style={{
        flexDirection:'row',
        alignItems:'center',
        gap:8,
        height:16,
        marginHorizontal:20,
      }}
    >
      <View style={styles.sliderTrack} {...panResponder.panHandlers}>
        <View style={[styles.sliderFill, { width: `${value}%` }]} />
        <View
          style={[
            styles.draggableCircle,
            { left: `${value - 2}%` }, // Adjust the position of the circle based on the slider value
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderTrack: {
    height: 2,
    backgroundColor: 'rgba(0, 170, 159, 0.20);',
    borderRadius: 10,
    flex: 1,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#00AA9F',
  },
  draggableCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#00AA9F',
    position: 'absolute',
    top: -7,
  },
});

export default Slider;
