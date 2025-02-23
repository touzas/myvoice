import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';

interface KeyProps {
  label: string;
  special?: boolean;
  upercase?: boolean;
  onPress: () => void;
}

const Key: React.FC<KeyProps> = ({ label, special, upercase, onPress }) => {
  return (
    <TouchableOpacity
      style={getStyle(label)}
      onPress={onPress}
    >
      <Text style={[styles.keyText, special ? styles.keyTextWhite : null]}>
        { !upercase && !special ? label.toLocaleLowerCase() : label.toLocaleUpperCase() }
      </Text>
    </TouchableOpacity>
  );
};

const getStyle = (key: string) => {
    if (key === 'Espacio') 
        return styles.spaceKey;
    else if (key === '⌫' || key === '⇑' || key === '↲' || key === 'Borrar')
        return styles.specialKey;
    return styles.key;
}

const defaultStyle = StyleSheet.create({
    Key: {
        flex:1,
        borderWidth: 1,
        borderRadius: 18,
        borderColor: Colors.PinkTheme.Purple,
        backgroundColor: 'white',
        color: Colors.PinkTheme.Purple,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        margin: 1,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 3,
    },
    SpecialKey: {
      backgroundColor: 'purple',
      color: 'white'
    }
});

const styles = StyleSheet.create({
    line: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 4,
    },
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
      ...defaultStyle.Key
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
        fontSize: 12,
        ...Dimensions.get('window').height >= 1200 && {
            fontSize: 25,
        },
        color: 'purple',
        fontWeight: '900'
    },
    keyTextWhite: {
        fontSize: 12,
        ...Dimensions.get('window').height >= 1200 && {
            fontSize: 25,
        },
        color: 'white',
        fontWeight: '900'
    },
});

export default Key;
