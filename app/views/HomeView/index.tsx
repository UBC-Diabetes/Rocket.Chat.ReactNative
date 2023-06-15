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
import { useTheme, withTheme } from '../../theme';
import { IApplicationState } from '../../definitions';
import * as tileData from './data';
import * as allStyles from './styles';
import { Tileprops } from './interfaces';
import { get247Chat } from './helpers';

const imageUrl =
	'https://marketplace.canva.com/EAFEits4-uw/1/0/800w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-r0bPCSjUqg0.jpg';

const HomeView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const userName = user?.name || '';
	const { theme } = useTheme();
	let chat247Room: TGoRoomItem | undefined;
	const { largeTiles, smallTiles } = tileData;
	const { styles, createTileStyles } = allStyles;

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
							<Image source={{ uri: imageUrl }} style={styles.profileImage} />
						</Touchable>
					</HeaderButton.Container>
				)
			});
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				chat247Room = await get247Chat();
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, []);

	const navigateTo247Chat = () => {
		if (chat247Room) {
			try {
				goRoom({ item: chat247Room, isMasterDetail });
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
							navigation.navigate('RoomsListView');
							navigateTo247Chat();
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
