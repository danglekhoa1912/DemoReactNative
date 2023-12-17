/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import WalkthroughScreen from './src/components/Walkthrough/Walkthrough';

const walkthroughData = [
  {
    description: 'Trudi® - one inbox to rule them all.',
    image: require('./src/assets/image/OB1.png'), // Adjust the image source as needed,
    textHighlight: 'Trudi®',
  },
  {
    description: 'Smart enquiry handling.',
    image: require('./src/assets/image/OB1.png'), // Adjust the image source as needed
    textHighlight: 'enquiry',
  },
  {
    description: 'Time-saving AI features.',
    image: require('./src/assets/image/OB3.png'), // Adjust the image source as needed
    textHighlight: 'AI features',
  },
  {
    description: 'Manage tasks on the go.',
    image: require('./src/assets/image/OB4.png'), // Adjust the image source as needed
    textHighlight: 'tasks',
  },
  {
    description: 'Supercharge your team with Trudi®.',
    image: require('./src/assets/image/OB5.png'), // Adjust the image source as needed
    textHighlight: 'Trudi®',
  },
];

function App(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onNext = () => {
    if (currentIndex < walkthroughData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to the main screen or home screen
      // navigation.navigate('Home');
    }
  };

  const handleLeftPress = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRightPress = () => {
    if (currentIndex < walkthroughData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to the main screen or home screen
      // navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        {walkthroughData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.step,
              {backgroundColor: index === currentIndex ? '#00AA9F' : 'gray'},
            ]}
          />
        ))}
      </View>
      <WalkthroughScreen
        textHighlight={walkthroughData[currentIndex].textHighlight}
        description={walkthroughData[currentIndex].description}
        image={walkthroughData[currentIndex].image}
        step={currentIndex + 1}
      />
      <TouchableOpacity
        style={styles.leftTouchArea}
        onPress={handleLeftPress}
      />
      <TouchableOpacity
        style={styles.rightTouchArea}
        onPress={handleRightPress}
      />
      <View style={{width: '100%', backgroundColor: '#E8F3F1'}}>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text>
            {currentIndex === walkthroughData.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F3F1',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  step: {
    width: 64,
    height: 4,
    borderRadius: 12,
  },
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%', // Adjust the width based on the left touch area size
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%', // Adjust the width based on the right touch area size
  },
  button: {
    marginBottom: 37,
  },
});

export default App;
