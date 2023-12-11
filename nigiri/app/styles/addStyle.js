import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    addContainer:{
        flex: 1, 
        paddingHorizontal: 30, 
        paddingTop: 80, 
        backgroundColor: colors.white,
        rowGap: 30,
    },
    operationContainer:{
        justifyContent:'flex-start',
        rowGap: 20
    },
    timePickerTitle: {
        color: colors.black,
        fontSize: 20,
        fontWeight: '500',
    },
    timeSelectContainer:{
        width: '100%', 
        columnGap: 10, 
        flexDirection: 'row', 
        justifyContent: 'center',
        marginVertical: 10
    },
    timeSelectModule: {
        flex: 1,
        alignItems: 'center',
        rowGap: 5
    },
    timeSelectTiteContainer: {
        width: '100%',
        alignItems: 'center'
    },
    timeSelectWheelContainer: {
        width: '100%',
        height: 80,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.white,
        overflow: 'hidden',
        borderRadius: 10,
    },
    timeSelectWheelContent: {
        width: 100,
        height: 80,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    timeWheelItemText: {
        fontSize: 33,
        fontWeight: '500',
        marginVertical: -40,
        color: colors.black,
        textAlign: 'center'
    },
    inputContainer:{
        width: '100%',
        backgroundColor: colors.smokeWhite,
        borderRadius: 12,
    },
    inputRow:{
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 40,
    },
    inputTitle:{
        fontSize: 18,
        color: colors.black,
    },
    titleInputField:{
        flex: 1,
        fontSize: 18,
        color: colors.black,
        textAlign: 'right',
    },
    buttonContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        columnGap: 8,
    },
    button:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.Gray1,
        paddingHorizontal: 33,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText:{
        fontSize: 18,
        color: colors.black,
    },
});
export default styles;