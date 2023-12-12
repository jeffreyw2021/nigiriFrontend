export const formatDuration = (milliseconds) => {
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