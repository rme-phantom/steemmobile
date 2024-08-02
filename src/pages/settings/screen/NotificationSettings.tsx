import {HStack, VStack} from '@react-native-material/core';
import React, {useEffect, useMemo, useState} from 'react';
import {Button, Card, Switch, Text, TextInput} from 'react-native-paper';
import CardTextInput from '../../../components/basicComponents/CardTextInput';
import {LayoutAnimation, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../../constants/AppFunctions';
import {AppConstants} from '../../../constants/AppConstants';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {saveLoginInfo} from '../../../utils/handlers';
import moment from 'moment';
import {getAccountExt} from '../../../steem/SteemApis';

interface settingsProps {
  title: string;
  children?: React.ReactNode;
  mt?: number;
  value: boolean;
  onValueChange: (boolean) => void;
  disabled?: boolean;
}

const SettingsCard = (props: settingsProps) => (
  <Card mode="contained" style={{marginTop: props.mt ?? 0}}>
    <Card.Content style={{paddingVertical: 12, paddingHorizontal: 10}}>
      <VStack>
        <HStack justify="between" items="center">
          <Text>{props.title}</Text>
          <Switch
            disabled={props.disabled}
            color={'red'}
            value={props.value}
            onValueChange={text => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              props.onValueChange(text);
            }}
          />
        </HStack>
        {props.value ? props.children : <></>}
      </VStack>
    </Card.Content>
  </Card>
);

const SettingsInput = ({
  value,
  onChangeText,
  placeholder,
}: {
  value: string | number;
  onChangeText: (text: string) => void;
  placeholder: string;
}) => (
  <HStack items="center">
    <Text variant="labelSmall" style={{flex: 0.4}}>
      {placeholder}
    </Text>
    <CardTextInput
      cardStyle={{flex: 0.6}}
      cardMode="elevated"
      value={String(value) ?? ''}
      contentStyle={{fontSize: 12}}
      onChangeText={onChangeText}
      placeholder={placeholder}
      inputMode="numeric"
    />
  </HStack>
);

export default function NotificationSettings() {
  const loginInfo = useAppSelector(state => state.loginReducer.value);
  const queryKey = `notificationSettings_${loginInfo.name}`;
  const dispatch = useDispatch();
  const defaultData = AppConstants.DEFAULT_NOTIFICATION_SETTINGS;
  const [loading, setLoading] = useState(false);

  const {
    data: accountData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: [`userData-${loginInfo?.name}`],
    enabled: loginInfo !== undefined && loginInfo.login === true,
    queryFn: () => getAccountExt(loginInfo?.name!, 'null'),
    retry: true,
    retryDelay: 10000,
    refetchInterval: AppConstants.ACCOUNT_REFETCH_INTERVAL,
  });

  useEffect(() => {
    if (isSuccess) {
      saveLoginInfo(dispatch, {...accountData, last_fetch: moment().unix()});
    }
    if (isError) {
      AppConstants.SHOW_TOAST(
        'Failed',
        'failed to fetch settings data',
        'error',
      );
    }
  }, [isSuccess, isError]);

  const queryClient = useQueryClient();
  const [notification, setNotification] = useState(
    loginInfo?.notification?.status ?? defaultData.status,
  );
  const [showMore, setShowMore] = useState(false);
  // mention settings
  const [mention, setMention] = useState(
    loginInfo?.notification?.mention.status ?? defaultData.mention.status,
  );
  const [mentionMinRep, setMentionMinRep] = useState(
    loginInfo?.notification?.mention.minRep.toString() ??
      defaultData.mention.minRep,
  );
  const [mentionMinSp, setMentionMinSp] = useState(
    loginInfo?.notification?.mention.minSp.toString() ??
      defaultData.mention.minSp,
  );
  // follow settings
  const [follow, setFollow] = useState(
    loginInfo?.notification?.follow.status ?? defaultData.follow.status,
  );
  const [followMinRep, setFollowMinRep] = useState(
    loginInfo?.notification?.follow.minRep.toString() ??
      defaultData.follow.minRep,
  );
  const [followMinSp, setFollowMinSp] = useState(
    loginInfo?.notification?.follow.minSp.toString() ??
      defaultData.follow.minSp,
  );
  // resteem settings
  const [resteem, setResteem] = useState(
    loginInfo?.notification?.resteem.status ?? defaultData.resteem.status,
  );
  const [resteemMinRep, setResteemMinRep] = useState(
    loginInfo?.notification?.resteem.minRep.toString() ??
      defaultData.resteem.minRep,
  );
  const [resteemMinSp, setResteemMinSp] = useState(
    loginInfo?.notification?.resteem.minSp.toString() ??
      defaultData.resteem.minSp,
  );
  // vote settings
  const [vote, setVote] = useState(
    loginInfo?.notification?.vote.status ?? defaultData.vote.status,
  );
  const [voteMinRep, setVoteMinRep] = useState(
    loginInfo?.notification?.vote.minRep.toString() ?? defaultData.vote.minRep,
  );
  const [voteMinSp, setVoteMinSp] = useState(
    loginInfo?.notification?.vote.minSp.toString() ?? defaultData.vote.minSp,
  );
  const [voteMinValue, setVoteMinValie] = useState(
    loginInfo?.notification?.vote.minVote.toString() ??
      defaultData.vote.minVote,
  );
  // reply settings
  const [reply, setReply] = useState(
    loginInfo?.notification?.reply.status ?? defaultData.reply.status,
  );
  const [replyMinRep, setReplyMinRep] = useState(
    loginInfo?.notification?.reply.minRep.toString() ??
      defaultData.reply.minRep,
  );
  const [replyMinSp, setReplyMinSp] = useState(
    loginInfo?.notification?.reply.minSp.toString() ?? defaultData.reply.minSp,
  );

  const canUpdate = useMemo(
    () =>
      loginInfo.notification &&
      (notification !== loginInfo.notification?.status ||
        vote !== loginInfo.notification?.vote.status ||
        parseFloat(String(voteMinRep)) !==
          loginInfo.notification?.vote.minRep ||
        parseFloat(String(voteMinSp)) !== loginInfo.notification?.vote.minSp ||
        parseFloat(String(voteMinValue)) !==
          loginInfo.notification?.vote.minVote ||
        mention !== loginInfo.notification?.mention.status ||
        parseFloat(String(mentionMinRep)) !==
          loginInfo.notification?.mention.minRep ||
        parseFloat(String(mentionMinSp)) !==
          loginInfo.notification?.mention.minSp ||
        follow !== loginInfo.notification?.follow.status ||
        parseFloat(String(followMinRep)) !==
          loginInfo.notification?.follow.minRep ||
        parseFloat(String(followMinSp)) !==
          loginInfo.notification?.follow.minSp ||
        resteem !== loginInfo.notification?.resteem.status ||
        parseFloat(String(resteemMinRep)) !==
          loginInfo.notification?.resteem.minRep ||
        parseFloat(String(resteemMinSp)) !==
          loginInfo.notification?.resteem.minSp ||
        reply !== loginInfo.notification?.reply.status ||
        parseFloat(String(replyMinRep)) !==
          loginInfo.notification?.reply.minRep ||
        parseFloat(String(replyMinSp)) !== loginInfo.notification?.reply.minSp),
    [
      notification,
      loginInfo.notification,
      vote,
      voteMinRep,
      voteMinSp,
      voteMinValue,
      reply,
      replyMinRep,
      replyMinSp,
      follow,
      followMinRep,
      followMinSp,
      mention,
      mentionMinRep,
      mentionMinSp,
      resteem,
      resteemMinRep,
      resteemMinSp,
    ],
  );

  function newData(notiStatus: boolean) {
    return {
      status: notiStatus ?? notification,
      vote: {
        status: vote ?? defaultData.vote.status,
        minRep: Number(voteMinRep) || defaultData.vote.minRep,
        minSp: Number(voteMinSp) || defaultData.vote.minSp,
        minVote: Number(voteMinValue) || defaultData.vote.minVote,
      },
      reply: {
        status: reply ?? defaultData.reply.status,
        minRep: Number(replyMinRep) || defaultData.reply.minRep,
        minSp: Number(replyMinSp) || defaultData.reply.minSp,
      },
      follow: {
        status: follow ?? defaultData.follow.status,
        minRep: Number(followMinRep) || defaultData.follow.minRep,
        minSp: Number(followMinSp) || defaultData.follow.minSp,
      },
      mention: {
        status: mention ?? defaultData.mention.status,
        minRep: Number(mentionMinRep) || defaultData.mention.minRep,
        minSp: Number(mentionMinSp) || defaultData.mention.minSp,
      },
      resteem: {
        status: resteem ?? defaultData.resteem.status,
        minRep: Number(resteemMinRep) || defaultData.resteem.minRep,
        minSp: Number(resteemMinSp) || defaultData.resteem.minSp,
      },
    };
  }

  function handleNotificationChange(value: boolean) {
    setNotification(value);
    setLoading(true);
    firestore()
      .collection('Users')
      .doc(loginInfo.name)
      .set(
        {
          notification: {
            ...newData(value),
          },
        },
        {merge: true},
      )
      .then(() => {
        saveLoginInfo(dispatch, {...loginInfo, notification: newData(value)});
        console.log('Settings updated!');
        AppConstants.SHOW_TOAST('Updated', '', 'success');
      })
      .catch(err => {
        console.log('Error', err);
        AppConstants.SHOW_TOAST('Failed', String(err), 'error');
        setNotification(!value);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const updateSettings = () => {
    firestore()
      .collection('Users')
      .doc(loginInfo.name)
      .set(
        {
          notification: {
            ...newData(notification),
          },
        },
        {merge: true},
      )
      .then(() => {
        saveLoginInfo(dispatch, {
          ...loginInfo,
          notification: newData(notification),
        });
        console.log('Settings updated!');
        AppConstants.SHOW_TOAST('Updated', '', 'success');
        queryClient.setQueryData([queryKey], newData(notification));
      })
      .catch(err => {
        console.log('Error', err);
        AppConstants.SHOW_TOAST('Failed', String(err), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function handleOnUpdate() {
    setLoading(true);
    updateSettings();
  }

  return (
    accountData && (
      <VStack spacing={6}>
        <View>
          <SettingsCard
            title={'Notifications'}
            mt={10}
            value={loginInfo?.notification?.status ?? notification}
            disabled={loading || isLoading}
            onValueChange={handleNotificationChange}
          />
        </View>

        {loginInfo?.notification?.status ? (
          <HStack spacing={4}>
            <Button
              style={{alignSelf: 'flex-start', minWidth: 80}}
              compact
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setShowMore(!showMore);
              }}
              labelStyle={{fontSize: 12, marginVertical: 0, textAlign: 'left'}}>
              {showMore ? 'Show less ▲' : 'Show more ▼'}
            </Button>

            {canUpdate ? (
              <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={handleOnUpdate}
                compact
                labelStyle={{marginVertical: 0, fontSize: 12}}
                style={{alignSelf: 'flex-start'}}>
                Update
              </Button>
            ) : (
              <></>
            )}
          </HStack>
        ) : (
          <></>
        )}
        <View>
          {showMore && notification ? (
            <VStack>
              <SettingsCard
                title={'Vote'}
                mt={10}
                value={vote}
                onValueChange={setVote}>
                <SettingsInput
                  value={voteMinRep}
                  onChangeText={setVoteMinRep}
                  placeholder="Minimum Reputation"
                />

                <SettingsInput
                  value={voteMinSp}
                  onChangeText={setVoteMinSp}
                  placeholder="Minimum Steem Power"
                />

                <SettingsInput
                  value={voteMinValue}
                  onChangeText={setVoteMinValie}
                  placeholder="Minimum Vote Value"
                />
              </SettingsCard>

              <SettingsCard
                title={'Reply'}
                mt={10}
                value={reply}
                onValueChange={setReply}>
                <SettingsInput
                  value={replyMinRep}
                  onChangeText={setReplyMinRep}
                  placeholder="Minimum Reputation"
                />

                <SettingsInput
                  value={replyMinSp}
                  onChangeText={setReplyMinSp}
                  placeholder="Minimum Steem Power"
                />
              </SettingsCard>

              <SettingsCard
                title={'Follow'}
                mt={10}
                value={follow}
                onValueChange={setFollow}>
                <SettingsInput
                  value={followMinRep}
                  onChangeText={setFollowMinRep}
                  placeholder="Minimum Reputation"
                />

                <SettingsInput
                  value={followMinSp}
                  onChangeText={setFollowMinSp}
                  placeholder="Minimum Steem Power"
                />
              </SettingsCard>

              <SettingsCard
                title={'Mention'}
                mt={10}
                value={mention}
                onValueChange={setMention}>
                <SettingsInput
                  value={mentionMinRep}
                  onChangeText={setMentionMinRep}
                  placeholder="Minimum Reputation"
                />

                <SettingsInput
                  value={mentionMinSp}
                  onChangeText={setMentionMinSp}
                  placeholder="Minimum Steem Power"
                />
              </SettingsCard>

              <SettingsCard
                title={'Resteem'}
                mt={10}
                value={resteem}
                onValueChange={setResteem}>
                <SettingsInput
                  value={resteemMinRep}
                  onChangeText={setResteemMinRep}
                  placeholder="Minimum Reputation"
                />

                <SettingsInput
                  value={resteemMinSp}
                  onChangeText={setResteemMinSp}
                  placeholder="Minimum Steem Power"
                />
              </SettingsCard>
            </VStack>
          ) : (
            <></>
          )}
        </View>
      </VStack>
    )
  );
}
