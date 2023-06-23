export type CommentProps = {
	user: {
		name: string;
		profile_image: string;
	};
	date: string;
	description: string;
	likes: number;
};

export type PostOptionsModalProps = {
	show: boolean;
	comment: CommentProps;
	close: () => void;
	onDelete: () => void;
	onReport: () => void;
};

export enum ReportType {
	COMMENT = 'COMMENT',
	POST = 'POST'
}

export type PostReportModalProps = {
	show: boolean;
	type: ReportType;
	close: () => void;
	report: () => void;
};

export enum DeleteType {
	COMMENT = 'COMMENT',
	POST = 'POST'
}

export type PostDeleteModalProps = {
	show: boolean;
	type: DeleteType;
	close: () => void;
	delete: () => void;
};
