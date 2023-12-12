import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/breakpointStyle';
import DashedLine from '../components/dashedLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import InsetShadow from 'react-native-inset-shadow';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDown, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

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
            if (routeNewTimer.title === '') {
                setNewTimer(prevTimer => ({
                    ...routeNewTimer,
                    title: 'Timer',
                    createdAt: Date.now(),
                }));
            } else {
                setNewTimer(prevTimer => ({
                    ...routeNewTimer,
                    createdAt: Date.now(),
                }));
            }
        }
    }, [routeNewTimer]);

    const prevBreakPointsRef = useRef();
    const didDurationChange = (currentBreakpoints, prevBreakpoints) => {
        if (currentBreakpoints.length !== prevBreakpoints.length) return true;

        for (let i = 0; i < currentBreakpoints.length; i++) {
            if (currentBreakpoints[i].duration !== prevBreakpoints[i].duration) {
                return true;
            }
        }
        return false;
    }
    useEffect(() => {
        const prevBreakPoints = prevBreakPointsRef.current;

        if (didDurationChange(newTimer.breakPoints, prevBreakPoints || [])) {
            let cumulativeStartAt = 0;
            const updatedBreakpoints = newTimer.breakPoints.map(breakpoint => {
                const updatedBreakpoint = {
                    ...breakpoint,
                    startAt: cumulativeStartAt,
                    endAt: cumulativeStartAt + breakpoint.duration
                };
                cumulativeStartAt += breakpoint.duration;
                return updatedBreakpoint;
            });

            setNewTimer(prevTimer => ({
                ...prevTimer,
                breakPoints: updatedBreakpoints
            }));
        }

        // Update the ref with the current breakpoints
        prevBreakPointsRef.current = newTimer.breakPoints;
    }, [newTimer.breakPoints]);

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
        } else if (hours === 0 && minutes === 0 && seconds === 0) {
            return `0 sec`;
        } else {
            return `${hours} h ${minutes} min ${seconds} sec`;
        }
    };

    // ========== Navigation ========== //
    const handleBack = () => {
        // Filter out breakpoints with a duration of 0
        const savedBreakpoints = newTimer.breakPoints.filter(breakPoint => breakPoint.duration !== 0);
        navigation.navigate('Add', { savedBreakpoints });
    }


    // ========== Breakpoints ========== //
    const addNewBreakpoint = () => {
        setNewTimer(prevTimer => {
            const lastBreakpoint = prevTimer.breakPoints[prevTimer.breakPoints.length - 1];
            const startAt = lastBreakpoint ? lastBreakpoint.endAt : 0;
            const newBreakpoint = { startAt, duration: 0, endAt: startAt };

            return {
                ...prevTimer,
                breakPoints: [...prevTimer.breakPoints, newBreakpoint],
            };
        });

        calculateAndSetAvailableDuration(availableDuration);
        setEditingBreakpoint(newTimer.breakPoints.length);
    };

    const [editingBreakpoint, setEditingBreakpoint] = useState(null);
    const handleBreakpointClick = (index) => {
        if (index === editingBreakpoint) {
            setEditingBreakpoint(null);
        } else {
            setEditingBreakpoint(index);
            const selectedBreakpointDuration = newTimer.breakPoints[index].duration;

            const hour = Math.floor((selectedBreakpointDuration / (1000 * 60 * 60)) % 24);
            const minute = Math.floor((selectedBreakpointDuration / (1000 * 60)) % 60);
            const second = Math.floor((selectedBreakpointDuration / 1000) % 60);

            setDuration({ hour, minute, second });

            setSpinnerHourStartAt(Hours.findIndex(h => h === hour));
            setSpinnerMinuteStartAt(Minutes.findIndex(m => m === minute));
            setSpinnerSecondStartAt(Seconds.findIndex(s => s === second));
        }
    };
    const handleCloseModal = () => {
        setEditingBreakpoint(null);
        setDuration({
            hour: 0,
            minute: 0,
            second: 0,
        });
        if (newTimer.breakPoints.length > 0) {
            for (let i = 0; i < newTimer.breakPoints.length; i++) {
                const breakPoint = newTimer.breakPoints[i];
                if (breakPoint.duration === 0) {
                    newTimer.breakPoints.splice(i, 1);
                }
            }
        }
    }
    useEffect(() => {
        console.log('editingBreakpoint:', editingBreakpoint);
    }, [editingBreakpoint]);

    // ========== Time Picker ========== //
    const [Hours, setHours] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const [Minutes, setMinutes] = useState(Array.from({ length: 60 }, (_, index) => index));
    const [Seconds, setSeconds] = useState(Array.from({ length: 60 }, (_, index) => index));
    const [duration, setDuration] = useState({
        hour: 0,
        minute: 0,
        second: 0,
    });
    useEffect(() => {
        if (editingBreakpoint !== null) {
            const newDuration = duration.hour * 3600000 + duration.minute * 60000 + duration.second * 1000;
            const newEndAt = newTimer.breakPoints[editingBreakpoint].startAt + newDuration;

            setNewTimer(prevTimer => {
                const updatedBreakpoints = prevTimer.breakPoints.map((breakpoint, index) => {
                    if (index === editingBreakpoint) {
                        return { ...breakpoint, duration: newDuration, endAt: newEndAt };
                    }
                    return breakpoint;
                });

                return {
                    ...prevTimer,
                    breakPoints: updatedBreakpoints,
                };
            });
        }
    }, [duration, editingBreakpoint]);

    const [spinnerHourStartAt, setSpinnerHourStartAt] = useState(0);
    const [spinnerMinuteStartAt, setSpinnerMinuteStartAt] = useState(0);
    const [spinnerSecondStartAt, setSpinnerSecondStartAt] = useState(0);
    useEffect(() => {
        if (editingBreakpoint !== null) {
            console.log("setting spinner start at")
            const editingBreakPointDuration = newTimer.breakPoints[editingBreakpoint].duration;
            const newDudation = {
                hour: Math.floor((editingBreakPointDuration / (1000 * 60 * 60)) % 24),
                minute: Math.floor((editingBreakPointDuration / (1000 * 60)) % 60),
                second: Math.floor((editingBreakPointDuration / 1000) % 60),
            };
            const spinnerHourStartAt = Hours.findIndex(hour => hour === newDudation.hour);
            const spinnerMinuteStartAt = Minutes.findIndex(minute => minute === newDudation.minute);
            const spinnerSecondStartAt = Seconds.findIndex(second => second === newDudation.second);

            setSpinnerHourStartAt(spinnerHourStartAt);
            setSpinnerMinuteStartAt(spinnerMinuteStartAt);
            setSpinnerSecondStartAt(spinnerSecondStartAt);
        }
    }, [editingBreakpoint]);

    const availableDuration = useMemo(() => {
        const totalBreakpointsDuration = newTimer.breakPoints.reduce((acc, bp) => acc + bp.duration, 0);
        return newTimer.duration - totalBreakpointsDuration;
    }, [newTimer]);
    useEffect(() => {
        calculateAndSetAvailableDuration(availableDuration);
        console.log('availableDuration:', availableDuration);
    }, [availableDuration]);

    const [nowSetting, setNowSetting] = useState(null);

    const calculateAndSetAvailableDuration = (duration) => {

        console.log('nowSetting:', nowSetting);
        const totalSeconds = Math.floor(duration / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);

        const hoursArray = Array.from({ length: totalHours + 1 }, (_, index) => index);
        const minutesArray = Array.from({ length: Math.min(60, totalMinutes + 1) }, (_, index) => index);
        const secondsArray = Array.from({ length: Math.min(60, totalSeconds + 1) }, (_, index) => index);

        if (nowSetting === 'hour') {
            setMinutes(minutesArray);
            setSeconds(secondsArray);
        } else if (nowSetting === 'minute') {
            setHours(hoursArray);
            setSeconds(secondsArray);
        } else if (nowSetting === 'second') {
            setHours(hoursArray);
            setMinutes(minutesArray);
        } else {
            setHours(hoursArray);
            setMinutes(minutesArray);
            setSeconds(secondsArray);
        }
    };

    // ========== Creat ========== //
    const handleCreate = () => {
        setTimers(prevTimers => {
            const updatedTimers = [...prevTimers, newTimer];
            AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
            return updatedTimers;
        });
        navigation.navigate('Home');
    }
    useEffect(() => {
        console.log('timers:', timers);

        // Iterate over each timer in the timers array
        timers.forEach((timer, index) => {
            console.log(`Timer ${index + 1}:`, timer);

            // Check if the timer has breakPoints and iterate over them
            if (timer.breakPoints && Array.isArray(timer.breakPoints)) {
                timer.breakPoints.forEach((breakpoint, bpIndex) => {
                    console.log(`Timer ${index + 1} - Breakpoint ${bpIndex + 1}:`, JSON.stringify(breakpoint));
                });
            }
        });
    }, [timers]);


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.breakpointContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.breakpointTitleContainer}>
                    <Text style={styles.breakpointTitle}>Total {totalDuration}</Text>
                </View>

                {newTimer.breakPoints.length === 0 ? (
                    <View style={styles.breakpointBodyContainer}>
                        <TouchableOpacity
                            style={styles.AddFirstBreakpoint}
                            onPress={addNewBreakpoint}>
                            <FontAwesomeIcon icon={faPlus} size={24} color={colors.darkGray} />
                        </TouchableOpacity>
                        <View style={styles.bodyTextContainer}>
                            <Text style={{ fontSize: 20, fontWeight: '500', color: colors.Gray2, textAlign: 'center' }}>
                                Click the “+” button to Add a new Breakpoint
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.breakpointBodyContainer, { paddingBottom: 40, rowGap: 3 }]}>
                        {newTimer.breakPoints.map((breakpoint, index) => (
                            <View key={index} style={styles.breakPointObject}>
                                <View style={styles.breakPointBlockContainer}>
                                    <TouchableOpacity style={[styles.breakPointBlock, editingBreakpoint === index && { backgroundColor: colors.lightRed }]} onPress={() => handleBreakpointClick(index)}>
                                        <Text style={[styles.breakPointText, editingBreakpoint === index && { color: colors.red }]}>{formatDuration(breakpoint.duration)}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.breakPointLineContainer}>
                                    <View style={styles.breakPointIndicator}>
                                        <Text style={styles.breakPointIndicatorText}>
                                            {formatDuration(breakpoint.endAt)}
                                        </Text>
                                    </View>
                                    <View style={styles.lineContainer}>
                                        <DashedLine dashWidth={5} dashGap={5} dashColor="red" />
                                    </View>
                                </View>
                            </View>
                        ))}
                        {editingBreakpoint === null && availableDuration !== 0 && (
                            <View style={styles.breakPointBlockContainer}>
                                <TouchableOpacity
                                    style={[styles.AddFirstBreakpoint, { height: 50 }]}
                                    onPress={addNewBreakpoint}>
                                    <FontAwesomeIcon icon={faPlus} size={18} color={colors.darkGray} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomContainer}>
                {editingBreakpoint !== null && (
                    <View style={styles.editingContainer}>
                        <TouchableOpacity style={styles.downButton} onPress={handleCloseModal}>
                            <FontAwesomeIcon icon={faXmark} size={16} color={colors.black} />
                        </TouchableOpacity>
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
                                                initialSelectedIndex={spinnerHourStartAt}
                                                items={Hours.map((hour) => ({ label: `${hour}`, value: hour }))}
                                                renderItem={(props) => {
                                                    return (
                                                        <Text style={styles.timeWheelItemText}>{props.label}</Text>
                                                    );
                                                }}
                                                onChange={({ item }) => {
                                                    setNowSetting('hour');
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
                                                initialSelectedIndex={spinnerMinuteStartAt}
                                                items={Minutes.map((minute) => ({ label: `${minute}`, value: minute }))}
                                                renderItem={(props) => {
                                                    return (
                                                        <Text style={styles.timeWheelItemText}>{props.label}</Text>
                                                    );
                                                }}
                                                onChange={({ item }) => {
                                                    setNowSetting('minute');
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
                                                initialSelectedIndex={spinnerSecondStartAt}
                                                items={Seconds.map((second) => ({ label: `${second}`, value: second }))}
                                                renderItem={(props) => {
                                                    return (
                                                        <Text style={styles.timeWheelItemText}>{props.label}</Text>
                                                    );
                                                }}
                                                onChange={({ item }) => {
                                                    setNowSetting('second');
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
                    </View>
                )}
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.bottomButton} onPress={handleBack}>
                        <Text style={styles.bottomButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.black }]} onPress={handleCreate}>
                        <Text style={[styles.bottomButtonText, { color: colors.white }]}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AddBreakpoint;
