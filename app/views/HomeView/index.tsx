import React, { useEffect } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Touchable from 'react-native-platform-touchable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { getUserSelector } from '../../selectors/login';
import { LISTENER } from '../../containers/Toast';
import StatusBar from '../../containers/StatusBar';
import * as HeaderButton from '../../containers/HeaderButton';
import EventEmitter from '../../lib/methods/helpers/events';
import { TGoRoomItem, goRoom } from '../../lib/methods/helpers/goRoom';
import { themes } from '../../lib/constants';
import {
	//  useTheme,
	withTheme
} from '../../theme';
import {
	IApplicationState
	//  SubscriptionType
} from '../../definitions';
import * as tileData from './data';
import * as allStyles from './styles';
import { Tileprops } from './interfaces';
import { get247Chat } from './helpers';
import Avatar from '../../containers/Avatar/Avatar';
// import { getRoomTitle, getUidDirectMessage } from '../../lib/methods/helpers';
import Navigation from '../../lib/navigation/appNavigation';

const HomeView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const server = useSelector((state: IApplicationState) => state.server.server);
	const userName = user?.name || '';
	// const { theme } = useTheme();
	const theme = 'light';

	const { largeTiles, smallTiles } = tileData;
	const { styles, createTileStyles } = allStyles;
	const [chat247Room, setChat247Room] = React.useState<TGoRoomItem | undefined>(undefined);

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='display-view-drawer' />,
				headerRight: () => (
					<HeaderButton.Container>
						<HeaderButton.Item
							iconName='search'
							onPress={() => {
								EventEmitter.emit(LISTENER, { message: `Open search` });
							}}
						/>
						<Touchable style={styles.profileImageContainer} onPress={() => navigation.navigate('ProfileStackNavigator')}>
							{userName && <Avatar text={userName} style={styles.profileImage} size={24} server={server} borderRadius={12} />}
						</Touchable>
					</HeaderButton.Container>
				)
			});
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const chatRoom = await get247Chat();
				setChat247Room(chatRoom);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, []);

	const navigateTo247Chat = () => {
		if (chat247Room) {
			try {
				goRoom({ item: chat247Room._raw, isMasterDetail });
			} catch (error) {
				console.error('error', error);
			}
		}
	};

	const homeViewTile = ({ icon, title, size, screen, color, disabled = false }: Tileprops, index: number) => {
		const tileStyles = createTileStyles({
			size,
			color: themes[theme][color]
		});
		const imageStyle = size === 'large' ? tileStyles.largeImage : tileStyles.smallImage;

		return (
			<Touchable
				onPress={() => {
					if (screen) {
						if (screen === '24Chat') {
							// console.log('chat247Room', chat247Room);
							// const room = { ...chat247Room._raw, uids: JSON.parse(chat247Room._raw.uids) };

							// const result = await Services.createDirectMessage(room.username as string);
							// if (result.success) {
							// this.goRoom({ rid: result.room._id, name: item.username, t: SubscriptionType.DIRECT });

							// const params = {
							// 	// rid: result.room._id,
							// 	rid: room._id,
							// 	name: getRoomTitle(room),
							// 	t: SubscriptionType.DIRECT,
							// 	prid: room.prid,
							// 	room: room,
							// 	visitor: room.visitor,
							// 	roomUserId: getUidDirectMessage(room)
							// };

							// console.log('chat247Room params', params);
							// Navigation.navigate('RoomListView' );

							// navigation.reset({
							// 	screen: 'RoomListView'
							// 	// 	params: params
							// });
							Navigation.navigate('ChatsStackNavigator', {
								screen: 'RoomListView'
								// 	params: params
							});
							// }
							navigateTo247Chat();

							// Navigation.dispatch((state: any) => {

							// 	const routesRoomsListView = state.routes.filter((r: any) => r.name === 'RoomsListView');
							// 	console.log('routesRoomsListView', routesRoomsListView, state.routes);
							// 	// console.log('routeParams', routeParams);

							// 	// return CommonActions.reset({
							// 	// 	...state,
							// 	// 	routes: [
							// 	// 		...routesRoomsListView,
							// 	// 		{
							// 	// 			name: 'RoomView',
							// 	// 			params: routeParams
							// 	// 		}
							// 	// 	],
							// 	// 	index: routesRoomsListView.length
							// 	// });
							// });
							return;
						}
						navigation.navigate(screen);
					}
				}}
				style={{ opacity: disabled ? 0.4 : 1, ...tileStyles.tile }}
				key={index}
				disabled={disabled}
				activeOpacity={0.6}
			>
				<View style={tileStyles.tileContent}>
					<View style={tileStyles.imageContainer}>
						<Image source={icon} style={imageStyle} resizeMode='contain' />
					</View>
					<Text style={tileStyles.text}>{title}</Text>
				</View>
			</Touchable>
		);
	};

	return (
		<View style={styles.mainContainer} testID='home-view'>
			<StatusBar />
			<ScrollView>
				<Text style={styles.title}>{`Welcome ${userName},`}</Text>
				<View style={styles.tileContainer}>{largeTiles.map((item, index) => homeViewTile(item, index))}</View>
				<View style={styles.tileContainer}>{smallTiles.map((item, index) => homeViewTile(item, index))}</View>
			</ScrollView>
		</View>
	);
};

export default withTheme(HomeView);
