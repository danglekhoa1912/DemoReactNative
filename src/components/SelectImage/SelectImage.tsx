import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { SkeletonImage } from './components/SkeletonImage';

interface CurrentPageInfo {
  has_next_page: boolean;
  end_cursor?: string;
}

const SelectImage = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [photosSelected, setPhotosSelected] = useState<PhotoIdentifier[]>([]);
  const [currentPageInfo, setCurrentPageInfo] = useState<CurrentPageInfo>({
    has_next_page: true,
  });

  const openSettingsAlert = useCallback(({title}: {title: string}) => {
    Alert.alert(title, '', [
      {
        isPreferred: true,
        style: 'default',
        text: 'Open Settings',
        onPress: () => Linking?.openSettings(),
      },
      {
        isPreferred: false,
        style: 'destructive',
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  }, []);

  const checkAndroidPermissions = useCallback(async () => {
    if (parseInt(Platform.Version as string, 10) >= 33) {
      const permissions = await Permissions.checkMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]);
      if (
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.GRANTED &&
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.GRANTED
      ) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.requestMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ]);
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.GRANTED &&
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.GRANTED
      ) {
        setHasPermission(true);
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.DENIED ||
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === Permissions.RESULTS.DENIED
      ) {
        checkAndroidPermissions();
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
          Permissions.RESULTS.BLOCKED ||
        res[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] ===
          Permissions.RESULTS.BLOCKED
      ) {
        openSettingsAlert({
          title: 'Please allow access to your photos and videos from settings',
        });
      }
    } else {
      const permission = await Permissions.check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (permission === Permissions.RESULTS.GRANTED) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (res === Permissions.RESULTS.GRANTED) {
        setHasPermission(true);
      }
      if (res === Permissions.RESULTS.DENIED) {
        checkAndroidPermissions();
      }
      if (res === Permissions.RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow access to the photo library from settings',
        });
      }
    }
  }, [openSettingsAlert]);

  const checkPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const permission = await Permissions.check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (
        permission === Permissions.RESULTS.GRANTED ||
        permission === Permissions.RESULTS.LIMITED
      ) {
        setHasPermission(true);
        return;
      }
      const res = await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (
        res === Permissions.RESULTS.GRANTED ||
        res === Permissions.RESULTS.LIMITED
      ) {
        setHasPermission(true);
      }
      if (res === Permissions.RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow access to the photo library from settings',
        });
      }
    } else if (Platform.OS === 'android') {
      checkAndroidPermissions();
    }
  }, [checkAndroidPermissions, openSettingsAlert]);

  const handleSelectImage = (id: string, selected: boolean) => {
    if (selected) {
      setPhotosSelected([
        ...photosSelected,
        photos.find(photo => photo.node.id === id)!,
      ]);
      return;
    }
    setPhotosSelected(photosSelected.filter(photo => photo.node.id !== id));
  };

  const fetchPhotos = async () => {
    if (!currentPageInfo.has_next_page) {
      return;
    }
    const {edges, page_info} = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'All',
      include: ['playableDuration'],
      after: currentPageInfo.end_cursor,
    });
    setPhotos(photos => [...photos, ...edges]);
    console.log(page_info);
    setCurrentPageInfo(page_info);
  };

  const handleOpenCamera = async () => {
    const result = await launchCamera({
      mediaType: 'mixed',
    });
  };

  const handleOpenLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
    });
  };

  useEffect(() => {
    if (hasPermission) {
      fetchPhotos();
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Button title="Camera" onPress={handleOpenCamera} />
        <Button title="Library" onPress={handleOpenLibrary} />
      </View>
      <FlatList
        numColumns={3}
        data={photos}
        keyExtractor={item => item.node.id.toString() + Math.random()}
        renderItem={({item, index}) => (
          <SkeletonImage
            photo={item}
            delay={index * 100}
            selected={
              photosSelected.findIndex(
                photo => photo.node.id === item.node.id,
              ) !== -1
            }
            onSelected={handleSelectImage}
          />
        )}
        style={styles.list}
        contentContainerStyle={{paddingBottom: 16}}
        onEndReached={fetchPhotos}
        onEndReachedThreshold={0.2}
      />
    </SafeAreaView>
  );
};

export default SelectImage;

const styles = StyleSheet.create({
  list: {padding: 16, flex: 1},
});
