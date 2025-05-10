import React from 'react';
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
	container: {
		flex: 1,
		backgroundColor: '#e5ddd5' // WhatsApp-like chat background color
	},
	list: {
		flex: 1
	},
	contentContainer: {
		paddingHorizontal: 8,
		paddingVertical: 16 // Increase padding for better visual spacing
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
			<View style={[styles.container, styles.emptyContainer]}>
				<Text style={styles.emptyText}>No messages yet</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
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
				inverted={true} // Ensure new messages appear at the bottom
				showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner look
				{...scrollPersistTaps}
			/>
		</View>
	);
};

export default Room247List;
