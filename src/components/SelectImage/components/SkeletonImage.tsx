import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps
} from 'react-native';

interface SkeletonImageProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  delay?: number;
  selected: boolean;
  photo: PhotoIdentifier;
  onSelected: (id: string, selected: boolean) => void;
}
export const SkeletonImage: React.FC<SkeletonImageProps> = memo(
  ({
    height = 100,
    width = 100,
    delay,
    photo: {
      node: {id, image, type},
    },
    selected,
    onSelected,
    ...props
  }) => {
    console.log(1)
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const [imageLoading, setImageLoading] = React.useState(true);

    const time = useMemo(() => {
      return {
        seconds: image.playableDuration % 60,
        minutes: Math.floor(image.playableDuration / 60),
      };
    }, [image.playableDuration]);

    const handleImageLoad = () => {
      // setImageLoading(false);
    };

    const handleSelectImage = () => {
      onSelected(id, !selected);
    };

    useEffect(() => {
      const sharedAnimationConfig = {
        duration: 600,
        useNativeDriver: true,
      };
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            delay: delay || 0,
            toValue: 1,
            easing: Easing.inOut(Easing.circle),
          }),
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            delay: delay || 0,
            toValue: 0,
            easing: Easing.inOut(Easing.circle),
          }),
        ]),
      ).start();

      return () => {
        pulseAnim.stopAnimation();
      };
    }, [pulseAnim, delay]);

    const opacityAnim = pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.06, 0.18],
    });

    return (
      <View
        style={{
          flex: 1 / 3,
        }}>
        {imageLoading && (
        <Animated.View
          style={[
            styles.container,
            {width: width || 100, height: height || 120},
            {opacity: opacityAnim},
            props.style,
          ]}
        />
      )}
        <TouchableOpacity style={{
          position:'absolute',
        }} onPress={handleSelectImage}>
          <>
            <Image
              source={{uri: image.uri}}
              style={[
                {
                  width: 106,
                  height: 106,
                },
                styles.image,
              ]}
              onLoad={handleImageLoad}
            />
            {type.includes('video') && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    color: 'white',
                  }}>{`${time.minutes}:${time.seconds}`}</Text>
              </View>
            )}
            {selected && (
              <View
                style={{
                  position: 'absolute',
                  width: 106,
                  height: 106,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: 4,
                }}
              />
            )}
          </>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#444',
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,

  },
  image: {
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
});
