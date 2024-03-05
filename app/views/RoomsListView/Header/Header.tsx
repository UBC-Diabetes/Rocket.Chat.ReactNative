import React from 'react';
import { StyleSheet, Text, TextInputProps, TouchableOpacityProps, View } from 'react-native';

import sharedStyles from '../../Styles';
import { useTheme } from '../../../theme';
import SearchHeader from '../../../containers/SearchHeader';

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center'
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	title: {
		flexShrink: 1,
		fontSize: 16,
		...sharedStyles.textSemibold
	},
	subtitle: {
		fontSize: 14,
		...sharedStyles.textRegular
	}
});

interface IRoomHeader {
	connecting: boolean;
	connected: boolean;
	isFetching: boolean;
	serverName: string;
	server: string;
	showSearchHeader: boolean;
	width?: number;
	onSearchChangeText: TextInputProps['onChangeText'];
	onPress: TouchableOpacityProps['onPress'];
}

const Header = React.memo(({ serverName, showSearchHeader, onSearchChangeText }: IRoomHeader) => {
	const { colors } = useTheme();

	if (showSearchHeader) {
		return <SearchHeader onSearchChangeText={onSearchChangeText} testID='rooms-list-view-search-input' />;
	}

	return (
		<View style={styles.container}>
			<Text style={[styles.title, { color: colors.headerTitleColor }]} numberOfLines={1}>
				{serverName}
			</Text>
		</View>
	);
});

export default Header;
