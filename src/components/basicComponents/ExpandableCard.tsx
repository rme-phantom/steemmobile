import React, { useState } from 'react';
import {
    LayoutAnimation,
    ViewStyle
} from 'react-native';
import { Card } from 'react-native-paper';



interface Props {
    children: React.ReactNode;
    rowStyle?: ViewStyle;
    expandedChildren: React.ReactNode;
    expanded?: boolean;
}


export default function ExpandableCard(props: Props) {
    const [active, setActive] = useState(null);
    return (<ExpandItem active={active}
        setActive={setActive} {...props} />

    );
}

function ExpandItem(props: Props & { active, setActive }) {
    const { children, expandedChildren, rowStyle, active, setActive, expanded } = props;
    const open = expanded ?? active;

    const onPress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActive(!active);

    };

    return (
        <Card onPress={onPress} disabled={expanded} style={rowStyle} mode="contained">
            {children}
            {open && <Card.Content
                style={{
                    paddingHorizontal: 10,
                }}>
                {expandedChildren}
            </Card.Content>}
        </Card>
    );
}
