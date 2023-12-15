import { StyleSheet, Dimensions} from 'react-native';
import colors from './colors';
import fontSize from './fontSize';

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
        paddingTop:120,
        paddingBottom: 240,
        backgroundColor: colors.white,
        rowGap: 22,
    },
    breakpointTitleContainer:{
        zIndex: 1,
        position: 'absolute',
        paddingTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 30,
        top: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
    },
    breakpointTitle:{
        color: colors.Gray3,
        fontSize: fontSize.large,
        fontWeight: '600',
    },

    bodyTextContainer:{
        height: height - 480,
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingHorizontal: 50
    },

    progressCover:{
        top: 120,
        // right: 30,
        // width: width - 110,
        width: width,
        borderBottomColor: colors.red,
        borderBottomWidth: 2,
        position: 'absolute',
        zIndex: 20,
        // borderRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    breakpointBodyContainer:{
        alignItems: 'center',
        justifyContent: 'flex-start',
        rowGap: 3,
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
        height: 60,
        padding: 15,
        alignItems:'flex-start',
        justifyContent: 'center',
        backgroundColor: colors.smokeWhite,
        borderRadius: 12
    },
    breakPointText:{
        fontSize: fontSize.xlarge,
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
        minWidth: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.black,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 20,
    },
    breakPointIndicatorText:{
        color: colors.white,
        fontSize: fontSize.small,
    },

    tickPointer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 70,
    },
    tickPointerContainer:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    triangleContainer:{
        position: 'absolute',
        top: -12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    tickLineContainer:{
        rowGap: 4,
    },
    tickLine:{
        width: 2,
        height: 8,
        backgroundColor: colors.red,
    },
    
    editingContainer:{
        width: width,
        backgroundColor: colors.white,
        height: 150,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 }, 
        shadowOpacity: 0.10, 
        shadowRadius: 2,
        elevation: 3,
    },
    elapsedTimeContainer:{
        paddingLeft: 30,
        paddingTop: 15,
    },
    elapsedTimeText:{
        color: colors.darkGray,
        fontSize: fontSize.xlarge,
        fontWeight: '500',
    },
    progressLineContainer:{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingBottom: 6,
    },
    progressLineSrollArea: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        position: 'relative', 
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
        width: width,
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
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: colors.Gray1,
        borderRadius: 8,
    },
    stopButton:{
        width: 90,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: colors.Gray1,
        borderRadius: 8,
    },
    bottomButtonText:{
        color: colors.black,
        fontSize: fontSize.large,
    },
    fullScreenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    
    countdownText: {
        fontSize: fontSize.major,
        color: 'white',
    },

    progressBarContainer:{
        width: '100%',
        height: '100%',
        marginTop: 10,
        paddingBottom: 80,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    progressBar:{
        width: '100%',
        height: 10,
        backgroundColor: colors.smokeWhite,
        borderRadius: 10,
    },
    progressBarFill:{
        height: 10,
        backgroundColor: colors.red,
        borderRadius: 10,
    },
    
});

export default styles;