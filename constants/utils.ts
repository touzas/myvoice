import { Dimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Device from 'expo-device';

export const IsMobileDevice = () => {
    return Device.deviceType === Device.DeviceType.PHONE;
}

export const GetDeviceOrientation = async () => {
    let orientation = await ScreenOrientation.getOrientationAsync();
    return orientation;
}

export const WindowWidth = () => {
    return Dimensions.get('window').width;
}

export const WindowHeight = () => {
    return Dimensions.get('window').height;
}

export const IsDebug: boolean = true;