import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/addStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import InsetShadow from 'react-native-inset-shadow';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Add = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();
    const route = useRoute();
    const [newTimer, setNewTimer] = useState({
        createdAt: Date.now(),
        title: '',
        duration: 60000,
        vibration: 'Alarm',
        breakPoints: []
    });

    // ========== Time Wheel Picker ========== //
    const Hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const Minutes = Array.from({ length: 60 }, (_, index) => index);
    const Seconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const [duration, setDuration] = useState({
        hour: 0,
        minute: 1,
        second: 0,
    });
    const [durationInMilliseconds, setDurationInMilliseconds] = useState(0);

    useEffect(() => {
        console.log(duration);
        const hourInMilliseconds = duration.hour * 60 * 60 * 1000;
        const minuteInMilliseconds = duration.minute * 60 * 1000;
        const secondInMilliseconds = duration.second * 1000;
        const durationInMilliseconds = hourInMilliseconds + minuteInMilliseconds + secondInMilliseconds;
        setDurationInMilliseconds(durationInMilliseconds);
    }, [duration]);
    useEffect(() => {
        setNewTimer(prevTimer => ({
            ...prevTimer,
            duration: durationInMilliseconds
        }));
        console.log(durationInMilliseconds);
    }, [durationInMilliseconds]);

    // ========== Vibration ========== //
    const routeVibration = route.params?.vibration;

    useEffect(() => {
        if (routeVibration) {
            setNewTimer(prevTimer => ({
                ...prevTimer,
                vibration: routeVibration
            }));
        }
        setNewTimer
    }, [routeVibration]);

    // ========== Navigation ========== //
    const handleCancel = () => {
        setDurationInMilliseconds(0);
        setNewTimer({
            createdAt: Date.now(),
            title: 'Timer',
            duration: 60000,
            vibration: 'Alarm',
            breakPoints: [
                {
                    startAt: 0,
                    duration: 0,
                    endAt: 0,
                }
            ]
        });
        setDuration({
            hour: 0,
            minute: 1,
            second: 0,
        });
        navigation.navigate('Home');
    }
    const handleNext = () => {
        if(newTimer.title === ''){
            setNewTimer(prevTimer => ({
                ...prevTimer,
                title: 'Timer'
            }));
        }
        navigation.navigate('AddBreakpoint', { newTimer });
    }


    return (
        <View style={styles.addContainer}>

            <View style={styles.operationContainer}>
                <View style={styles.timeSelectContainer}>
                    <View style={styles.timeSelectModule}>
                        <View style={styles.timeSelectTiteContainer}>
                            <Text style={styles.timePickerTitle}>hour</Text>
                        </View>
                        <InsetShadow
                            shadowOpacity={0.12}
                            shadowOffset={2}
                            shadowRadius={4}
                            shadowColor={colors.black}
                            containerStyle={styles.timeSelectWheelContainer}
                        >
                            <InsetShadow
                                shadowOpacity={1}
                                shadowColor={colors.white}
                                shadowOffset={0}
                                shadowRadius={15}
                                containerStyle={styles.timeSelectWheelContainer}
                            >
                                <View style={styles.timeSelectWheelContent}>
                                    <WheelPickerExpo
                                        height={220}
                                        width={100}
                                        initialSelectedIndex={0}
                                        items={Hours.map((hour) => ({ label: `${hour}`, value: hour }))}
                                        renderItem={(props) => {
                                            return (
                                                <Text style={styles.timeWheelItemText}>{props.label}</Text>
                                            );
                                        }}
                                        onChange={({ item }) => {
                                            setDuration(prevDuration => ({
                                                ...prevDuration,
                                                hour: item.value
                                            }));
                                        }}
                                    />
                                </View>
                            </InsetShadow>
                        </InsetShadow>
                    </View>
                    <View style={styles.timeSelectModule}>
                        <View style={styles.timeSelectTiteContainer}>
                            <Text style={styles.timePickerTitle}>min</Text>
                        </View>
                        <InsetShadow
                            shadowOpacity={0.12}
                            shadowOffset={2}
                            shadowRadius={4}
                            shadowColor={colors.black}
                            containerStyle={styles.timeSelectWheelContainer}
                        >
                            <InsetShadow
                                shadowOpacity={1}
                                shadowColor={colors.white}
                                shadowOffset={0}
                                shadowRadius={15}
                                containerStyle={styles.timeSelectWheelContainer}
                            >
                                <View style={styles.timeSelectWheelContent}>
                                    <WheelPickerExpo
                                        height={220}
                                        width={100}
                                        initialSelectedIndex={1}
                                        items={Minutes.map((minute) => ({ label: `${minute}`, value: minute }))}
                                        renderItem={(props) => {
                                            return (
                                                <Text style={styles.timeWheelItemText}>{props.label}</Text>
                                            );
                                        }}
                                        onChange={({ item }) => {
                                            setDuration(prevDuration => ({
                                                ...prevDuration,
                                                minute: item.value
                                            }));
                                        }}
                                    />
                                </View>
                            </InsetShadow>
                        </InsetShadow>
                    </View>
                    <View style={styles.timeSelectModule}>
                        <View style={styles.timeSelectTiteContainer}>
                            <Text style={styles.timePickerTitle}>sec</Text>
                        </View>
                        <InsetShadow
                            shadowOpacity={0.12}
                            shadowOffset={2}
                            shadowRadius={4}
                            shadowColor={colors.black}
                            containerStyle={styles.timeSelectWheelContainer}
                        >
                            <InsetShadow
                                shadowOpacity={1}
                                shadowColor={colors.white}
                                shadowOffset={0}
                                shadowRadius={15}
                                containerStyle={styles.timeSelectWheelContainer}
                            >
                                <View style={styles.timeSelectWheelContent}>
                                    <WheelPickerExpo
                                        height={220}
                                        width={100}
                                        initialSelectedIndex={0}
                                        items={Seconds.map((second) => ({ label: `${second}`, value: second }))}
                                        renderItem={(props) => {
                                            return (
                                                <Text style={styles.timeWheelItemText}>{props.label}</Text>
                                            );
                                        }}
                                        onChange={({ item }) => {
                                            setDuration(prevDuration => ({
                                                ...prevDuration,
                                                second: item.value
                                            }));
                                        }}
                                    />
                                </View>
                            </InsetShadow>
                        </InsetShadow>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={[styles.inputRow, { borderBottomColor: colors.Gray2, borderBottomWidth: 1 }]}>
                        <Text style={styles.inputTitle}>Title</Text>
                        <TextInput
                            style={styles.titleInputField}
                            placeholder="Timer"
                            placeholderTextColor={colors.darkGray}
                            onChangeText={(text) => {
                                setNewTimer(prevTimer => ({
                                    ...prevTimer,
                                    title: text
                                }));
                            }}
                            selectionColor={colors.darkGray}
                            value={newTimer.title}
                            maxLength={20}
                        />
                    </View>
                    <TouchableOpacity style={[styles.inputRow, { paddingRight: 14 }]} onPress={() => navigation.navigate('Vibration')}>
                        <Text style={styles.inputTitle}>Vibration</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                            <Text style={styles.inputTitle}>{newTimer.vibration}</Text>
                            <FontAwesomeIcon icon={faAngleRight} size={18} color={colors.black} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleCancel()}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.black }]} onPress={() => handleNext()}>
                    <Text style={[styles.buttonText, { color: colors.white, fontWeight: '500' }]}>Next</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default Add;
