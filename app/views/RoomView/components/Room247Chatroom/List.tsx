import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

import { themes } from '../../../../lib/constants';
import scrollPersistTaps from '../../../../lib/methods/helpers/scrollPersistTaps';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import { TAnyMessageModel } from '../../../../definitions';
import { TSupportedThemes } from '../../../../theme';
import Room247MessageSeparator from './Room247MessageSeparator';

interface IRoom247ListProps {
	theme: TSupportedThemes;
	messages: TAnyMessageModel[];
	renderItem: (item: TAnyMessageModel, prevItem: TAnyMessageModel) => React.ReactElement;
	loading: boolean;
}

// DEVELOPMENT: Toggle to enable/disable mock own message
const SHOW_MOCK_OWN_MESSAGE = true;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F8F8' // Updated message area background color
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
	// Mock own message for development
	let displayMessages = messages;
	if (SHOW_MOCK_OWN_MESSAGE && messages.length > 0) {
		const mockOwnMessage = {
			id: 'mock-own-message',
			_id: 'mock-own-message',
			u: { username: 'myself', _id: 'myself' },
			msg: 'This is a mock message from me (own message) for development.',
			ts: new Date(),
			tcount: 1,
			replies: ['user1'],
			rid: 'mock-room',
			_updatedAt: new Date(),
			dml: new Date().toISOString(),
			t: 'rm', // workaround for type checking; treat as user message
			// Add reactions in the correct array format
			reactions: [
				{
					_id: 'mock-own-message-smile',
					emoji: '😊',
					usernames: ['user1', 'user2', 'user3']
				},
				{
					_id: 'mock-own-message-thumbsup',
					emoji: '👍',
					usernames: ['user4', 'user5']
				},
				{
					_id: 'mock-own-message-heart',
					emoji: '❤️',
					usernames: ['user6']
				}
			]
			// Add any other fields as needed for rendering
		} as unknown as TAnyMessageModel;
		displayMessages = [mockOwnMessage, ...messages];
	}

	if (loading && !displayMessages.length) {
		return (
			<View style={[styles.loadingContainer, { backgroundColor: themes[theme].backgroundColor }]}>
				<ActivityIndicator />
			</View>
		);
	}

	// Empty state display
	if (!displayMessages.length) {
		return (
			<View style={[styles.container, styles.emptyContainer]}>
				<Text style={styles.emptyText}>No messages yet</Text>
			</View>
		);
	}

	// Helper to check if two messages are on different days
	const isNewDay = (current: TAnyMessageModel, previous?: TAnyMessageModel) => {
		if (!previous) return true;
		const currDate = current.ts ? new Date(current.ts) : null;
		const prevDate = previous.ts ? new Date(previous.ts) : null;
		if (!currDate || !prevDate) return false;
		return currDate.toDateString() !== prevDate.toDateString();
	};

	return (
		<View style={styles.container}>
			<FlatList
				testID='room-view-messages-247'
				style={styles.list}
				data={displayMessages}
				keyExtractor={item => item.id}
				renderItem={({ item, index }) => {
					const prevItem = displayMessages[index + 1]; // FlatList is inverted
					const showSeparator = isNewDay(item, prevItem);
					return (
						<>
							{showSeparator && <Room247MessageSeparator ts={item.ts} />}
							{renderItem(item, prevItem)}
						</>
					);
				}}
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
