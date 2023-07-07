import React, { useEffect, useState } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	TextInput,
	ScrollView,
	Dimensions,
	KeyboardAvoidingView,
	Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import I18n from 'i18n-js';

import { IApplicationState } from '../../../definitions';
import { useTheme, withTheme } from '../../../theme';
import { themes } from '../../../lib/constants';
import { getColor, getIcon } from '../helpers';
import BoardDropdownModal from './BoardDropdown';
import styles from './styles';
import { boards } from '../data';
import ReadyToPost from './ReadyToPost';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

const NewPostView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();
	const [title, setTitle] = useState('');
	const [image, setImage] = useState(null);
	const [description, setDescription] = useState('');
	const [showBoardsModal, setShowBoardsModal] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(null);
	const [showReadyToPost, setShowReadyToPost] = useState(false);

	useEffect(() => {
		navigation.setOptions({ title: 'Create a post', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()} hitSlop={hitSlop}>
						<Image source={getIcon('arrowLeft')} style={{ width: 11, height: 19 }} resizeMode='contain' />
					</TouchableOpacity>
				),
				headerRight: () => null
			});
		}
	});

	const onImagePicker = () => {
		const options = {
			cropping: true,
			compressImageQuality: 0.8,
			freeStyleCropEnabled: true,
			cropperAvoidEmptySpaceAroundImage: false,
			cropperChooseText: I18n.t('Choose'),
			cropperCancelText: I18n.t('Cancel'),
			includeBase64: true
		};
		ImagePicker.openPicker(options).then(image => {
			console.log(image);
			setImage({ ...image, data: `data:image/jpeg;base64,${image.data}` });
		});
	};

	const showBanner = () => {
		if (image) {
			const imageAspectRatio = image?.width / image?.height;
			const width = Dimensions.get('window').width - 40;
			const height = width / imageAspectRatio;
			return (
				<View>
					<Image style={{ width, height, ...styles.bannerImage }} source={{ uri: image.data }} resizeMode='contain' />
				</View>
			);
		}
	};

	// console.warn(selectedBoard);

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
			<ScrollView style={styles.mainContainer}>
				<View style={styles.boardContainer}>
					<Text style={styles.titleText}>Select Board</Text>
					<TouchableOpacity style={styles.discussionBoard} onPress={() => setShowBoardsModal(true)} hitSlop={hitSlop}>
						<View
							style={{
								...styles.boardIconContainer,
								backgroundColor: getColor(selectedBoard?.color ? selectedBoard.color : 'dreamBlue')
							}}
						>
							<Image
								source={getIcon(selectedBoard?.icon ? selectedBoard.icon : 'discussionBoardIcon')}
								style={styles.discussionIcon}
								resizeMode='contain'
							/>
						</View>
						<View style={styles.dropdown}>
							<Text style={styles.dropdownText}>{selectedBoard?.title ? selectedBoard.title : 'Select'}</Text>
							<Image source={getIcon('arrowDown')} style={styles.dropdownIcon} resizeMode='contain' />
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.titleContainer}>
					<Text style={styles.titleText}>Post Title</Text>
					<TextInput
						style={styles.textInput}
						placeholder='Title'
						placeholderTextColor={themes[theme].auxiliaryText}
						underlineColorAndroid='transparent'
						onChangeText={e => setTitle(e)}
						value={title}
					/>
				</View>
				{showBanner()}
				<View style={styles.descriptionContainer}>
					<Text style={styles.titleText}>Description</Text>
					<TextInput
						style={{ ...styles.textInput, ...styles.largeTextInput }}
						placeholder='Description'
						placeholderTextColor={themes[theme].auxiliaryText}
						underlineColorAndroid='transparent'
						onChangeText={e => setDescription(e)}
						multiline
						value={description}
						maxLength={4000}
					/>
				</View>
				<TouchableOpacity style={styles.selectImageContainer} onPress={onImagePicker} hitSlop={hitSlop}>
					<Image source={getIcon('selectImage')} style={styles.selectImage} resizeMode='contain' />
				</TouchableOpacity>
				<View style={styles.footer} />
			</ScrollView>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={() => setShowReadyToPost(true)}>
					<Text style={styles.buttonText}>Publish</Text>
				</TouchableOpacity>
			</View>
			<BoardDropdownModal
				show={showBoardsModal}
				close={() => setShowBoardsModal(!false)}
				data={boards}
				onSelect={(board) => {
					setSelectedBoard(board);
					setShowBoardsModal(false);
				}}
			/>
			<ReadyToPost show={showReadyToPost} close={() => setShowReadyToPost(false)} onPost={() => {}} />
		</KeyboardAvoidingView>
	);
};

export default withTheme(NewPostView);
