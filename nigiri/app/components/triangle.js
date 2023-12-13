import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Triangle = ({ fill = 'black', size = 100, borderRadius = 5, topWidth = 20 }) => {
    const halfTopWidth = (topWidth / 2) * (100 / size);
    const leftPoint = 50 - halfTopWidth;
    const rightPoint = 50 + halfTopWidth;
    const bottomVertexY = 100 - (50 * topWidth / 100);

    // Simple rounded corners (not perfect, but a start)
    const pathData = `
        M ${leftPoint + borderRadius},30
        L ${rightPoint - borderRadius},30
        Q ${rightPoint},30 ${rightPoint},30
        L 50,${bottomVertexY}
        L ${leftPoint},30
        Q ${leftPoint},30 ${leftPoint + borderRadius},30
        Z
    `;

    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            <Path d={pathData} fill={fill} />
        </Svg>
    );
};

export default Triangle;
