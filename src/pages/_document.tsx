import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='ko'>
			<Head>
				<link
					rel='shortcut icon'
					type='image/png'
					href='/assets/images/logo_purple.png'
				/>
				<meta
					name='description'
					content='이 채팅 애플리케이션은 사용자가 업로드한 파일을 AI가 분석하고 이해하여, 사용자의 질문에 정확하게 답변해주는 서비스입니다. 파일 관련 전문 지식을 필요로 하는 모든 사용자에게 이상적인 솔루션을 제공합니다.'
				/>
				<meta
					name='keywords'
					content='PDF, 대화, talkpdf, AI, GPT, CHATGPT, 인공지능, 파일 분석, 요약, Summary, 문서 이해, 질문 답변, AI 파일 도움, Openai, GPT-4, 채팅봇, chatting bot'
				/>
				<meta http-equiv='Content-Type' content='text/html;charset=UTF-8' />
				<meta http-equiv='X-UA-Compatible' content='ie=edge' />
				<meta name='author' content='Leehojun' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
