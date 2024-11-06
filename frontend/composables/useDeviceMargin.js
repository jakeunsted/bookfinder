import { Device } from '@capacitor/device';

export function useDevicePadding() {
  const marginAbove = ref('0px');

  onBeforeMount(async () => {
    const deviceInfo = await Device.getInfo();
    if (deviceInfo.platform === 'ios') {
      // Adjust for iOS devices with notches
      marginAbove.value = '50px';
    } else if (deviceInfo.platform === 'android') {
      // Adjust for Android devices with pinhole cameras
      marginAbove.value = '50px';
    } else {
      // Default for web or other platforms
      marginAbove.value = '0px';
    }
  });

  return { marginAbove };
}