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
					content='This chat application is a service that allows users to upload files, which will then be analyzed and understood by AI to accurately answer user questions. It provides an ideal solution for all users who require specialized knowledge related to files.'
				/>
				<meta
					name='keywords'
					content='PDF, 대화, talkpdf, AI, GPT, CHATGPT, 인공지능, 파일 분석, 요약, Summary, 문서 이해, 질문 답변, AI 파일 도움, Openai, GPT-4, 채팅봇, chatting bot, chatpdf, talkdocu, talk docu, chat with pdf, chat with document'
				/>
				<meta httpEquiv='Content-Type' content='text/html;charset=UTF-8' />
				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />
				<meta name='author' content='Leehojun' />
				{/* <script
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7554551043921031'
					crossOrigin='anonymous'
				></script> */}
				<script
					data-ad-client='ca-pub-7554551043921031'
					async
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
				></script>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
