import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { themes } from '../../../../lib/constants';
import scrollPersistTaps from '../../../../lib/methods/helpers/scrollPersistTaps';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import { TAnyMessageModel } from '../../../../definitions';
import { TSupportedThemes } from '../../../../theme';

interface IRoom247ListProps {
	theme: TSupportedThemes;
	messages: TAnyMessageModel[];
	renderItem: (item: TAnyMessageModel, prevItem: TAnyMessageModel) => React.ReactElement;
	loading: boolean;
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
		backgroundColor: '#e5ddd5' // WhatsApp-like chat background color
	},
	contentContainer: {
		paddingHorizontal: 8,
		paddingVertical: 10
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#888',
		textAlign: 'center',
		marginHorizontal: 40
	}
});

const Room247List = ({ theme, messages, renderItem, loading }: IRoom247ListProps) => {
	useEffect(() => {
		console.log('Room247List - Messages count:', messages.length);
	}, [messages]);

	if (loading && !messages.length) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor: themes[theme].backgroundColor }]}>
				<ActivityIndicator />
			</View>
		);
	}

	// Empty state display
	if (!messages.length) {
		return (
			<View style={[styles.list, styles.emptyContainer]}>
				<Text style={styles.emptyText}>No messages yet</Text>
			</View>
		);
	}

	return (
		<FlatList
			testID='room-view-messages-247'
			style={styles.list}
			data={messages}
			keyExtractor={item => item.id}
			renderItem={({ item, index }) => renderItem(item, messages[index + 1])}
			contentContainerStyle={styles.contentContainer}
			removeClippedSubviews={false}
			initialNumToRender={15}
			maxToRenderPerBatch={20}
			windowSize={20}
			onEndReachedThreshold={0.5}
			{...scrollPersistTaps}
		/>
	);
};

export default Room247List;
