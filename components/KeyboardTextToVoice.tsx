import Colors from '@/constants/Colors';
import { InputKey, KeyboardKeys, DefaultFontSize } from '@/constants/Keys';
import React from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type KeyboardProps = {
    isUpperCase: boolean, 
    onKeyPress: (key: string) => void; 
};

interface LineDetails {
    keys: InputKey[],
    eventKeyPress: KeyboardProps
}

const RenderLine: React.FC<LineDetails> = ({ 
    keys,
    eventKeyPress: props

} : LineDetails) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
  
    const onPressIn = () => {
        scale.value = withTiming(0.9, { duration: 50 });
    };
  
    const onPressOut = () => {
        scale.value = withTiming(1, { duration: 50 });
    };
  
    
    const renderedLine:JSX.Element[] = [];

    keys.map((key) => {
        const inputKey = 'key_' + key.line + '_' + key.value;
        renderedLine.push(
            <Pressable
                key={inputKey}
                onPressIn={onPressIn}
                onPressOut={() => {
                    onPressOut();
                    props.onKeyPress(key.value);
                }}
                style={ getStyle(key.value) }
            >
                <Animated.View>
                    <Text style={ [key.specialKey ? styles.keyTextWhite : styles.keyText, null, animatedStyle] }>
                        { !props.isUpperCase && !key.specialKey ? key.value.toLocaleLowerCase() : key.value.toLocaleUpperCase() }
                    </Text>
                </Animated.View>
            </Pressable>
        );
    });
    return renderedLine;
}

const getStyle = (key: string) => {
    if (key === 'Espacio') 
        return styles.spaceKey;
    else if (key === '⌫' || key === '⇑' || key === '↲' || key === 'Borrar')
        return styles.specialKey;
    return styles.key;
}

const KeyboardTextToVoice: React.FC<KeyboardProps> = ({ isUpperCase, onKeyPress }) => {
    return (
      <View style={styles.keyboard}>
        <View style={styles.keyboardLine} key={1}>
            {RenderLine({keys: KeyboardKeys.filter((key: InputKey) => key.line === 1), eventKeyPress: { onKeyPress, isUpperCase } })}
        </View>
        <View style={styles.keyboardLine} key={2}>
            {RenderLine({keys: KeyboardKeys.filter((key: InputKey) => key.line === 2), eventKeyPress: { onKeyPress, isUpperCase } })}
        </View>
        <View style={styles.keyboardLine} key={3}>
            {RenderLine({keys: KeyboardKeys.filter((key: InputKey) => key.line === 3), eventKeyPress: { onKeyPress, isUpperCase } })}
        </View>
        <View style={styles.keyboardLine} key={4}>
            {RenderLine({keys: KeyboardKeys.filter((key: InputKey) => key.line === 4), eventKeyPress: { onKeyPress, isUpperCase } })}
        </View>
        <View style={styles.keyboardLine} key={5}>
            {RenderLine({keys: KeyboardKeys.filter((key: InputKey) => key.line === 5), eventKeyPress: { onKeyPress, isUpperCase } })}
        </View>
      </View>
    );
  };

const defaultStyle = StyleSheet.create({
    Key: {
      flex:1,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: Colors.PinkTheme.Purple,
      backgroundColor: Colors.PinkTheme.Pink,
      color: Colors.PinkTheme.Purple,
      fontWeight: '900',
      fontFamily: 'consolas',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      margin: 1
    },
    SpecialKey: {
      backgroundColor: 'purple',
      color: 'white'
    }
  });
  
  const styles = StyleSheet.create({
    keyboard : {
        display: 'flex', 
        flexDirection: 'column',
        flex: 1
    },
    keyboardLine : {
        display:'flex', 
        flexDirection: 'row'
    },
    key:{
      ...defaultStyle.Key,
      backgroundColor: 'white',
    },
    spaceKey: {
      ...defaultStyle.Key,
      ...defaultStyle.SpecialKey,
      flex: 5
    },
    specialKey: {
      ...defaultStyle.Key,
      ...defaultStyle.SpecialKey
    },
    keyText: {
        fontSize: DefaultFontSize,
        color: 'purple',
        fontWeight: '900'
    },
    keyTextWhite: {
        fontSize: DefaultFontSize,
        color: 'white',
    },
  });

  export default KeyboardTextToVoice;