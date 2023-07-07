import { themeColors } from '../../lib/constants';

export const getColor = (color: string) => {
	const colorRegex = /^(#([A-Fa-f0-9]{3}){1,2}|(rgb|hsl)a?\([-.\d\s%,]+\))$/i;
	const isColor = colorRegex.test(color);

	if (isColor) {
		return color;
	}

	if (themeColors[color]) {
		return themeColors[color];
	}
};

export const getIcon = (icon: string) => {
	let imagePath;
	switch (icon) {
		case 'covid':
			imagePath = require('../../static/images/discussionboard/covid.png');
			break;
		case 'diet':
			imagePath = require('../../static/images/discussionboard/diet.png');
			break;
		case 'exercising':
			imagePath = require('../../static/images/discussionboard/exercising.png');
			break;
		case 'insulin':
			imagePath = require('../../static/images/discussionboard/insulin.png');
			break;
		case 'mdi_users':
			imagePath = require('../../static/images/discussionboard/mdi_users.png');
			break;
		case 'syringe':
			imagePath = require('../../static/images/discussionboard/syringe.png');
			break;
		case 'solidStar':
			imagePath = require(`../../static/images/discussionboard/star_solid.png`);
			break;
		case 'outlineStar':
			imagePath = require(`../../static/images/discussionboard/star_outline.png`);
			break;
		case 'solidSave':
			imagePath = require('../../static/images/discussionboard/save_solid.png');
			break;
		case 'outlineSave':
			imagePath = require('../../static/images/discussionboard/save.png');
			break;
		case 'like':
			imagePath = require('../../static/images/discussionboard/like.png');
			break;
		case 'comment':
			imagePath = require('../../static/images/discussionboard/comment.png');
			break;
		case 'arrowRight':
			imagePath = require('../../static/images/discussionboard/arrow_right.png');
			break;
		case 'arrowLeft':
			imagePath = require('../../static/images/discussionboard/arrow_left.png');
			break;
		case 'discussionBoardIcon':
			imagePath = require('../../static/images/discussion-solid.png');
			break;
		case 'arrowDown':
			imagePath = require('../../static/images/discussionboard/arrow_down.png');
			break;
		case 'selectImage':
			imagePath = require('../../static/images/discussionboard/image_picker.png');
			break;
		case 'more':
			imagePath = require('../../static/images/discussionboard/more.png');
			break;
		case 'send':
			imagePath = require('../../static/images/discussionboard/send.png');
			break;

		default:
			imagePath = require('../../static/images/discussionboard/image_picker.png');
			break;
	}
	return imagePath;
};
