import { Dimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const IsMobileDevice = () => {
    return Device.deviceType === Device.DeviceType.PHONE;
}

export const GetDeviceOrientation = async () => {
    let orientation = await ScreenOrientation.getOrientationAsync();
    return orientation;
}
export const GetOrientationName = (orientation: ScreenOrientation.Orientation | null) => {
    switch (orientation) {
        case ScreenOrientation.Orientation.PORTRAIT_UP:
        case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 'vertical';
        case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return 'horizontal';
        default:
        return 'desconocida';
    }
}

export const IsPortrait = (orientation: ScreenOrientation.Orientation | null) => {
    switch (orientation) {
        case ScreenOrientation.Orientation.PORTRAIT_UP:
        case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return true;
        case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        default:
        return false;
    }
}

export const WindowWidth = () => {
    return Dimensions.get('window').width;
}

export const WindowHeight = () => {
    return Dimensions.get('window').height;
}

export const GetSavedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      if (jsonValue != null){
        let savedData = JSON.parse(jsonValue);
        return savedData;
      }
    } catch (e) {
      // error reading value
    }
    return null;
};

export const IsDebug: boolean = true;