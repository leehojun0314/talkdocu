import formidable from 'formidable';
import { Session } from 'next-auth';
export type TProvider = 'naver' | 'google' | 'apple' | 'facebook' | 'kakao';
export type TStatus = 'created' | 'error' | 'deleted' | 'analyzing';

export type TExtendedSession =
	| (Session & {
			provider?: TProvider;
			authId?: string;
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
	docuInfo?: string;
	docuMeta?: any;
	docuName: string;
	docuId: number;
	pageNumber: number;
	convIntId: number;
};
export type TParagraph_DB = {
	conversation_id: number;
	document_id: number;
	paragraph_content: string;
	paragraph_id: number;
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
	user_id: number;
	user_name: string;
	user_email: string;
	profile_img: string | null;
	auth_type: string | null;
	auth_id: string | null;
	last_login: Date | null;
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
export type TMessageFromDB = {
	conversation_id: number;
	create_time: number | null;
	message: string;
	message_id: number;
	message_order: number;
	sender: 'assistant' | 'user';
	user_id: number;
	is_question: 0 | 1;
	question_doc_name: string | null;
};

export type TDocument = {
	conversation_id: number;
	document_id: number;
	document_name: string;
	document_size: number;
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
	question: {
		message: string;
	};
	answer: {
		message: string;
	};
};
export type TDebateMessage = {
	id: number;
	content: string | null;
	sender: 'assistant' | 'user';
	time: Date;
	debate_id: number;
	conversation_id: number;
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
export type TStreamCallback = ({
	text,
	isEnd,
	error,
}: {
	text: string;
	isEnd: boolean;
	error?: unknown;
}) => Promise<void>;
export type TSender = 'user' | 'assistant';
export type TGrouped = { [docName: string]: number[] };
export type TSpeechMode = 'listening' | 'speaking';
