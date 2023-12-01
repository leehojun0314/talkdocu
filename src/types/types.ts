import formidable from 'formidable';
import { Session } from 'next-auth';
export type TProvider = 'naver' | 'google' | 'apple' | 'facebook' | 'kakao';
export type TStatus = 'created' | 'error' | 'deleted' | 'analyzing';

export type TExtendedSession =
	| (Session & {
			provider?: TProvider;
	  })
	| null;
// export interface TExtendedSession extends Session {
// 	provider?: TProvider;

// }
export interface TExtendedAuthData extends Session {
	provider?: TProvider | undefined;
}
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
export type TConversation = {
	id: number;
	conversation_name: string;
	end_time: number | null;
	created_at: string | null;
	fileUrl: string;
	salutation: string;
	user_id: number;
	status: 'created' | 'analyzing' | 'error';
	conversation_id: string;
};
export type TQuestion = {
	conversation_id: number;
	question_content: string;
	question_id: number;
	question_order: number;
};
export type TMessage =
	// | {
	// 		conversation_id: number;
	// 		create_time: number | null;
	// 		message: string;
	// 		message_id: number;
	// 		message_order: number;
	// 		sender: 'assistant' | 'user';
	// 		user_id: number;
	// 		is_question: 0 | 1;
	// 		question_doc_name: string | null;
	//   }
	{
		message: string;
		message_id: number;
		sender: 'assistant' | 'user';
		is_question: 0 | 1;
		question_doc_name: string | null;
	};
export type TDocument = {
	conversation_id: number;
	document_id: number;
	document_name: string;
	document_size: string;
	document_url: string;
};
export type TReferenceDoc = {
	page: number;
	documentName: string;
};
export type TOptionDialog = {
	isOpen: boolean;
};
export type TChatMode = 'QA' | 'Debate';
export type TDebate = {
	debate_id: number;
	question_id: number;
	answer_id: number;
	refer_content: string;
	question_content: string;
	answer_content: string;
};
export type TDebateMessage = {
	id: number;
	content: string;
	sender: 'assistant' | 'user';
	time: number | null | undefined;
	debate_id: number;
	conversation_id: number | string | undefined;
	// user_id: number | undefined;
};
export type TExistFile = {
	file: TDocument;
	status: 'exist' | 'delete';
};
import { type Message } from 'ai/react';
export type TExtendedMessage = Message & {
	id: string;
	isQuestion: number;
	question_doc_name: string;
};
