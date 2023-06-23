import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import PopUpModal from '../Components/PopUpModal';
import { PostOptionsModalProps } from './interfaces';

const commentBox = require('../../../static/images/discussionboard/comment_box.png');
const alert = require('../../../static/images/discussionboard/alert_circle.png');
const trash = require('../../../static/images/discussionboard/trash.png');

const PostOptionsModal: React.FC<PostOptionsModalProps> = props => {
	const { show, comment, close, onDelete, onReport } = props;
	const username = comment?.user?.name;
	return (
		<PopUpModal show={show} close={close}>
			{username && (
				<TouchableOpacity style={styles.container}>
					<Image source={commentBox} style={styles.icon} />
					<Text style={styles.text}>{`Message ${username}`}</Text>
				</TouchableOpacity>
			)}
			<TouchableOpacity style={styles.container} onPress={() => onReport()}>
				<Image source={alert} style={styles.icon} />
				<Text style={styles.text}>Report comment</Text>
			</TouchableOpacity>
			<TouchableOpacity style={{ ...styles.container, ...styles.noBorder }} onPress={() => onDelete()}>
				<Image source={trash} style={styles.icon} />
				<Text style={styles.text}>Delete comment</Text>
			</TouchableOpacity>
		</PopUpModal>
	);
};

export default PostOptionsModal;

const styles = StyleSheet.create({
	container: {
		height: 66,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#00000033'
	},
	noBorder: {
		borderBottomWidth: 0
	},
	icon: {
		height: 18,
		width: 18,
		marginLeft: 27,
		marginRight: 18
	},
	text: {
		fontSize: 16,
		lineHeight: 19,
		fontWeight: '500'
	}
});
