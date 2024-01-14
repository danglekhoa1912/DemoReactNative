
import ImageEditor from '@react-native-community/image-editor';
import MaskedView from '@react-native-masked-view/masked-view';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Image, PermissionsAndroid, PixelRatio, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import UploadPhotoStyles from './UploadPhoto.styles';
import Slider from './components/Slider';

const Screen = Dimensions.get('window');
const ScreenWidth = Screen.width;
const ScreenHeight = Screen.height;

const UploadPhotoStep = () => {
  const styles = UploadPhotoStyles();
  const [profilePhoto, setProfilePhoto] = useState<Asset>();
  const [result, setResult] = useState('');
  const context = useSharedValue({ x: 0, y: 0 });
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const [imageScale, setImageScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
      { scale: imageScale },
    ],
  }));

  useEffect(()=>{
    Image.getSize(profilePhoto?.uri||'',(width,height)=>{
      console.log(width/PixelRatio.get(),height/PixelRatio.get())
      setImageSize({
        width:width/PixelRatio.get(),
        height:height/PixelRatio.get(),
      })
    })
    
  },[profilePhoto])

  const handlePan = Gesture.Pan()
    .onStart(() => {
      context.value = { x: positionX.value, y: positionY.value };
    })
    .onUpdate(e => {
      const maxX = (imageSize.width * imageScale - 180) / 2;
      const currentX = e.translationX + context.value.x;

      const maxY = (imageSize.height * imageScale - 180) / 2;
      const currentY = e.translationY + context.value.y;
      const newX = Math.min(maxX, Math.abs(currentX));
      const newY = Math.min(maxY, Math.abs(currentY));

      positionX.value = currentX > 0 ? newX : -newX;
      positionY.value = currentY > 0 ? newY : -newY;
    });
  // const requestReadStoragePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       {
  //         title: '“Trudi” Would like to Access Your Photos',
  //         message:
  //           'App requires access to your photo library to ' +
  //           'let you browse your albums.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  const handleChangeScaleImage = value => {
    setImageScale(1 + value / 100);
  };

  const handleUploadProfile = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    console.log(granted);
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (result.assets?.length) {
      setProfilePhoto(result.assets[0]);
    }
  };

  const handleCrop = async () => {
    let newSize = 180 / imageScale ;
    let x = Math.abs(positionX.value - (imageSize.width * imageScale - 180 ) / 2);
    let y = Math.abs(positionY.value - (imageSize.height * imageScale - 180 ) / 2);
    const cropData = {
      offset: {
        x: PixelRatio.getPixelSizeForLayoutSize(x/ imageScale),
        y: PixelRatio.getPixelSizeForLayoutSize(y/ imageScale),
      },
      size: {
        width: PixelRatio.getPixelSizeForLayoutSize(newSize),
        height: PixelRatio.getPixelSizeForLayoutSize(newSize),
      },
    };
    const result = await ImageEditor.cropImage(
      profilePhoto?.uri || '',
      cropData,
    );
    setResult(result);
  };

  return (
    <View style={{gap:32}} >
      {/* <View style={styles.header}>
        <TrudiIcon icon={'TrudiLogoCommon'} size={ESize.XXXL} />
        <TrudiText style={styles.title}>Upload your photo</TrudiText>
        <TrudiText style={styles.subTitle} fontFamily="WorkSans-Regular">
          So teammates can see who is assigned to what.
        </TrudiText>
      </View> */}
      <Image
        source={{ uri: result }}
        width={100}
        height={100}
        resizeMode="cover"
        style={{ borderRadius: 100 }}
      />
      <View style={styles.containerUpload}>
        {profilePhoto ? (
          <>
            {/* <Image
              source={{ uri: profilePhoto.uri }}
              width={180}
              height={180}
              style={{ borderRadius: 180 }}
            />
            <TrudiIconButton
              style={{ position: 'absolute', top: 60, right: 100 }}
              size={ESize.S}
              icon={'UploadImage'}
              variant={'primary'}
              appearance={'standard'}
              onPress={handleUploadProfile}
            /> */}
            <GestureDetector gesture={handlePan}>
              <View
                style={{
                  width: 310,
                  height: 260,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <MaskedView
                  style={{ width: ScreenWidth, height: ScreenHeight }}
                  maskElement={
                    <View
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Svg height={180} width={180}>
                        <Circle cx="90" cy="90" r="90" fill="black" />
                      </Svg>
                    </View>
                  }
                >
                  <Animated.Image
                    source={{ uri: profilePhoto.uri }}
                    style={[
                      {
                        width: '100%',height:'100%', backgroundColor:'red'
                      },
                      animatedStyle,
                    ]}
                    onLayout={(e)=>{
                      console.log('hello',e.nativeEvent.layout.width,ScreenWidth)
                      
                    }}
                    resizeMode={'center'}
                  />
                </MaskedView>
                <TouchableOpacity  onPress={handleUploadProfile} style={{position:'absolute'}} ><Text>Upload</Text></TouchableOpacity>
              </View>
            </GestureDetector>
          </>
        ) : (
          <View style={styles.profile}>
            <Button onPress={handleUploadProfile} title="Upload" />
          </View>
        )}
        <Slider
          value={imageScale * 100 - 100}
          onValueChange={handleChangeScaleImage}
        />
      </View>
      <View style={{gap:12}}>
        <Button
        title='Save'
          onPress={handleCrop}
        />
      </View>
    </View>
  );
};

export { UploadPhotoStep };

