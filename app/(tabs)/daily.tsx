import { StyleSheet, TextInput } from 'react-native';
import Colors from '@/constants/Colors';
import {weeklyClass, dailyClass, WeeklyClasses} from '@/constants/schoolClasses';
import { Text, View } from '@/components/Themed';
import Moment from 'moment';
import React, { useState, useEffect } from 'react';


export default function TabDailyScreen() {

    Moment.locale('ES_es');
    const currentDate = Moment().format('dddd, D [de] MMMM [de] YYYY'); 

    function renderClasses(items: dailyClass) {
        let startTime = Moment(items.startTime);
        let endTime = Moment(items.endTime);
        return (
            <View style={styles.row} key={items.startTime}>
                <View style={styles.columnTime}>
                    <Text style={styles.subTitle}>{startTime.format('HH:mm')}-{endTime.format('HH:mm')}</Text>
                </View>
                <View style={styles.columnClasses}>
                    <Text style={styles.subTitle}>{items.className}</Text>
                </View>
                <View style={styles.columnFeel}>
                    <Text style={styles.subTitle}>Bien/Regular/Mal</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentDate}</Text>
            <View style={styles.row}>
                <View style={{flex:2, backgroundColor:'white'}}></View>
                <View style={styles.columnClasses}>
                    <Text style={styles.subTitle}>MIS CLASES DE HOY</Text>
                </View>
                <View style={styles.columnFeel}>
                    <Text style={styles.subTitle}>¿Cómo me ha ido?</Text>
                </View>
            </View>
            {WeeklyClasses.map((day:weeklyClass) => {
                if (day.day === Moment().format('dddd')) {
                    return day.classes.map((clase:dailyClass) => {
                        return renderClasses(clase);
                    });
                }
                return null;
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.PinkTheme.Purple,
        textAlign: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.PinkTheme.Purple,
        padding: 2,
    },
    columnTime: {
        flex: 2,
        borderRightWidth: 2,
        borderColor: Colors.PinkTheme.Purple,
    },
    columnClasses: {
        flex: 10,
        borderRightWidth: 2,
        borderColor: Colors.PinkTheme.Purple,
    },
    columnFeel: {
        flex: 3
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'white',
        height: 100,
    }
});