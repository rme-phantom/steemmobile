import {TouchableOpacity, View} from 'react-native';
import {Card, MD2Colors, Text} from 'react-native-paper';
import TimeAgoWrapper from '../../../components/wrappers/TimeAgoWrapper';
import {HStack, VStack} from '@react-native-material/core';
import BadgeAvatar from '../../../components/basicComponents/BadgeAvatar';
import moment from 'moment';
import React from 'react';
interface NotiItemProps {
  item: Notification;
  index: number;
  navigation: any;
  handleItemClick: (item: Notification) => void;
  steemprops: SteemProps;
}

const NotiificationItem = (props: NotiItemProps) => {
  const {item, index, handleItemClick, navigation, steemprops} = props;

  const voteValue =
    (item.voted_rshares / steemprops.recent_reward_claims) *
    steemprops.total_reward_fund *
    steemprops.median_price;

  return (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <Card
        key={index ?? item.id}
        theme={{roundness: 2}}
        style={{marginBottom: 4}}
        mode="contained">
        <Card.Content style={{paddingVertical: 2, paddingHorizontal: 2}}>
          <VStack>
            <HStack spacing={10} p={4} items="center">
              <View>
                <BadgeAvatar
                  name={item.account}
                  avatarSize={35}
                  navigation={navigation}
                />
              </View>
              <VStack fill items="start">
                <Text>
                  {generateNotificationBody(item.type, item, voteValue)}
                </Text>
                <TimeAgoWrapper
                  withoutUtc={true}
                  date={moment(item.time * 1000).unix() * 1000}
                />
              </VStack>
              {!item.is_read ? (
                <View
                  style={{
                    height: 6,
                    width: 6,
                    backgroundColor: MD2Colors.red500,
                    borderRadius: 50,
                    opacity: 0.8,
                  }}></View>
              ) : null}
            </HStack>
          </VStack>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default React.memo(NotiificationItem);

const generateNotificationBody = (
  type: string,
  payload: Notification,
  voteValue: number,
): string => {
  let message = `New notification from ${payload.account}`;
  const voteAmount = voteValue
    ? ` ($${voteValue.toFixed(
        voteValue >= 0.001 && voteValue < 0.009 ? 3 : 2,
      )})`
    : '';

  switch (type) {
    case 'resteem':
      message = `${payload.account} resteemed your post`;
      break;
    case 'follow':
      message = `${payload.account} followed you`;
      break;
    case 'reply':
      if (payload.link_depth === 1)
        message = `${payload.account} replied to your post`;
      else message = `${payload.account} replied to your comment`;
      break;
    case 'mention':
      message = `${payload.account} mentioned you`;
      break;
    case 'vote':
      message = `${payload.account} voted on your post${voteAmount}`;
      break;
    default:
      return message;
  }

  return message;
};
