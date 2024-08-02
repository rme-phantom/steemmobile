import {useMemo, useState} from 'react';
import {AppStrings} from '../../../constants/AppStrings';
import {VStack} from '@react-native-material/core';
import {Divider, IconButton, Menu} from 'react-native-paper';
import {Share} from 'react-native';
import {writeToClipboard} from '../../../utils/clipboard';
import {Role} from '../../../utils/community';
import EditRoleDialog from '../../basicComponents/EditRoleDialog';
import {useAppSelector} from '../../../constants/AppFunctions';

interface Props {
  navigation: any;
  route: any;
  comment: Feed | Post;
  isDetail?: boolean;
  isReply?: boolean;
  isCommunity?: boolean;
  handleTranslate?: (body: string) => void;
  handleResteem?: (item: Post | Feed) => void;
  handleCopyText?: (body: string) => void;
  isSearch?: boolean;
}

const CommentMenu = (props: Props) => {
  const {
    route,
    isDetail,
    comment,
    isReply,
    handleTranslate,
    handleResteem,
    isSearch,
    handleCopyText,
  } = props;
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [editDialog, setEditDialog] = useState(false);
  const loginInfo = useAppSelector(state => state.loginReducer.value);

  return useMemo(() => {
    const full_link =
      AppStrings.WEB_APP_URL +
      `/${comment?.category}/@${comment?.author}/${comment?.permlink}`;
    return (
      <VStack>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchorPosition="top"
          contentStyle={{
            padding: 0,
            paddingHorizontal: 4,
            paddingVertical: 4,
          }}
          anchor={
            <IconButton
              style={{alignSelf: 'flex-end'}}
              size={20}
              onPress={() => {
                openMenu();
              }}
              icon="dots-vertical"
            />
          }>
          <Menu.Item
            dense
            onPress={() => {
              Share.share({message: full_link});
              closeMenu();
            }}
            titleStyle={{fontSize: 14}}
            title={'Share'}
          />

          {(isDetail || isReply) && (
            <Menu.Item
              dense
              onPress={() => {
                handleCopyText && handleCopyText(comment?.body || '');
                closeMenu();
              }}
              titleStyle={{fontSize: 14}}
              title={'Copy Text'}
            />
          )}

          <Menu.Item
            dense
            onPress={() => {
              writeToClipboard(full_link);
              closeMenu();
            }}
            titleStyle={{fontSize: 14}}
            title={'Copy Link'}
          />

          {isDetail && Role.atLeast(comment?.observer_role, 'mod') ? (
            <Menu.Item
              dense
              onPress={() => {
                setEditDialog(true);
                closeMenu();
              }}
              titleStyle={{fontSize: 14}}
              title={'Edit Role/Title'}
            />
          ) : null}

          {(isDetail || isReply) && handleTranslate ? (
            <Menu.Item
              dense
              onPress={() => {
                handleTranslate(comment.body);
                closeMenu();
              }}
              titleStyle={{fontSize: 14}}
              title={'Translate'}
            />
          ) : null}

          {(!comment?.depth || comment.depth === 0) &&
          !isReply &&
          !isSearch &&
          handleResteem ? (
            <>
              <Divider bold />
              <Menu.Item
                dense
                onPress={() => {
                  closeMenu();

                  // check if root post
                  if (comment.title) {
                    handleResteem(comment);
                  }
                }}
                titleStyle={{fontSize: 14}}
                title={'Reblog'}
              />
            </>
          ) : null}
        </Menu>
        {editDialog ? (
          <EditRoleDialog
            {...route?.params}
            cancelable
            comment={comment as Post}
            visible={editDialog}
            setVisible={setEditDialog}
          />
        ) : null}
      </VStack>
    );
  }, [comment, visible, editDialog, loginInfo]);
};
export {CommentMenu};
