import Colors from '@/constants/Colors';
import { KeyboardKeys } from '@/constants/Keys';
import React, { useMemo } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, View, Text } from 'react-native';
import Key from './Key';
import { IsTablet } from '@/constants/utils';

type KeyboardProps = {
    isUpperCase: boolean, 
    onKeyPress: (key: string) => void; 
};

const KeyboardTextToVoice: React.FC<KeyboardProps> = ({ isUpperCase, onKeyPress }) => {
  const groupedKeys = useMemo(() => { 
    return KeyboardKeys.reduce((acc, key) => {
        acc[key.line] = acc[key.line] ? [...acc[key.line], key] : [key];
        return acc;
    }, {} as Record<number, typeof KeyboardKeys>);
  }, [KeyboardKeys]);

    return (
        <View style={styles.keyboard}>
          {Object.keys(groupedKeys).map((line) => (
            <View key={line} style={styles.line}>
              {groupedKeys[parseInt(line)].map((key) => (
                <Key
                    key={key.value}
                    label={key.value}
                    special={key.specialKey}
                    upercase={isUpperCase}
                    onPress={() => onKeyPress(key.value)}
                />
              ))}
            </View>
          ))}
        </View>
    );
  };

const styles = StyleSheet.create({
    keyboard: {
        padding: 10,
        backgroundColor: Colors.PinkTheme.Pink,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        margin: 5
    },
    line: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 4,
        ...!IsTablet() && { marginVertical: 1 },
    },
});

  export default KeyboardTextToVoice;