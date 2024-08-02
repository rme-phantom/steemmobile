import { HStack } from '@react-native-material/core';
import * as React from 'react';
import { Avatar, Button, Dialog, Text } from 'react-native-paper';
import { getResizedAvatar } from '../../utils/ImageApis';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    title?: string;
    body?: string | React.ReactNode;
    secondaryText?: string;
    primaryText?: string;
    handleSecondaryClick?: () => void;
    handlePrimaryClick: () => void;
    hideSecondary?: boolean;
    cancelable?: boolean;
    username?: string;

}
const ConfirmationDialog = (props: Props) => {
    const { visible, setVisible, title, body, secondaryText, primaryText,
        handleSecondaryClick, handlePrimaryClick,
        hideSecondary, cancelable, username } = props;

    const hideDialog = () => setVisible(false);

    return (<Dialog dismissable={cancelable ?? true} theme={{ roundness: 2 }} visible={visible} onDismiss={hideDialog}>
        <Dialog.Title >
            <HStack spacing={4}>
                <Text variant="titleLarge">{title || 'Confirmation'}</Text>
                {username ? <Avatar.Image size={25} style={{ backgroundColor: 'white' }}
                    {...props} source={{ uri: getResizedAvatar(username) }} /> : null}
            </HStack>
        </Dialog.Title>
        <Dialog.Content>
            {typeof (body) === 'string' ?
                <Text variant="bodyMedium">{body}</Text> :
                body
            }

        </Dialog.Content>
        <Dialog.Actions>
            {hideSecondary ? null :
                <Button onPress={() => {
                    if (handleSecondaryClick)
                        handleSecondaryClick();

                    hideDialog();
                }}>{secondaryText || 'Cancel'}</Button>
            }

            <Button onPress={() => {
                handlePrimaryClick();
                hideDialog();
            }}>{primaryText || 'Done'}</Button>
        </Dialog.Actions>
    </Dialog>
    );
};

export default ConfirmationDialog;