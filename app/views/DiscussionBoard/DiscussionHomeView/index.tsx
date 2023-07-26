import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Q } from '@nozbe/watermelondb';

import database from '../../../lib/database';
import * as HeaderButton from '../../../containers/HeaderButton';
import { SortBy, themes } from '../../../lib/constants';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import DiscussionBoardCard from '../Components/DiscussionCardBoard';
import DiscussionPostCard from '../Components/DiscussionPostCard';
import Header from '../Components/Header';
import { DiscussionTabs } from './interaces';
import styles from './styles';
import { discussionBoardData, posts } from '../data';
import { getUserSelector } from '../../../selectors/login';
import { getRoomAvatar, isGroupChat } from '../../../lib/methods/helpers';

// const INITIAL_NUM_TO_RENDER = isTablet ? 20 : 12;
const CHATS_HEADER = 'Chats';
const UNREAD_HEADER = 'Unread';
const FAVORITES_HEADER = 'Favorites';
const DISCUSSIONS_HEADER = 'Discussions';
const TEAMS_HEADER = 'Teams';
const CHANNELS_HEADER = 'Channels';
const DM_HEADER = 'Direct_Messages';
const OMNICHANNEL_HEADER_IN_PROGRESS = 'Open_Livechats';
const OMNICHANNEL_HEADER_ON_HOLD = 'On_hold_Livechats';
const QUERY_SIZE = 20;

const DiscussionHomeView: React.FC = ({ route }) => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { sortBy, showUnread, showFavorites, groupByType } = useSelector((state: IApplicationState) => state.sortPreferences);
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const useRealName = useSelector((state: IApplicationState) => state.settings.UI_Use_Real_Name);

	const [selectedTab, setSelectedTab] = useState(DiscussionTabs.DISCUSSION_BOARDS);
	const [loading, setLoading] = useState(true);
	const [searchCount, setSearchCount] = useState(0);
	const [boards, setBoards] = useState([]);
	const { theme } = useTheme();

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<View style={{ marginLeft: 8 }}>
						<HeaderButton.Drawer navigation={navigation} testID='display-view-drawer' color={themes[theme].superGray} />
					</View>
				),
				headerRight: () => (
					<View style={{ marginRight: 8 }}>
						<HeaderButton.Container>
							<HeaderButton.Item
								iconName='search'
								color={themes[theme].superGray}
								onPress={() => navigation.navigate('DiscussionSearchView')}
							/>
						</HeaderButton.Container>
					</View>
				)
			});
		}
	});

	useEffect(() => {
		const getSubscriptions = async () => {
			const db = database.active;
			const isGrouping = showUnread || showFavorites || groupByType;
			let observable;

			const defaultWhereClause = [Q.where('archived', false), Q.where('open', true)];

			if (sortBy === SortBy.Alphabetical) {
				defaultWhereClause.push(Q.experimentalSortBy(`${useRealName ? 'fname' : 'name'}`, Q.asc));
			} else {
				defaultWhereClause.push(Q.experimentalSortBy('room_updated_at', Q.desc));
			}

			// When we're grouping by something
			if (isGrouping) {
				observable = await db
					.get('subscriptions')
					.query(...defaultWhereClause)
					.observeWithColumns(['alert', 'on_hold']);
				// When we're NOT grouping
			} else {
				setSearchCount(searchCount + QUERY_SIZE);
				observable = await db
					.get('subscriptions')
					.query(...defaultWhereClause, Q.experimentalSkip(0), Q.experimentalTake(searchCount))
					.observeWithColumns(['on_hold']);
			}

			observable.subscribe(data => {
				console.log('data', data);
				const formattedData = data.map(d => {
					return {
						...d,
						title: d.fname,
						description: d.topic,
						// icon: 'exercising',
						color: 'dreamBlue',
						avatar: getRoomAvatar(d),
						saved: d.f,
						isGroupChat: isGroupChat(d)
					};
				});

				console.log('data formatted', formattedData);

				// 		title: 'Exercising',
				// description: 'description here',
				// icon: 'exercising',
				// color: 'dreamBlue',
				// saved: true
				setBoards(formattedData);
				// let tempChats = [];
				// let chats = data;
			});

			// const querySubscription = observable.subscribe(data => {
			// 	console.log('data', data);
			// 	let tempChats = [];
			// 	let chats = data;

			// 	let omnichannelsUpdate = [];
			// 	const isOmnichannelAgent = user?.roles?.includes('livechat-agent');
			// 	if (isOmnichannelAgent) {
			// 		const omnichannel = chats.filter(s => filterIsOmnichannel(s));
			// 		const omnichannelInProgress = omnichannel.filter(s => !s.onHold);
			// 		const omnichannelOnHold = omnichannel.filter(s => s.onHold);
			// 		chats = chats.filter(s => !filterIsOmnichannel(s));
			// 		omnichannelsUpdate = omnichannelInProgress.map(s => s.rid);
			// 		tempChats = this.addRoomsGroup(omnichannelInProgress, OMNICHANNEL_HEADER_IN_PROGRESS, tempChats);
			// 		tempChats = this.addRoomsGroup(omnichannelOnHold, OMNICHANNEL_HEADER_ON_HOLD, tempChats);
			// 	}

			// 	// unread
			// 	if (showUnread) {
			// 		const unread = chats.filter(s => filterIsUnread(s));
			// 		chats = chats.filter(s => !filterIsUnread(s));
			// 		tempChats = this.addRoomsGroup(unread, UNREAD_HEADER, tempChats);
			// 	}

			// 	// favorites
			// 	if (showFavorites) {
			// 		const favorites = chats.filter(s => filterIsFavorite(s));
			// 		chats = chats.filter(s => !filterIsFavorite(s));
			// 		tempChats = this.addRoomsGroup(favorites, FAVORITES_HEADER, tempChats);
			// 	}

			// 	// type
			// 	if (groupByType) {
			// 		const teams = chats.filter(s => filterIsTeam(s));
			// 		const discussions = chats.filter(s => filterIsDiscussion(s));
			// 		const channels = chats.filter(s => (s.t === 'c' || s.t === 'p') && !filterIsDiscussion(s) && !filterIsTeam(s));
			// 		const direct = chats.filter(s => s.t === 'd' && !filterIsDiscussion(s) && !filterIsTeam(s));
			// 		tempChats = this.addRoomsGroup(teams, TEAMS_HEADER, tempChats);
			// 		tempChats = this.addRoomsGroup(discussions, DISCUSSIONS_HEADER, tempChats);
			// 		tempChats = this.addRoomsGroup(channels, CHANNELS_HEADER, tempChats);
			// 		tempChats = this.addRoomsGroup(direct, DM_HEADER, tempChats);
			// 	} else if (showUnread || showFavorites || isOmnichannelAgent) {
			// 		tempChats = this.addRoomsGroup(chats, CHATS_HEADER, tempChats);
			// 	} else {
			// 		tempChats = chats;
			// 	}

			// 	const chatsUpdate = tempChats.map(item => item.rid);

			// 	setChats(tempChats);
			// 	setChatsUpdate(chatsUpdate);
			// 	setOmnichannelsUpdate(omnichannelsUpdate);
			// 	setLoading(false);
			// });
		};

		getSubscriptions();

		// Clean up the subscription when component unmounts
		return () => {
			// unsubscribeQuery();
		};
	}, []);

	const content = () => (
		<View style={{ width: '100%' }}>
			{selectedTab === DiscussionTabs.DISCUSSION_BOARDS && (
				<FlatList
					data={boards}
					renderItem={({ item }) => (
						<DiscussionBoardCard {...item} onPress={() => navigation.navigate('DiscussionBoardView', { item })} />
					)}
					keyExtractor={(item, id) => item.title + id}
					ItemSeparatorComponent={() => <View style={styles.discussionBoardsSeparator} />}
					style={{ padding: 20 }}
					ListFooterComponent={<View style={styles.footer} />}
				/>
			)}
			{selectedTab === DiscussionTabs.SAVED_POSTS && (
				<FlatList
					data={posts}
					renderItem={({ item }) => <DiscussionPostCard {...item} />}
					keyExtractor={(item, id) => item.title + id}
					ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
					style={{ padding: 20 }}
					ListFooterComponent={<View style={styles.footer} />}
				/>
			)}
		</View>
	);

	return (
		<View style={styles.mainContainer}>
			<Header onTabChange={(tab: DiscussionTabs) => setSelectedTab(tab)} />
			{content()}
		</View>
	);
};

export default withTheme(DiscussionHomeView);
