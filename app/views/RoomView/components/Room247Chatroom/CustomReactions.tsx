import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Touchable from '../../../../containers/message/Touchable';
import { CustomIcon } from '../../../../containers/CustomIcon';
import Emoji from '../../../../containers/message/Emoji';
import { BUTTON_HIT_SLOP } from '../../../../containers/message/utils';
import { TSupportedThemes, useTheme } from '../../../../theme';
import MessageContext from '../../../../containers/message/Context';
import { TGetCustomEmoji } from '../../../../definitions/IEmoji';

// Use the styles from the standard message container to ensure consistency
import messageStyles from '../../../../containers/message/styles';

// Custom styles for oval-shaped reaction bubbles
const customStyles = StyleSheet.create({
	reactionButton: {
		marginRight: 6,
		marginBottom: 6,
		borderRadius: 16,
		// Make them oval rather than circular
		width: 'auto',
		minWidth: 48,
		paddingHorizontal: 4,
		height: 28,
		backgroundColor: '#FFF',
		borderWidth: 1,
		borderColor: '#CBCED1',
		alignItems: 'center',
		justifyContent: 'center'
	},
	reactionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 16
	},
	reactionCount: {
		fontSize: 13,
		marginLeft: 3,
		marginRight: 6,
		color: '#1E2A3A',
		fontWeight: '600'
	},
	reactionEmoji: {
		fontSize: 14,
		marginLeft: 4
	},
	reactionsGrid: {
		flexDirection: 'column'
	},
	reactionRow: {
		flexDirection: 'row',
		marginBottom: 6,
		alignItems: 'center'
	}
});

interface IReaction {
	_id: string;
	emoji: string;
	usernames: string[];
}

interface ICustomReactionsProps {
	reactions: IReaction[] | undefined;
	getCustomEmoji: TGetCustomEmoji;
	isOwn: boolean;
}

interface IReactionBubbleProps {
	reaction: IReaction;
	getCustomEmoji: TGetCustomEmoji;
}

/**
 * Custom reaction component that matches the styling of the standard Reaction component
 * but allows conditional rendering based on message ownership
 */
const ReactionBubble = React.memo(({ reaction, getCustomEmoji }: IReactionBubbleProps) => {
	const { onReactionPress, onReactionLongPress, user } = useContext(MessageContext);
	const { theme } = useTheme();
	const reacted = reaction.usernames.findIndex((item: string) => item === user.username) !== -1;

	return (
		<Touchable
			onPress={() => onReactionPress(reaction.emoji)}
			onLongPress={onReactionLongPress}
			key={reaction.emoji}
			testID={`message-reaction-${reaction.emoji}`}
			style={customStyles.reactionButton}
			background={Touchable.Ripple('#EEE')}
			hitSlop={BUTTON_HIT_SLOP}>
			<View style={customStyles.reactionContainer}>
				<Emoji
					content={reaction.emoji}
					standardEmojiStyle={customStyles.reactionEmoji}
					customEmojiStyle={messageStyles.reactionCustomEmoji}
					getCustomEmoji={getCustomEmoji}
				/>
				<Text style={customStyles.reactionCount}>{reaction.usernames.length}</Text>
			</View>
		</Touchable>
	);
});

/**
 * AddReaction button that matches the styling of the standard Reaction component
 * but is round (not oval)
 */
const AddReaction = React.memo(() => {
	const { reactionInit } = useContext(MessageContext);
	const { theme } = useTheme();

	return (
		<Touchable
			onPress={reactionInit}
			key='message-add-reaction'
			testID='message-add-reaction'
			style={messageStyles.reactionButton}
			background={Touchable.Ripple('#EEE')}
			hitSlop={BUTTON_HIT_SLOP}>
			<View style={messageStyles.reactionContainer}>
				<CustomIcon name='reaction-add' size={18} color={'#1E2A3A'} style={{ marginHorizontal: 6 }} />
			</View>
		</Touchable>
	);
});

/**
 * Custom Reactions component that conditionally renders reactions based on message ownership
 * For own messages: Only shows existing reactions, no "Add Reaction" button
 * For other messages: Shows both existing reactions and the "Add Reaction" button
 */
const CustomReactions = ({ reactions, getCustomEmoji, isOwn }: ICustomReactionsProps) => {
	// If it's own message and there are no reactions, don't show anything
	if (isOwn && (!reactions || reactions.length === 0)) {
		return null;
	}

	// Chunk reactions into groups of 3
	const chunkReactions = (arr: IReaction[], size: number) => {
		const chunks = [];
		for (let i = 0; i < arr.length; i += size) {
			chunks.push(arr.slice(i, i + size));
		}
		return chunks;
	};

	const reactionRows = Array.isArray(reactions) ? chunkReactions(reactions, 3) : [];

	return (
		<View style={customStyles.reactionsGrid}>
			{/* Render reactions in rows of 3 */}
			{reactionRows.map((row, rowIndex) => (
				<View key={rowIndex} style={customStyles.reactionRow}>
					{row.map(reaction => (
						<ReactionBubble key={reaction.emoji} reaction={reaction} getCustomEmoji={getCustomEmoji} />
					))}
					{/* Add the "Add Reaction" button to the last row if it's not own message and has space */}
					{!isOwn && rowIndex === reactionRows.length - 1 && row.length < 3 && <AddReaction />}
				</View>
			))}

			{/* If all rows are full and it's not own message, add "Add Reaction" button in a new row */}
			{!isOwn && reactionRows.length > 0 && reactionRows[reactionRows.length - 1].length === 3 && (
				<View style={customStyles.reactionRow}>
					<AddReaction />
				</View>
			)}

			{/* If there are no reactions but it's not own message, show "Add Reaction" button */}
			{!isOwn && reactionRows.length === 0 && (
				<View style={customStyles.reactionRow}>
					<AddReaction />
				</View>
			)}
		</View>
	);
};

ReactionBubble.displayName = 'CustomReactionBubble';
AddReaction.displayName = 'CustomAddReaction';
CustomReactions.displayName = 'CustomReactions';

export default CustomReactions;
