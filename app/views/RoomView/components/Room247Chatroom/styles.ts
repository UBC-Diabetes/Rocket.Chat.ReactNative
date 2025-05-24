import { StyleSheet } from 'react-native';

import sharedStyles from '../../../Styles';
import { isTablet } from '../../../../lib/methods/helpers';

export default StyleSheet.create({
	root: {
		flexDirection: 'row'
	},
	container: {
		paddingVertical: 4,
		width: '100%',
		paddingHorizontal: 14,
		flexDirection: 'column',
		backgroundColor: '#F8F8F8'
	},
	contentContainer: {
		flex: 1
	},
	messageContent: {
		flex: 1,
		marginLeft: 46
	},
	messageContentWithHeader: {
		marginLeft: 10
	},
	messageContentWithError: {
		marginLeft: 0
	},
	flex: {
		flexDirection: 'row'
	},
	temp: { opacity: 0.3 },
	marginTop: {
		marginTop: 6
	},
	reactionsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 8
	},
	reactionButton: {
		marginRight: 8,
		marginBottom: 8,
		borderRadius: 4
	},
	reactionContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderWidth: 1,
		height: 28,
		minWidth: 46.3
	},
	reactionCount: {
		fontSize: 14,
		marginLeft: 3,
		marginRight: 8.5,
		...sharedStyles.textSemibold
	},
	reactionEmoji: {
		fontSize: 13,
		marginLeft: 7,
		color: '#ffffff'
	},
	reactionCustomEmoji: {
		width: 19,
		height: 19,
		marginLeft: 7
	},
	avatar: {
		marginTop: 4
	},
	avatarSmall: {
		marginLeft: 16
	},
	buttonContainer: {
		marginTop: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
	button: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4
	},
	buttonIcon: {
		marginRight: 8
	},
	buttonText: {
		fontSize: 12,
		...sharedStyles.textSemibold
	},
	imageContainer: {
		flexDirection: 'column',
		borderRadius: 4
	},
	image: {
		width: '100%',
		minHeight: isTablet ? 300 : 200,
		borderRadius: 4,
		overflow: 'hidden'
	},
	imagePressed: {
		opacity: 0.5
	},
	inlineImage: {
		width: 300,
		height: 300,
		resizeMode: 'contain'
	},
	text: {
		fontSize: 16,
		color: '#FFFFFF',
		...sharedStyles.textRegular
	},
	textInfo: {
		fontSize: 16,
		...sharedStyles.textRegular
	},
	startedDiscussion: {
		fontStyle: 'italic',
		fontSize: 16,
		marginBottom: 6,
		...sharedStyles.textRegular
	},
	time: {
		fontSize: 13,
		marginLeft: 8,
		...sharedStyles.textRegular
	},
	repliedThread: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 6,
		marginBottom: 12
	},
	repliedThreadIcon: {
		marginRight: 10,
		marginLeft: 16
	},
	repliedThreadName: {
		fontSize: 16,
		flex: 1,
		...sharedStyles.textRegular
	},
	repliedThreadDisclosure: {
		marginLeft: 4,
		marginRight: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
	threadBadge: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 8
	},
	threadBell: {
		marginLeft: 8
	},
	rightIcons: {
		paddingLeft: 5
	},
	threadDetails: {
		flex: 1,
		marginLeft: 12
	},
	blurView: {
		position: 'absolute',
		borderWidth: 0,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	blurIndicator: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center'
	},
	// Room247Message specific styles
	ownMessageWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end' // Align to the right
	},
	otherMessageWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start' // Align to the left
	},
	ownMessage: {
		maxWidth: '75%',
		backgroundColor: '#2C74B3',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
		overflow: 'hidden',
		marginRight: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
		position: 'relative'
	},
	otherMessage: {
		maxWidth: '75%',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
		overflow: 'hidden',
		marginLeft: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
		position: 'relative'
	},
	bubbleMessageContent: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		paddingBottom: 16,
		backgroundColor: 'transparent',
		minWidth: 80
	},
	timestamp: {
		fontSize: 10,
		position: 'absolute',
		right: 8,
		bottom: 4
		// color will be set inline depending on own/other
	},
	// Message tail styles
	ownTail: {
		position: 'absolute',
		right: -8,
		top: 0,
		width: 8,
		height: 16,
		backgroundColor: '#dcf8c6', // Same as bubble color
		borderTopRightRadius: 8
	},
	otherTail: {
		position: 'absolute',
		left: -8,
		top: 0,
		width: 8,
		height: 16,
		backgroundColor: '#fff', // Same as bubble color
		borderTopLeftRadius: 8
	},
	// Add extra styling for user name in group chats
	userName: {
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 2
		// Color will be set inline per-username
	},
	avatarContainer: {
		width: 40,
		height: 40
	},
	// Add new style for system messages
	systemMessageContainer: {
		margin: 8,
		padding: 12,
		borderRadius: 8,
		alignSelf: 'center',
		maxWidth: '85%'
	},
	replyRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 12
	},
	replyButton: {
		backgroundColor: '#112D4E',
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 6,
		marginRight: 8
	},
	replyButtonText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600'
	},
	iconCount: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 12
	},
	icon: {
		marginRight: 4
	},
	iconText: {
		color: '#1E2A3A',
		fontSize: 14,
		fontWeight: '600'
	},
	// Message text color for own messages
	ownMessageText: {
		color: '#FFFFFF'
	},
	// Message text color for other messages
	otherMessageText: {
		color: '#000000'
	},
	// Position for the reactions container
	reactionsRowAbsoluteContainer: {
		position: 'absolute',
		bottom: -16,
		zIndex: 2
	},
	ownReactionsContainer: {
		left: 8
	},
	otherReactionsContainer: {
		left: 22
	}
});
