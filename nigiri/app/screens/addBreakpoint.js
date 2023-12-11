import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/breakpointStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import InsetShadow from 'react-native-inset-shadow';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddBreakpoint = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();
    const route = useRoute();
    const [timers, setTimers] = useState([]);
    const [newTimer, setNewTimer] = useState({
        createdAt: Date.now(),
        title: 'Timer',
        duration: 60000,
        vibration: 'Alarm',
        breakPoints: []
    });
    useEffect(() => {
        const getTimers = async () => {
            try {
                const storedTimers = await AsyncStorage.getItem('timers');
                if (storedTimers === null) {
                    // If there are no timers, save the initial timer array
                    await AsyncStorage.setItem('timers', JSON.stringify([]));
                } else {
                    // If there are existing timers, set them to state
                    setTimers(JSON.parse(storedTimers));
                }
            } catch (error) {
                console.error('Error accessing AsyncStorage:', error);
            }
        };
        getTimers();
    }, []);
    const routeNewTimer = route.params?.newTimer;
    useEffect(() => {
        console.log('routeNewTimer:', routeNewTimer);
        if (routeNewTimer) {
            setNewTimer(prevTimer => ({
                ...routeNewTimer,
                createdAt: Date.now(),
            }));
        }
    }, [routeNewTimer]);
    useEffect(() => {
        console.log('newTimer:', newTimer);
    }, [newTimer]);

    // ========== Navigation ========== //
    const handleBack = () => {
        navigation.navigate('Add');
    }

    // ========== UI ========== //
    const [totalDuration, setTotalDuration] = useState("");
    useEffect(() => {
        let totalDuration = 0;
        totalDuration = formatDuration(newTimer.duration);
        setTotalDuration(totalDuration);
    }, [newTimer]);
    const formatDuration = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

        if (hours === 0 && minutes === 0 && seconds !== 0) {
            return `${seconds} sec`;
        } else if (hours === 0 && seconds !== 0 && minutes !== 0) {
            return `${minutes} min ${seconds} sec`;
        } else if (seconds === 0 && minutes !== 0 && hours !== 0) {
            return `${hours} h ${minutes} min`;
        } else if (hours === 0 && seconds === 0 && minutes !== 0) {
            return `${minutes} min`;
        } else if (minutes === 0 && seconds === 0 && hours !== 0) {
            return `${hours} h`;
        } else {
            return `${hours} h ${minutes} min ${seconds} sec`;
        }
    };

    return (
        <View style={styles.breakpointContainer}>
            <View style={styles.breakpointTitleContainer}>
                <Text style={styles.breakpointTitle}>Total {totalDuration}</Text>
            </View>

            {newTimer.breakPoints.length === 0 ?
                (<View style={styles.breakpointBodyContainer}>
                    <TouchableOpacity style={styles.AddFirstBreakpoint}>
                        <FontAwesomeIcon icon={faPlus} size={24} color={colors.darkGray} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50 }}>
                        <Text style={{ fontSize: 20, fontWeight: '500', color: colors.Gray2, textAlign: 'center' }}>
                            Click the “+” button to Add a new Breakpoint
                        </Text>
                    </View>
                </View>
                ) : (
                    <View></View>
                )
            }

            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity style={styles.bottomButton} onPress={handleBack}>
                    <Text style={styles.bottomButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.black }]}>
                    <Text style={[styles.bottomButtonText, { color: colors.white }]}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddBreakpoint;
