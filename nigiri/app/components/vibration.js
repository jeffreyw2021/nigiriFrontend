import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import styles from '../styles/vibrationStyle';
import colors from '../styles/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import vibrationPatterns from './vibrationCollection';

const VibrationSelect = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();
    const route = useRoute();  
    const routeFrom = route.params?.from;

    // ========== Vibration ========== //
    const [selectedVibration, setSelectedVibration] = useState('Alarm');

    const handleSelectVibration = () => {
        console.log('selectedVibration', selectedVibration);
        if (routeFrom === 'EditInfo') {
            navigation.navigate('EditInfo', { vibration: selectedVibration });
        } else {

            navigation.navigate('Add', { vibration: selectedVibration });
        }
    };
    const handleBack = () => {
        if (routeFrom === 'EditInfo') {
            navigation.navigate('EditInfo');
        } else {
            navigation.navigate('Add');
        }
    }

    return (
        <View style={styles.vibrationContainer}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.topButton} onPress={handleBack}>
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
                        onPress={() => {
                            Vibration.vibrate(vibrationPatterns[title]);
                            setSelectedVibration(title);
                        }}
                    >
                        <View style={styles.selectionRadio}>
                            {selectedVibration === title && (<View style={styles.selectionRadioActive}></View>)}
                        </View>
                        <Text style={styles.selectionTitle}>{title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default VibrationSelect;
