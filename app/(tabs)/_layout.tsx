import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import { Link, Tabs } from 'expo-router';
import { Dimensions, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { GetOrientationName, GetSavedData, IsMobileDevice, IsPortrait } from '@/constants/utils';
import * as ScreenOrientation from 'expo-screen-orientation';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
function TabBarIconFoundation(props: {
  name: React.ComponentProps<typeof Foundation>['name'];
  color: string;
}) {
  return <Foundation size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [userName, setUserName] = useState('');

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

    const loadUserName = async () => {
      GetSavedData().then((data) => {
        if (data !== null){
          console.log(data);
          setUserName(data.name);
        }
      });
    }

    subscribeToOrientationChanges(); 
    loadUserName();
  }, []);

  
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
          headerShown: IsMobileDevice() && !IsPortrait(orientation) ? false : true,
          title: 'Comunicador de ' + userName, // + (IsMobileDevice() ? ' móvil ' : ' tablet ') + (GetOrientationName(orientation)),
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
        name='agenda'
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <TabBarIcon name="tasks" color={color} />,
        }}
      />
      {
      /*
      <Tabs.Screen
        name="math"
        options={{
          title: 'Juega conmigo',
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
        }}
      />
      */
      }
      <Tabs.Screen
        name='tictactoe'
        options={{
          title: 'Tres en raya',
          tabBarIcon: ({ color }) => <TabBarIconFoundation name="die-three" color={color} />,
        }}
      />
    </Tabs>
  );
}
