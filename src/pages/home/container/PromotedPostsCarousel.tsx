import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import getWindowDimensions from '../../../utils/getWindowDimensions';
import {useQuery} from '@tanstack/react-query';
import {getPromotedPosts} from '../../../steem/SteemApis';
import {useAppSelector} from '../../../constants/AppFunctions';
import {TouchableOpacity, View} from 'react-native';
import {HStack, VStack} from '@react-native-material/core';
import {Card, Text} from 'react-native-paper';
import {AppRoutes} from '../../../constants/AppRoutes';
import {hasNsfwTag} from '../../../utils/StateFunctions';
import {getPostThumbnail} from '../../../utils/ImageApis';
import BadgeAvatar from '../../../components/basicComponents/BadgeAvatar';
import Orientation from 'react-native-orientation-locker';

const PAGE_WIDTH = getWindowDimensions().nativeWidth;

const CardItem = ({comment, navigation}: {comment: Feed; navigation: any}) => {
  const statePost: Feed | Post =
    useAppSelector(state => state.postReducer.values)[
      `${comment.author}/${comment.permlink}`
    ] ?? comment;

  const isNsfw = hasNsfwTag(statePost ?? '');
  const settings = useAppSelector(state => state.settingsReducer.value);
  const thumbnail = getPostThumbnail(statePost.json_images);

  const handlePostClick = () => {
    navigation.push(AppRoutes.PAGES.CommentDetailPage, {
      comment: statePost,
    });
  };

  return (
    <Card
      mode="contained"
      style={{
        opacity: isNsfw ? (settings?.nsfw === '1' ? 1 : 0.7) : 1,
        flex: 1,
        flexDirection: 'row',
      }}
      theme={{roundness: 2}}>
      <TouchableOpacity
        onPress={handlePostClick}
        style={{
          opacity: statePost?.is_muted ? 0.3 : 1,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <HStack spacing={10} pl={4} items="center">
          <View>
            <BadgeAvatar
              name={comment.author}
              reputation={comment.author_reputation}
              navigation={navigation}
            />
          </View>
          <Text variant="labelSmall" style={{flex: 1, flexWrap: 'wrap'}}>
            {statePost?.title}
          </Text>

          <HStack>
            {thumbnail ? (
              <Card.Cover
                blurRadius={isNsfw ? (settings?.nsfw === '1' ? 0 : 15) : 0}
                style={{
                  width: 100,
                  height: '100%',
                  resizeMode: 'cover',
                  backgroundColor: 'transparent',
                }}
                theme={{roundness: 2}}
                source={{uri: thumbnail}}
              />
            ) : null}
          </HStack>
        </HStack>
      </TouchableOpacity>
      {/* <Card.Content style={{
                paddingHorizontal: 0,
                paddingStart: 10, height: PAGE_WIDTH * 0.15, justifyContent: 'center'
            }}>

            </Card.Content> */}
    </Card>
  );
};

function PromotedPostsCarousel({navigation, route}) {
  const loginInfo = useAppSelector(State => State.loginReducer.value);
  var initial = Orientation.getInitialOrientation();

  const {data} = useQuery({
    queryKey: ['promoted-posts'],
    refetchInterval: 600000, //10 minuntes
    retry: 5,
    queryFn: () => getPromotedPosts(loginInfo.name ?? 'null'),
  });

  return data ? (
    <Carousel
      vertical={false}
      width={PAGE_WIDTH}
      height={initial === 'PORTRAIT' ? PAGE_WIDTH * 0.16 : PAGE_WIDTH * 0.11}
      style={{width: PAGE_WIDTH, marginTop: 4}}
      loop
      pagingEnabled={true}
      snapEnabled={true}
      autoPlay={true}
      autoPlayInterval={3000}
      scrollAnimationDuration={1500}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,
        parallaxAdjacentItemScale: 0.8,
      }}
      data={data}
      // keyExtractor={(item) => item.permlink}
      renderItem={({item, index}) => (
        <CardItem
          comment={item}
          key={index ?? item.permlink}
          navigation={navigation}
        />
      )}
    />
  ) : null;
}

export default React.memo(PromotedPostsCarousel);
