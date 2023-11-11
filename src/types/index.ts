import formidable from 'formidable';
import { Session } from 'next-auth';
export type TProvider = 'naver' | 'google' | 'apple' | 'facebook' | 'kakao';
export type TStatus = 'created' | 'error' | 'deleted' | 'analyzing';

export type TExtendedSession =
	| (Session & {
			provider?: TProvider;
	  })
	| null;
export type TExtendedFile = formidable.File & {
	filepath: string;
};
export type TParagraph = {
	content: string;
	docuInfo: string;
	docuMeta: any;
	docuName: string;
	docuId: number;
	pageNumber: number;
	convIntId: number;
};
export type TSession = {
	expires: string;
	provider: string;
	user: {
		email: string;
		image: string;
		name: string;
	};
};
export type TUserFromDB = {
	auth_id: string;
	auth_type: string;
	last_conv: number | null;
	last_login: string;
	profile_img: string;
	user_email: string;
	user_id: number;
	user_name: string;
};
