// components/WalkthroughScreen.js
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

type WalkthroughScreenProps = {
  description: string;
  image: any;
  textHighlight?: string;
  step: number;
};

const WalkthroughScreen = ({
  description,
  image,
  textHighlight,
  step,
}: WalkthroughScreenProps) => {
  const translateY = new Animated.Value(0);
  const translateX = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const renderHighlightedDescription = () => {
    if (!textHighlight) {
      return <Text style={styles.description}>{description}</Text>;
    }

    const parts = description.split(textHighlight);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <Text style={{color: '#00AA9F'}}>{textHighlight}</Text>}
        <Text style={styles.description}>{part}</Text>
      </React.Fragment>
    ));
  };

  useEffect(() => {
    const animations = [
      // Animated.timing(translateY, {
      //   toValue: 0,
      //   duration: 500,
      //   useNativeDriver: true,
      // }),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: step === 2 ? 2 : 1,
          duration: step === 2 ? 500 : 0, // Scale duration only when moving to corner
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: step === 2 ? 200 : 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: step === 2 ? 20 : 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Animated.parallel([
      //   Animated.timing(scale, {
      //     toValue: step === 3 ? 1.5 : 1,
      //     duration: step === 3 ? 500 : 0,
      //     useNativeDriver: true,
      //   }),
      //   Animated.timing(translateY, {
      //     toValue: step === 3 ? -150 : 0,
      //     duration: 500,
      //     useNativeDriver: true,
      //   }),
      // ]),
      // Animated.parallel([
      //   Animated.timing(scale, {
      //     toValue: step === 4 ? 1.5 : 1,
      //     duration: step === 4 ? 500 : 0,
      //     useNativeDriver: true,
      //   }),
      //   Animated.timing(translateY, {
      //     toValue: step === 4 ? 150 : 0,
      //     duration: 500,
      //     useNativeDriver: true,
      //   }),
      // ]),
      // Animated.timing(translateY, {
      //   toValue: 0,
      //   duration: 500,
      //   useNativeDriver: true,
      // }),
    ];

    Animated.sequence(animations).start();
  }, [step, scale]);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>{renderHighlightedDescription()}</Text>
      <Animated.Image
        source={image}
        style={[
          styles.image,
          {transform: [{translateY}, {scale}, {translateX}]},
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 203, // Adjust the width as needed
    height: 384, // Adjust the height as needed
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    color: '#3D3D3D',
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 36,
    width: 300,
  },
});

export default WalkthroughScreen;
