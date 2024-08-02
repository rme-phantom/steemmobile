import {HStack} from '@react-native-material/core';
import {LayoutAnimation, View} from 'react-native';
import {Button, Card, IconButton, MD2Colors, Text} from 'react-native-paper';
import BadgeAvatar from '../../../components/basicComponents/BadgeAvatar';
import {AppConstants} from '../../../constants/AppConstants';
import {
  addNewCredential,
  getCredentials,
  removeCredential,
  storeCredentials,
} from '../../../utils/realm';
import {getAccountExt} from '../../../steem/SteemApis';
import {useState} from 'react';
import ConfirmationModal from '../../../components/basicComponents/ConfirmationModal';
import {Icons} from '../../../components/Icons';
import {useAppSelector} from '../../../constants/AppFunctions';
import auth from '@react-native-firebase/auth';
import {pushFcmToken} from '../../../services/NotificationService';
import firestore from '@react-native-firebase/firestore';

interface Props {
  item: any;
  navigation?: any;
  onRemoved: (name: string) => void;
  onSwitchSuccess: (data: AccountExt) => void;
}

type UserAcc = {username: string; password: string};

const AccountItem = (props: Props) => {
  const {navigation, item, onRemoved, onSwitchSuccess} = props;
  const [dialog, setDialog] = useState(false);
  const name = Object.keys(item)[0];
  const password = item?.[name]?.password;
  const [switching, setSwitching] = useState(false);
  const loginInfo = useAppSelector(state => state.loginReducer.value);
  function rollbackSwitch(newAcc: UserAcc, prevAcc: UserAcc, e?: any) {
    removeCredential(newAcc.username);
    storeCredentials(prevAcc.username, prevAcc.password, '');
    onFailed(e);
  }

  async function handleAccountSwitch(prevAcc: UserAcc, newAcc: UserAcc) {
    const [isPrevAccRemoved, isNewAccAdded] = await Promise.all([
      removeCredential(prevAcc.username),
      storeCredentials(newAcc.username, newAcc.password, ''),
    ]);

    if (isPrevAccRemoved && isNewAccAdded) {
      const isAddedToList = await addNewCredential(
        prevAcc.username,
        prevAcc.password,
      );
      if (isAddedToList) {
        const newAccData = await getAccountExt(newAcc.username);
        if (newAccData) {
          try {
            try {
              await handleFirebaseToken(prevAcc, newAcc);
              onSwitchSuccess(newAccData);
            } catch (e) {
              rollbackSwitch(newAcc, prevAcc, e);
            }
          } catch (e) {
            rollbackSwitch(newAcc, prevAcc, e);
          }
        }
      } else {
        rollbackSwitch(newAcc, prevAcc);
      }
    } else {
      // failed to add new account, but prevAccount removed, so rollback it.
      if (!isNewAccAdded) {
        await storeCredentials(prevAcc.username, prevAcc.password, '');
      }
      onFailed();
    }
  }

  async function handleFirebaseToken(prevAcc: UserAcc, newAcc: UserAcc) {
    if (auth().currentUser?.uid) {
      firestore()
        .collection('Users')
        .doc(prevAcc.username)
        .update({fcmToken: ''})
        .then(() => {
          auth()
            .signOut()
            .then(() => {
              auth()
                .signInAnonymously()
                .then(() => {
                  pushFcmToken(newAcc.username);
                });
            })
            .catch(() => {
              pushFcmToken(prevAcc.username);
            });
        });
    }
  }

  const handleOnSwitch = async (username: string, password: string) => {
    setSwitching(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    const credentials = await getCredentials();
    if (credentials) {
      handleAccountSwitch(credentials, {username, password});
    } else {
      AppConstants.SHOW_TOAST('Failed', 'Invalid credentials', 'error');
    }
  };

  const handleOnRemove = () => {
    removeCredential(name);
    onRemoved(name);
  };

  async function switchAccount(username, password, credentials) {
    try {
      const accountData = await getAccountExt(username);
      const isDefaultSet = await storeCredentials(username, password, '');

      if (isDefaultSet && credentials) {
        const isAdded = await addNewCredential(
          credentials.username,
          credentials.password,
        );

        if (isAdded) {
          const isRemoved = await removeCredential(username);

          if (isRemoved) {
          } else {
            onFailed();
          }
        } else {
          onFailed();
          storeCredentials(credentials.username, credentials.password, '');
        }
      } else {
        onFailed();
      }
    } catch (e) {
      onFailed(e);
    }
  }

  const onFailed = (error?) => {
    setSwitching(false);
    AppConstants.SHOW_TOAST('Failed', String(error) ?? '', 'error');
  };

  return (
    <View>
      <Card mode="contained" style={{marginBottom: 4}}>
        <Card.Content style={{paddingVertical: 6, paddingHorizontal: 6}}>
          <HStack items="center" spacing={10}>
            <View>
              <BadgeAvatar name={name} navigation={navigation} />
            </View>

            <Text style={{flex: 1}}>{name}</Text>

            <HStack spacing={10} pe={6} items="center">
              <IconButton
                onPress={() => {
                  setDialog(true);
                }}
                icon={() => (
                  <Icons.MaterialCommunityIcons
                    name="close"
                    color={MD2Colors.red400}
                    size={20}
                  />
                )}
                size={18}
                mode="contained-tonal"
                iconColor={MD2Colors.red400}
              />
              <Button
                mode="contained"
                loading={switching}
                disabled={switching}
                onPress={() => handleOnSwitch(name, password)}
                compact
                labelStyle={{
                  marginHorizontal: 8,
                  marginVertical: 2,
                  fontSize: 14,
                }}>
                Switch
              </Button>
            </HStack>
          </HStack>
        </Card.Content>
      </Card>

      {dialog ? (
        <ConfirmationModal
          cancelable={false}
          title={'Confirmation'}
          visible={dialog}
          body={`Do you really want to remove ${name}?`}
          setVisible={setDialog}
          handlePrimaryClick={() => {
            handleOnRemove();
          }}
          primaryText="Remove"
        />
      ) : null}
    </View>
  );
};

export {AccountItem};
