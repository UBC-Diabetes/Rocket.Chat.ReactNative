import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { hideRemoveEventPopup } from '../../actions/confirmationPopup';

const RemoveEventPopup = ({ event }: { event: any }) => {
	const dispatch = useDispatch();

	const handleRemove = () => {
		dispatch(hideRemoveEventPopup());
	};

	const handleDismiss = () => {
		dispatch(hideRemoveEventPopup());
	};

	return (
		<Modal transparent={true} onRequestClose={handleDismiss}>
			<TouchableWithoutFeedback onPress={handleDismiss}>
				<View style={styles.fullScreen}>
					<View style={styles.popup}>
						<View style={styles.contentContainer}>
							<Text style={styles.title}>Are you sure you want to remove this event from the calendar?</Text>
						</View>
						<TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
							<Text style={styles.removeButtonText}>Remove event</Text>
						</TouchableOpacity>
						<View style={styles.buttonSeparator} />
						<TouchableOpacity style={styles.cancelButton} onPress={handleDismiss}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	fullScreen: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.4)'
	},
	popup: {
		width: '97%',
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingVertical: 20,
		paddingHorizontal: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: -2
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5
	},
	contentContainer: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#CCCCCC'
	},
	removeButton: {
		paddingVertical: 12
	},
	removeButtonText: {
		color: 'red',
		textAlign: 'center',
		fontSize: 17,
		fontWeight: '600'
	},
	buttonSeparator: {
		height: 8,
		backgroundColor: '#F1F1F1'
	},
	cancelButton: {
		paddingVertical: 12
	},
	cancelButtonText: {
		color: '#007AFF',
		textAlign: 'center',
		fontSize: 17,
		fontWeight: '400'
	},
	title: {
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
		marginBottom: 20
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%'
	},
	buttonText: {
		fontSize: 18,
		color: '#FFF',
		fontWeight: 'bold'
	}
});

export default RemoveEventPopup;
