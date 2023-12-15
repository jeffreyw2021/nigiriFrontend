import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/addStyle';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import InsetShadow from 'react-native-inset-shadow';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import {formatDuration} from '../helper/formatDuration';
const EditInfo = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();
    const route = useRoute();
    const [newTimer, setNewTimer] = useState({
        id: '',
        createdAt: Date.now(),
        title: '',
        duration: 60000,
        vibration: 'Alarm',
        breakPoints: []
    });
    useEffect(() => {
        console.log("newTimer:", newTimer);
    }, [newTimer]);

    const isTitleInDurationFormat = (title) => {
        const hourRegex = /(\d{1,2}) h/;
        const minuteRegex = /(\d{1,2}) min/;
        const secondRegex = /(\d{1,2}) sec/;
    
        const hourMatch = title.match(hourRegex);
        const minuteMatch = title.match(minuteRegex);
        const secondMatch = title.match(secondRegex);
    
        const hour = hourMatch ? parseInt(hourMatch[1], 10) : null;
        const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : null;
        const second = secondMatch ? parseInt(secondMatch[1], 10) : null;
    
        if (hour !== null && (hour < 0 || hour > 9)) return false;
        if (minute !== null && (minute < 0 || minute > 59)) return false;
        if (second !== null && (second < 0 || second > 59)) return false;
    
        return true;
    };

    // ========== Time Wheel Picker ========== //
    const [Hours, setHours] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [Minutes, setMinutes] = useState(Array.from({ length: 60 }, (_, index) => index));
    const [Seconds, setSeconds] = useState(Array.from({ length: 60 }, (_, index) => index));
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
    const convertMillisecondsToTimeObject = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

        return { hour: hours, minute: minutes, second: seconds };
    };


    // ========== Vibration ========== //
    const routeVibration = route.params?.vibration;

    useEffect(() => {
        if (routeVibration) {
            setNewTimer(prevTimer => ({
                ...prevTimer,
                vibration: routeVibration
            }));
        }
    }, [routeVibration]);

    // ========== Navigation ========== //
    const [initalHourSpinnerIndex, setInitalHourSpinnerIndex] = useState(0);
    const [initalMinuteSpinnerIndex, setInitalMinuteSpinnerIndex] = useState(1);
    const [initalSecondSpinnerIndex, setInitalSecondSpinnerIndex] = useState(0);

    const routeNewTimer = route.params?.timer;
    // Calculate durationInMilliseconds based on the updated duration state
    useEffect(() => {
        const hourInMilliseconds = duration.hour * 60 * 60 * 1000;
        const minuteInMilliseconds = duration.minute * 60 * 1000;
        const secondInMilliseconds = duration.second * 1000;
        const totalDurationInMilliseconds = hourInMilliseconds + minuteInMilliseconds + secondInMilliseconds;
        setDurationInMilliseconds(totalDurationInMilliseconds);
    }, [duration, newTimer.title]);    

    // Update newTimer duration when durationInMilliseconds changes
    useEffect(() => {
        const formattedTitle = formatDuration(durationInMilliseconds);
        const timerTitle = newTimer.title;
        const timeout = setTimeout(() => {
            setNewTimer(prevTimer => ({
                ...prevTimer,
                title: isTitleInDurationFormat(timerTitle) ? formattedTitle : timerTitle,
                duration: durationInMilliseconds
            }));
        }, 500);

        return () => clearTimeout(timeout);
    }, [durationInMilliseconds]);
    // useEffect(() => {
    //     if (routeNewTimer) {
    //         const times = convertMillisecondsToTimeObject(routeNewTimer.duration);

    //         // Generate arrays for hours, minutes, and seconds based on the times object
    //         const newHours = Array.from({ length: 10 - times.hour }, (_, i) => i + times.hour);
    //         const newMinutes = Array.from({ length: 60 - times.minute }, (_, i) => i + times.minute);
    //         const newSeconds = Array.from({ length: 60 - times.second }, (_, i) => i + times.second);

    //         // Update state arrays
    //         setHours(newHours);
    //         setMinutes(newMinutes);
    //         setSeconds(newSeconds);
    //     }
    // }, [routeNewTimer]);    
    useEffect(() => {
        if (routeNewTimer) {
            const times = convertMillisecondsToTimeObject(routeNewTimer.duration);
            setDuration(times);
            setInitalHourSpinnerIndex(Hours.findIndex(hour => hour === times.hour));
            setInitalMinuteSpinnerIndex(Minutes.findIndex(minute => minute === times.minute));
            setInitalSecondSpinnerIndex(Seconds.findIndex(second => second === times.second));
            setNewTimer(routeNewTimer);
        }
    }, [routeNewTimer, Hours, Minutes, Seconds]);
    const handleCancel = () => {
        const timer = route.params?.timer.id;
        navigation.navigate('Detail', { timer });
    }
    const routeBreakPoints = route.params?.savedBreakpoints;
    useEffect(() => {
        if (routeBreakPoints) {
            setNewTimer(prevTimer => ({
                ...prevTimer,
                breakPoints: routeBreakPoints
            }));
        }
        console.log(routeBreakPoints);
    }, [routeBreakPoints]);
    const handleNext = () => {
        if (newTimer.duration === 0) {
            alert('Please set a duration for the timer.');
            return;
        }

        const newTimerBreakpoints = newTimer.breakPoints;
        const newTimerDuration = newTimer.duration;
        let isOverflown = false;

        for (let i = 0; i < newTimerBreakpoints.length; i++) {
            if (newTimerBreakpoints[i].startAt > newTimerDuration || newTimerBreakpoints[i].endAt > newTimerDuration) {
                isOverflown = true;
                break;
            }
        }

        if (isOverflown) {
            Alert.alert(
                '',
                `Intervals exceeding the timer's duration will be adjusted or removed. Do you wish to Proceed?`,
                [
                    { text: 'Cancel', onPress: () => console.log('Review Pressed'), style: 'cancel' },
                    { text: 'Proceed', onPress: () => navigateToEdit() },
                ],
                { cancelable: false }
            );
            return;
        } else {
            navigateToEdit();
        }
    };
    const navigateToEdit = () => {
        const timer = newTimer;
        if (newTimer.title === '') {
            timer = { ...newTimer, title: formatDuration(newTimer.duration) };
        }
        navigation.navigate('Edit', { timer });
    };
    const handleVibration = () => {
        const from = 'EditInfo';
        navigation.navigate('Vibration', { from });
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
                                        initialSelectedIndex={initalHourSpinnerIndex}
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
                                        initialSelectedIndex={initalMinuteSpinnerIndex}
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
                                        initialSelectedIndex={initalSecondSpinnerIndex}
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
                                setCustomizedTitle(true);
                            }}
                            selectionColor={colors.darkGray}
                            value={newTimer.title}
                            maxLength={26}
                        />
                    </View>
                    <TouchableOpacity style={[styles.inputRow, { paddingRight: 14 }]} onPress={handleVibration}>
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

export default EditInfo;
