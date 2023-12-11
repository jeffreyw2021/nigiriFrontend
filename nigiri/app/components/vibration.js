import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/vibrationStyle';
import colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import vibrationPatterns from './vibrationCollection';

const Vibration = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();

    // ========== Vibration ========== //
    const [vibration, setVibration] = useState('Alarm');
    const handleSelectVibration = () => {
        navigation.navigate('Add', { vibration });
    };

    return (
        <View style={styles.vibrationContainer}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('Add')}>
                    <Text style={[styles.buttonText, { color: colors.darkGray }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton} onPress={handleSelectVibration}>
                    <Text style={styles.buttonText}>Select</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.selectionContainer}>
                {Object.keys(vibrationPatterns).map((title, index, array) => (
                    <TouchableOpacity
                        style={[styles.selectionRow, index === array.length - 1 && { borderBottomWidth: 0 }]}
                        key={title}
                        onPress={() => setVibration(title)}
                    >
                        <View style={styles.selectionRadio}>
                            {vibration === title && (<View style={styles.selectionRadioActive}></View>)}
                        </View>
                        <Text style={styles.selectionTitle}>{title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default Vibration;
