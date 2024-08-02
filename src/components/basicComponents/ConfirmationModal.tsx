import * as React from 'react';
import { Modal } from 'react-native';
import { Button, Dialog, Text } from 'react-native-paper';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    title?: string;
    body?: string | React.ReactNode;
    secondaryText?: string;
    primaryText?: string;
    handleSecondaryClick?: () => void;
    handlePrimaryClick: () => void;
    cancelable?: boolean;
    hideSecondary?: boolean;

}
const ConfirmationModal = (props: Props) => {
    const { visible, setVisible, title, body, secondaryText, primaryText,
        handleSecondaryClick, handlePrimaryClick: handleDoneClick, cancelable, hideSecondary } = props;

    const hideDialog = () => setVisible(false);

    return (<Modal
        animationType="fade"
        visible={visible}
        transparent
        onRequestClose={cancelable ? hideDialog : undefined}
        onDismiss={hideDialog}
    >
        <Dialog theme={{ roundness: 2 }} visible={visible}
            dismissable={cancelable ?? true} onDismiss={hideDialog}>
            <Dialog.Title >
                <Text variant="titleLarge">{title || 'Confirmation'}</Text>
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

                <Button onPress={() => { handleDoneClick(); hideDialog(); }}>{primaryText || 'Done'}</Button>
            </Dialog.Actions>
        </Dialog>
    </Modal>
    );
};

export default ConfirmationModal;