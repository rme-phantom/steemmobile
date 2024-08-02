import {VStack} from '@react-native-material/core';
import {Modal, ScrollView} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {PostHtmlRenderer} from '../../pages/comment/renderer/PostHtmlRenderer';
import {renderPostBody} from '../../utils/e-render/src';
import getWindowDimensions from '../../utils/getWindowDimensions';
import MainWrapper from '../wrappers/MainWrapper';
import ModalHeader from './ModalHeader';
import {PureComponent} from 'react';
import TagsFlatList from './TagsFlatList';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setClear?: boolean;
  title: string;
  body: string;
  tags: string[];
}
const WIDTH = getWindowDimensions().width;

class PreviewModal extends PureComponent<Props> {
  render() {
    const {visible, setVisible, setClear, title, body, tags} = this.props;
    const hideDialog = () => setVisible(false);
    return (
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={hideDialog}
        onDismiss={hideDialog}
        presentationStyle={'fullScreen'}>
        <MainWrapper>
          <VStack fill style={{paddingHorizontal: 20, paddingTop: 20}}>
            <ModalHeader title="Preview" onClose={hideDialog} />

            {title && (
              <Text style={{marginTop: 20}} variant="titleLarge">
                {title}
              </Text>
            )}

            {tags?.length >= 1 && <TagsFlatList tags={tags} isStatic />}

            <ScrollView
              style={{marginTop: 10, padding: 4}}
              contentContainerStyle={{paddingBottom: 20}}>
              <PostHtmlRenderer
                body={renderPostBody(body || '', true, false)}
                contentWidth={WIDTH - 45}
                setSelectedImage={() => {}}
                setSelectedLink={() => {}}
                handleOnPostPress={() => {}}
                handleOnUserPress={() => {}}
                handleTagPress={() => {}}
                handleVideoPress={() => {}}
                handleYoutubePress={() => {}}
                textSelectable={true}
                metadata={''}
              />
            </ScrollView>
          </VStack>
        </MainWrapper>
      </Modal>
    );
  }
}

export default PreviewModal;
