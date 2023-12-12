import { StyleSheet, Dimensions} from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        height: height,
        width: width,
        backgroundColor: colors.white,
    },
    breakpointContainer:{
        width: '100%',
        paddingHorizontal: 30,
        paddingTop:80,
        paddingBottom: 240,
        backgroundColor: colors.white,
        rowGap: 22,
    },
    breakpointTitleContainer:{
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    breakpointTitle:{
        color: colors.Gray3,
        fontSize: 20,
        fontWeight: '600',
    },

    bodyTextContainer:{
        height: height - 480,
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 50
    },

    breakpointBodyContainer:{
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    AddFirstBreakpoint:{
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.Gray1,
        borderRadius: 12,
    },
    breakPointObject:{
        width: '100%',
        justifyContent: 'flex-start',
        rowGap: 3,
    },
    breakPointBlockContainer:{
        width: '100%',
        paddingLeft: 50,
    },
    breakPointBlock:{
        padding: 12,
        alignItems:'flex-start',
        justifyContent: 'center',
        backgroundColor: colors.smokeWhite,
        borderRadius: 12
    },
    breakPointText:{
        fontSize: 20,
        fontWeight: '500',
        color: colors.black
    },
    breakPointLineContainer:{
        width: '100%',
        height: 2,
        flexDirection: 'row',
        columnGap: 6,
        paddingVertical: 1,
        paddingRight: 12,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    lineContainer:{
        flex: 1,
    },
    breakPointIndicator:{
        height: 20,
        backgroundColor: colors.red,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 20,
    },
    breakPointIndicatorText:{
        color: colors.white,
        fontSize: 12,
    },

    editingContainer:{
        width: '100%',
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 }, 
        shadowOpacity: 0.10, 
        shadowRadius: 2,
        elevation: 3,
    },
    timeSelectContainer:{
        width: 250,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        columnGap: 10,
    },
    timeSelectModule:{
        flex: 1,
        rowGap: 2,
    },
    timeSelectTiteContainer:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timePickerTitle:{
        fontSize: 14,
        fontWeight: '500',
    },
    timeSelectWheelContainer: {
        width: '100%',
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.white,
        overflow: 'hidden',
        borderRadius: 10,
    },
    timeSelectWheelContent: {
        width: 77,
        height: 60,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeWheelItemText: {
        fontSize: 30,
        fontWeight: '500',
        marginVertical: 0,
        color: colors.black,
        textAlign: 'center'
    },
    downButton:{
        position: 'absolute',
        right: 10,
        top: 10,
        height: 30,
        width: 30,
        backgroundColor: colors.Gray1,
        borderRadius: 28,
        paddingTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomContainer:{
        position: 'absolute',
        width: width,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        columnGap: 10,
        paddingHorizontal: 30,
        paddingTop: 12,
        paddingBottom: 60,
        backgroundColor: colors.white,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: -1 }, 
        shadowOpacity: 0.10, 
        shadowRadius: 2,
        elevation: 3,
    },
    bottomButton:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: colors.Gray1,
        borderRadius: 8,
    },
    bottomButtonText:{
        color: colors.black,
        fontSize: 18,
    },
});

export default styles;