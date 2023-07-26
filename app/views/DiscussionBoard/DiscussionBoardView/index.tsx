import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Q } from '@nozbe/watermelondb';
// import { sanitizedRaw } from '@nozbe/watermelondb/RawRecord';

import * as HeaderButton from '../../../containers/HeaderButton';
import { themes } from '../../../lib/constants';
import { useTheme, withTheme } from '../../../theme';
import styles from './styles';
import { IApplicationState, TMessageModel, TThreadModel } from '../../../definitions';
import PostCard from '../Components/DiscussionPostCard';
import { posts } from '../data';
import { getIcon } from '../helpers';
import { getRoom } from '../../../lib/methods/getRoom';
import { loadMessagesForRoom, readMessages } from '../../../lib/methods';
import RoomServices from './../../RoomView/services';
import database from '../../../lib/database';
import { compareServerVersion } from '../../../lib/methods/helpers';
import { getUserSelector } from '../../../selectors/login';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };
const QUERY_SIZE = 50;

type ScreenProps = {
	route: any;
};

const DiscussionView: React.FC<ScreenProps> = ({ route }) => {
	const navigation = useNavigation<StackNavigationProp<any>>();

	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const serverVersion = useSelector((state: IApplicationState) => state.server.version);
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const Hide_System_Messages = useSelector((state: IApplicationState) => state.settings.Hide_System_Messages as string[]);
	const { theme } = useTheme();
	const [messages, setMessages] = useState<TMessageModel | []>([]);

	useEffect(async () => {
		const item = route.params?.item;
		if (item) {
			const rid = item._raw.rid;
			// console.log('item ---------------------------- ', item);
			// await loadMessagesForRoom({
			// 	rid: rid,
			// 	t: item._raw.t
			// 	// latest: loaderItem.ts as Date,
			// 	// loaderItem
			// });

			// const messages = await RoomServices.getMessages({
			// 	rid: rid
			// 	// t,
			// 	// latest,
			// 	// lastOpen,
			// 	// loaderItem
			// });

			// console.log('messages -------------- ', messages);

			// const db = database.active;
			// const subCollection = await db.get('subscriptions');
			// const room = await subCollection.find(rid);
			// console.log('room --------------', room);

			// // this.setState({ room });
			// if (!this.tmid) {
			// 	this.setHeader();
			// }

			// if (!this.rid) {
			// 	return;
			// }
			// if (this.tmid) {
			// 	await loadThreadMessages({ tmid: this.tmid, rid: this.rid });
			// } else {
			// const newLastOpen = new Date();
			// 	await RoomServices.getMessages(room);

			// 	// if room is joined
			// 	if (joined && 'id' in room) {
			// 		if (room.alert || room.unread || room.userMentions) {
			// 			this.setLastOpen(room.ls);
			// 		} else {
			// 			this.setLastOpen(null);
			// 		}
			// readMessages(item._raw.rid, newLastOpen, true).catch(e => console.log(e));
			// 	}
			// }
			loadMessages(item._raw);
		}
	}, [route.params]);

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<TouchableOpacity
						style={{ marginLeft: 20 }}
						onPress={() => {
							navigation.goBack();
						}}
						hitSlop={hitSlop}
					>
						<Image source={getIcon('arrowLeft')} style={{ width: 11, height: 19 }} resizeMode='contain' />
					</TouchableOpacity>
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

	const loadMessages = async (item: any) => {
		console.log('Loading messages');
		let count = QUERY_SIZE;
		let thread: TThreadModel | null = null;
		let messagesObservable;
		// const { rid, tmid, showMessageInMainThread, serverVersion } = this.props;
		const {
			rid,
			sys_mes,
			// TODO pass tmid
			tmid
		} = item;
		const showMessageInMainThread = user.showMessageInMainThread ?? false;
		const db = database.active;

		// handle servers with version < 3.0.0
		let hideSystemMessages = Array.isArray(sys_mes) ? sys_mes : Hide_System_Messages || [];
		if (!Array.isArray(hideSystemMessages)) {
			hideSystemMessages = [];
		}

		// if (tmid) {
		// 	try {
		// 		thread = await db.get('threads').find(tmid);
		// 	} catch (e) {
		// 		console.log(e);
		// 	}
		// 	messagesObservable = db
		// 		.get('thread_messages')
		// 		.query(Q.where('rid', tmid), Q.experimentalSortBy('ts', Q.desc), Q.experimentalSkip(0), Q.experimentalTake(count))
		// 		.observe();
		// } else
		if (rid) {
			const whereClause = [
				Q.where('rid', rid),
				Q.experimentalSortBy('ts', Q.desc),
				Q.experimentalSkip(0),
				Q.experimentalTake(count)
			] as (Q.WhereDescription | Q.Or)[];
			if (!showMessageInMainThread) {
				whereClause.push(Q.or(Q.where('tmid', null), Q.where('tshow', Q.eq(true))));
			}
			messagesObservable = db
				.get('messages')
				.query(...whereClause)
				.observe();
		}

		if (rid) {
			messagesObservable?.subscribe(messages => {
				if (tmid && thread) {
					messages = [...messages, thread];
				}

				/**
				 * Since 3.16.0 server version, the backend don't response with messages if
				 * hide system message is enabled
				 */
				if (compareServerVersion(serverVersion, 'lowerThan', '3.16.0') || hideSystemMessages.length) {
					messages = messages.filter(m => !m.t || !hideSystemMessages?.includes(m.t));
				}

				// if (this.mounted) {
				// this.setState({ messages }, () => this.update());
				// } else {
				// @ts-ignore
				// this.state.messages = messages;
				console.log('messages 000000', messages);
				setMessages(messages);
				// }
				// TODO: move it away from here
				// this.readThreads();
			});
		}
	};

	return (
		<View style={styles.mainContainer}>
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>Exercising</Text>
			</View>
			<FlatList
				// data={messages || posts}
				data={messages}
				renderItem={({ item }) => <PostCard {...item} onPress={() => navigation.navigate('DiscussionPostView')} />}
				keyExtractor={(item, id) => item.title + id}
				ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
				style={{ paddingHorizontal: 20, paddingTop: 10 }}
				ListFooterComponent={<View style={styles.footer} />}
			/>
			<TouchableOpacity
				style={[styles.buttonContainer, { backgroundColor: themes[theme].mossGreen }]}
				onPress={() => {
					navigation.navigate('DiscussionNewPostView');
				}}
			>
				<Text style={styles.buttonText}>Create a post</Text>
			</TouchableOpacity>
		</View>
	);
};

export default withTheme(DiscussionView);
