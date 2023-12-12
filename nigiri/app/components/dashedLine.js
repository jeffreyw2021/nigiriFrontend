import React, { useState } from 'react';
import { View } from 'react-native';

const DashedLine = ({ dashWidth, dashGap, dashColor }) => {
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = (event) => {
        const containerWidth = event.nativeEvent.layout.width;
        setContainerWidth(containerWidth);
    };

    const fullDashWidth = dashWidth + dashGap;
    const numberOfDashes = Math.floor(containerWidth / fullDashWidth);
    const remainingSpace = containerWidth - (fullDashWidth * numberOfDashes) + dashGap;
    const lastDashWidth = Math.min(dashWidth, remainingSpace);

    return (
        <View onLayout={onLayout} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 1 }}>
            {Array.from({ length: numberOfDashes }).map((_, index) => (
                <React.Fragment key={index}>
                    <View style={{ height: 1, width: (index === numberOfDashes - 1) ? lastDashWidth : dashWidth, backgroundColor: dashColor }} />
                    {index < numberOfDashes - 1 && <View style={{ width: dashGap }} />}
                </React.Fragment>
            ))}
        </View>
    );
};

export default DashedLine;
