/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectImage from './src/components/SelectImage/SelectImage';

function App(): React.JSX.Element {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [data] = useState(
    Array(24)
      .fill(0)
      .map((_, index) => {
        return index;
      }),
  );
  return (
    <View style={{flex:1}}>
      <SelectImage/>
    </View>
  );
}

const styles = StyleSheet.create({});

export default App;
