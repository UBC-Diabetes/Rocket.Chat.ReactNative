import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const ConfirmationPopup = ({ onConfirm, eventDetails }) => {
	return (
		<View style={styles.overlay}>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.popupContainer}>
					<View style={styles.popup}>
						<Text style={styles.popupTitle}>Confirmation</Text>
						<Text style={styles.eventTitle}>{eventDetails.title}</Text>

						<View style={styles.detailsContainer}>
							<View style={styles.detailRow}>
								<Text style={styles.detailIcon}>👥</Text>
								<Text style={styles.detailText}>{eventDetails.guests} guests</Text>
							</View>
							<View style={styles.detailRow}>
								<Text style={styles.detailIcon}>📅</Text>
								<Text style={styles.detailText}>{eventDetails.date}</Text>
							</View>
							<View style={styles.detailRow}>
								<Text style={styles.detailIcon}>🕒</Text>
								<Text style={styles.detailText}>{eventDetails.time}</Text>
							</View>
						</View>

						<Text style={styles.zoomLinkLabel}>Zoom Link</Text>
						<Text style={styles.zoomLink}>{eventDetails.zoomLink}</Text>

						<TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
							<Text style={styles.confirmButtonText}>Confirm</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.helpButton}>
							<Text style={styles.helpButtonText}>Need help? Chat with a research assistant</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
		zIndex: 1000
	},
	safeArea: {
		backgroundColor: 'transparent'
	},
	popupContainer: {
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20
	},
	popup: {
		padding: 20
	},
	popupTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333'
	},
	eventTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#000'
	},
	detailsContainer: {
		marginBottom: 20
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	detailIcon: {
		fontSize: 18,
		marginRight: 10
	},
	detailText: {
		fontSize: 16,
		color: '#333'
	},
	zoomLinkLabel: {
		fontSize: 14,
		color: '#666',
		marginBottom: 5
	},
	zoomLink: {
		fontSize: 14,
		color: '#0000FF',
		textDecorationLine: 'underline',
		marginBottom: 20
	},
	confirmButton: {
		paddingVertical: 15,
		borderRadius: 25,
		alignItems: 'center',
		marginBottom: 15,
		borderWidth: 1,
		borderColor: '#E3E3E3'
	},
	confirmButtonText: {
		color: '#000',
		fontSize: 18,
		fontWeight: 'bold'
	},
	helpButton: {
		alignItems: 'center'
	},
	helpButtonText: {
		color: '#666',
		fontSize: 14,
		textDecorationLine: 'underline'
	}
});

export default ConfirmationPopup;
