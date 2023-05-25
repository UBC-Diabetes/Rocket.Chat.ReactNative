import React, { useEffect } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import Touchable from 'react-native-platform-touchable';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { TColors, useTheme, withTheme } from '../../theme';
import { IApplicationState, IUser } from '../../definitions';
import { getUserSelector } from '../../selectors/login';
import { LISTENER } from '../../containers/Toast';
import EventEmitter from '../../lib/methods/helpers/events';
import StatusBar from '../../containers/StatusBar';
import * as HeaderButton from '../../containers/HeaderButton';
import { useAppSelector } from '../../lib/hooks';
import { tiles } from './data';
import { styles, createStyles } from './styles';
// import { events, logEvent } from 'lib/methods/helpers/log';

interface Props {
	user: IUser | undefined;
	navigation: StackNavigationProp<any>;
}

const HomeView: React.FC<Props> = ({ user}) => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const { isMasterDetail } = useAppSelector(state => state.app);
	const userName = user?.name || '';
	const { colors } = useTheme();

	useEffect(()=>{
		navigation.setOptions ({
			title: ''
		});
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => <HeaderButton.Drawer navigation={navigation} testID='display-view-drawer' />,
				// headerRight: () => <HeaderButton.Message navigation={navigation} />
			
			});
		}
	},[navigation]);

	interface Tileprops {
		icon: any;
		title: string;
		size: 'small' | 'large';
		screen: string;
		color: TColors;
		disabled?: boolean;
	}

	const homeViewTile = ({ icon, title, size, screen, color, disabled = false }: Tileprops, index: number) => {
		let imageStyle = { width: 45, height: 45 };
		if (size === 'large') {
			imageStyle = { width: 75, height: 75 };
		}
		const tileStyles = createStyles({ size, themeColors: colors, color });

		return (
			<Touchable
				onPress={() => {
					// logEvent(events[`SIDEBAR_GO_${route.replace('StackNavigator', '').replace('View', '').toUpperCase()}`]);
					if (screen) {
						navigation.navigate(screen);
					} else {
						EventEmitter.emit(LISTENER, { message: `navigate to ${screen}` });
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
      <StatusBar/>
			<ScrollView>
				<Text style={styles.title}>{`Welcome ${userName},`}</Text>
				<View style={styles.tileContainer}>{tiles.map((item, index) => homeViewTile(item, index))}</View>
			</ScrollView>
		</View>
	);
};

const mapStateToProps = (state: IApplicationState) => ({
	user: getUserSelector(state)
});

export default connect(mapStateToProps)(withTheme(HomeView));
