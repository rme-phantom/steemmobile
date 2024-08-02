import {VStack} from '@react-native-material/core';
import {Modal, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import getWindowDimensions from '../../utils/getWindowDimensions';
import MainWrapper from '../wrappers/MainWrapper';
import ModalHeader from './ModalHeader';
import {PureComponent} from 'react';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  body: string;
}
const WIDTH = getWindowDimensions().width;

class SimplePreviewModal extends PureComponent<Props> {
  render() {
    const {visible, setVisible, body} = this.props;
    const hideDialog = () => setVisible(false);
    return (
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={hideDialog}
        onDismiss={hideDialog}
        presentationStyle={'fullScreen'}>
        <MainWrapper>
          <VStack
            fill
            style={{paddingHorizontal: 20, paddingTop: 20, maxWidth: WIDTH}}>
            <ModalHeader title="Details" onClose={hideDialog} />

            <ScrollView
              style={{marginTop: 10, padding: 4}}
              contentContainerStyle={{paddingBottom: 20}}>
              <Text selectable>{body}</Text>
            </ScrollView>
          </VStack>
        </MainWrapper>
      </Modal>
    );
  }
}

export default SimplePreviewModal;
