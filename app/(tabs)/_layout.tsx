import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Dimensions, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { GetDeviceOrientation, IsMobileDevice } from '@/constants/utils';
import * as ScreenOrientation from 'expo-screen-orientation';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null); 

  useEffect(() => { 
    const subscribeToOrientationChanges = async () => { 
      const currentOrientation = await ScreenOrientation.getOrientationAsync(); 
      setOrientation(currentOrientation); 
      const subscription = ScreenOrientation.addOrientationChangeListener((event) => { 
        setOrientation(event.orientationInfo.orientation); 
      }); 
      return () => { 
        ScreenOrientation.removeOrientationChangeListener(subscription); 
      }; 
    }; 

    subscribeToOrientationChanges(); 
  }, []);

  const GetOrientationName = (orientation: ScreenOrientation.Orientation | null) => {
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
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: IsMobileDevice() ? true : true,
          title: 'Comunicador' + (IsMobileDevice() ? ' móvil ' : ' tablet ') + (GetOrientationName(orientation)),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/configuration" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors.PinkTheme.Purple}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Juega conmigo',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
  );
}
