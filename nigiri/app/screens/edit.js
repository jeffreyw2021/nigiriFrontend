import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/breakpointStyle';
import DashedLine from '../components/dashedLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import InsetShadow from 'react-native-inset-shadow';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {formatDuration} from '../helper/formatDuration';

const Edit = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();
    const route = useRoute();
    const [newTimer, setNewTimer] = useState({
        id: null,
        createdAt: Date.now(),
        title: 'Timer',
        duration: 60000,
        vibration: 'Alarm',
        breakPoints: []
    });
    const [timers, setTimers] = useState([]);
    useEffect(() => {
        const getTimers = async () => {
            try {
                const storedTimers = await AsyncStorage.getItem('timers');
                setTimers(JSON.parse(storedTimers));
            } catch (error) {
                console.error('Error accessing AsyncStorage:', error);
            }
        };
        getTimers();
    }, []);
    const routeNewTimer = route.params?.timer;
    useEffect(() => {
        console.log('routeNewTimer:', routeNewTimer);
        if (routeNewTimer) {
            const routeNewTimerBreakpoints = routeNewTimer?.breakPoints;
            const routeNewTimerDuration = routeNewTimer?.duration;
            for (let i = 0; i < routeNewTimerBreakpoints.length; i++) {
                if (routeNewTimerBreakpoints[i].startAt >= routeNewTimerDuration) {
                    routeNewTimerBreakpoints.splice(i, 1);
                } else if (routeNewTimerBreakpoints[i].endAt > routeNewTimerDuration) {
                    routeNewTimerBreakpoints[i].duration = routeNewTimerDuration - routeNewTimerBreakpoints[i].startAt;
                    routeNewTimerBreakpoints[i].endAt = routeNewTimerDuration;
                }
            }
            console.log('routeNewTimerBreakpoints:', routeNewTimerBreakpoints);
            setNewTimer(routeNewTimer);
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

    // ========== Navigation ========== //
    const handleBack = () => {
        handleCloseModal();
        const savedBreakpoints = newTimer.breakPoints.filter(breakPoint => breakPoint.duration !== 0);
        const timer = {
            ...newTimer,
            breakPoints: savedBreakpoints.map(bp => ({
                ...bp,
                endAt: bp.startAt + bp.duration
            }))
        };
        navigation.navigate('EditInfo', { timer });
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
        setEditingBreakpoint(newTimer.breakPoints.length);
    };
    const handleCloseModal = () => {
        setOverflowBreakPoint(null);
        const currentEditingBreakpointDuration = duration.hour * 3600000 + duration.minute * 60000 + duration.second * 1000;
        const otherBreakPointDuration = newTimer.breakPoints.reduce((acc, breakPoint, index) => {
            if (index !== editingBreakpoint) {
                return acc + breakPoint.duration;
            }
            return acc;
        }, 0);
        const totalEditedDuration = currentEditingBreakpointDuration + otherBreakPointDuration;

        if (totalEditedDuration > newTimer.duration) {
            const remainingDuration = newTimer.duration - otherBreakPointDuration;
            newTimer.breakPoints[editingBreakpoint].duration = remainingDuration;
            finalizeEditing();
        } else {
            finalizeEditing();
        }
    };

    const finalizeEditing = () => {
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
    const Hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const Minutes = Array.from({ length: 60 }, (_, index) => index);
    const Seconds = Array.from({ length: 60 }, (_, index) => index);
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
    const [editingBreakpoint, setEditingBreakpoint] = useState(null);
    const handleBreakpointClick = (index) => {
        const newTimerBreakpoints = newTimer.breakPoints;
        newTimerBreakpoints.filter(breakpoint => breakpoint.duration !== 0);
        setNewTimer(prevTimer => ({
            ...prevTimer,
            breakPoints: newTimerBreakpoints
        }));
        setEditingBreakpoint(index === editingBreakpoint ? null : index);
    };
    useEffect(() => {
        if (editingBreakpoint !== null) {
            console.log("setting spinner start at")
            const editingBreakPointDuration = newTimer.breakPoints[editingBreakpoint].duration;

            const hour = Math.floor((editingBreakPointDuration / (1000 * 60 * 60)) % 24);
            const minute = Math.floor((editingBreakPointDuration / (1000 * 60)) % 60);
            const second = Math.floor((editingBreakPointDuration / 1000) % 60);

            console.log("newDuration", { hour, minute, second })
            const spinnerHourStartAt = Hours.findIndex(h => h === hour);
            const spinnerMinuteStartAt = Minutes.findIndex(m => m === minute);
            const spinnerSecondStartAt = Seconds.findIndex(s => s === second);

            console.log("setting spinner hour start at", spinnerHourStartAt)
            setSpinnerHourStartAt(spinnerHourStartAt);
            console.log("setting spinner minute start at", spinnerMinuteStartAt)
            setSpinnerMinuteStartAt(spinnerMinuteStartAt);
            console.log("setting spinner second start at", spinnerSecondStartAt)
            setSpinnerSecondStartAt(spinnerSecondStartAt);
        }
    }, [editingBreakpoint]);

    useEffect(() => {
        // Create a copy of the breakpoints
        const updatedBreakPoints = newTimer.breakPoints.map(bp => {
            const expectedEndAt = bp.startAt + bp.duration;
            // Check if endAt needs to be updated
            if (bp.endAt !== expectedEndAt) {
                return { ...bp, endAt: expectedEndAt };
            }
            return bp;
        });
        // Check if any breakpoints were updated
        const isAnyBreakPointUpdated = !newTimer.breakPoints.every((bp, index) => bp.endAt === updatedBreakPoints[index].endAt);
        if (isAnyBreakPointUpdated) {
            setNewTimer({ ...newTimer, breakPoints: updatedBreakPoints });
        }
    }, [JSON.stringify(newTimer.breakPoints.map(bp => bp.duration))]);

    const availableDuration = useMemo(() => {
        const totalBreakpointsDuration = newTimer.breakPoints.reduce((acc, bp) => acc + bp.duration, 0);
        return newTimer.duration - totalBreakpointsDuration;
    }, [newTimer]);

    let changeTimeoutIds = {
        hour: null,
        minute: null,
        second: null
    };

    const onTimerChange = (item, changing) => {
        if (changeTimeoutIds[changing]) {
            clearTimeout(changeTimeoutIds[changing]);
        }

        changeTimeoutIds[changing] = setTimeout(() => {
            setDuration(prevDuration => ({
                ...prevDuration,
                [changing]: item.value
            }));
        }, 200);
    };

    // ========== Create ========== //
    const handleCreate = () => {
        Alert.alert(
            "Confirm Changes",
            "Are you sure you want to apply these edits?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Creation cancelled"),
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: () => createTimer()
                }
            ],
            { cancelable: false }
        );
    };

    const createTimer = () => {
        handleCloseModal();  // Ensure any modal is closed before proceeding

        // Filter out breakpoints with a duration of 0 and correct their endAt times
        const savedBreakpoints = newTimer.breakPoints.filter(breakPoint => breakPoint.duration !== 0)
            .map(bp => ({
                ...bp,
                endAt: bp.startAt + bp.duration
            }));

        const formattedTitle = formatDuration(newTimer.duration);
        const timerTitle = newTimer.title;

        const timer = {
            ...newTimer,
            title: isTitleInDurationFormat(timerTitle) ? formattedTitle : timerTitle,
            breakPoints: savedBreakpoints
        };

        const timerIndex = timers.findIndex(t => t.id === timer.id);
        const updatedTimers = [...timers];
        if (timerIndex !== -1) {
            updatedTimers[timerIndex] = timer;
        } else {
            updatedTimers.push(timer);
        }

        setTimers(updatedTimers);
        AsyncStorage.setItem('timers', JSON.stringify(updatedTimers))
            .then(() => console.log('Timers updated in AsyncStorage'))
            .catch(error => console.error('Error updating AsyncStorage:', error));
        navigation.navigate('Home');
    };


    const [overflowBreakPoint, setOverflowBreakPoint] = useState(null);
    useEffect(() => {
        if (editingBreakpoint !== null) {
            const currentEditingBreakpointDuration = duration.hour * 3600000 + duration.minute * 60000 + duration.second * 1000;
            const otherBreakPointDuration = newTimer.breakPoints.reduce((acc, breakPoint, index) => {
                if (index !== editingBreakpoint) {
                    return acc + breakPoint.duration;
                }
                return acc;
            }, 0);
            const totalEditedDuration = currentEditingBreakpointDuration + otherBreakPointDuration;
            if (totalEditedDuration > newTimer.duration) {
                setOverflowBreakPoint(editingBreakpoint);
            } else {
                setOverflowBreakPoint(null);
            }
        }
    }, [editingBreakpoint, duration]);

    const blockHeightThreshold = 300000;
    const blockHeightRatio = 5000;

    const deleteBreakpoint = (index) => {
        setNewTimer(prevTimer => {
            const updatedBreakpoints = [...prevTimer.breakPoints];
            updatedBreakpoints.splice(index, 1);
    
            // Recalculate the startAt and endAt for subsequent breakpoints
            let cumulativeStartAt = 0;
            for (let i = 0; i < updatedBreakpoints.length; i++) {
                updatedBreakpoints[i].startAt = cumulativeStartAt;
                updatedBreakpoints[i].endAt = cumulativeStartAt + updatedBreakpoints[i].duration;
                cumulativeStartAt += updatedBreakpoints[i].duration;
            }
    
            return { ...prevTimer, breakPoints: updatedBreakpoints };
        });
    
        // Reset all Swipeable positions
        swipeableRefs.current.forEach(ref => {
            if (ref) ref.close();
        });
    };    
    const swipeableRefs = useRef([]);
    const renderRightActions = (progress, dragX, breakpointIndex) => {
        return (
            <TouchableOpacity
                style={styles.swipeableRight}
                onPress={() => deleteBreakpoint(breakpointIndex)}
            >
                <FontAwesomeIcon icon={faTrash} size={16} color={colors.white} />
            </TouchableOpacity>
        );
    };

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
                                Click the “+” button to Add a new Interval
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.breakpointBodyContainer, { paddingBottom: 40, rowGap: 3 }]}>
                        {newTimer.breakPoints.map((breakpoint, index) => (
                            <View key={index} style={[styles.breakPointObject, { zIndex: newTimer.breakPoints.length - index }]}>
                                <View style={styles.breakPointBlockContainer}>
                                    <View style={{ width: '100%', overflow: 'hidden', borderRadius: 12, backgroundColor: colors.red }} key={breakpoint.id}>
                                        <Swipeable
                                            key={index}
                                            ref={ref => swipeableRefs.current[index] = ref}
                                            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, index)}
                                            style={styles.swipeable}
                                        >
                                            <TouchableOpacity
                                                style={[
                                                    styles.breakPointBlock,
                                                    editingBreakpoint === index && (overflowBreakPoint === index ? { backgroundColor: colors.lightRed } : { backgroundColor: colors.Gray2 }),
                                                    { height: breakpoint.duration > blockHeightThreshold ? breakpoint.duration / blockHeightRatio : 60 },
                                                    { justifyContent: breakpoint.duration > blockHeightThreshold ? 'flex-start' : 'center' }
                                                ]}
                                                onPress={() => handleBreakpointClick(index)}
                                                activeOpacity={1}
                                            >
                                                <Text style={[styles.breakPointText, overflowBreakPoint === index && { color: colors.red }]}>{formatDuration(breakpoint.duration)}</Text>
                                            </TouchableOpacity>
                                        </Swipeable>
                                    </View>
                                </View>
                                <View style={styles.breakPointLineContainer}>
                                    <View style={[styles.breakPointIndicator, overflowBreakPoint === index ? { backgroundColor: colors.red } : { backgroundColor: colors.black }]}>
                                        {((breakpoint.endAt >= newTimer.duration)
                                            && (index === newTimer.breakPoints.length - 1)
                                            && (breakpoint.startAt !== newTimer.duration)) ?
                                            (
                                                <Text style={styles.breakPointIndicatorText}>
                                                    End
                                                </Text>
                                            ) : (
                                                <Text style={styles.breakPointIndicatorText}>
                                                    {formatDuration(breakpoint.endAt)}
                                                </Text>
                                            )
                                        }
                                    </View>
                                    <View style={styles.lineContainer}>
                                        <DashedLine dashWidth={5} dashGap={5} dashColor={overflowBreakPoint === index ? colors.red : colors.black} />
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
                                                onChange={({ item }) => onTimerChange(item, 'hour')}
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
                                                onChange={({ item }) => onTimerChange(item, 'minute')}
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
                                                onChange={({ item }) => onTimerChange(item, 'second')}
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
                        <Text style={[styles.bottomButtonText, { color: colors.white }]}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Edit;
