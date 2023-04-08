import { css } from "@emotion/react";
import { Color } from "@/common/theme/colors";
import { AIQuestion, ChatFromMe } from "./el/ChatText";
import { ChatFromAI } from "./el/ChatText";
import { ChatFrame } from "./el/ChatFrame";
import { HeaderView } from "@/common/el/Header/HeaderView";
import character from "@/assets/images/chat_chr.png";
import Image from "next/image";
import { QuestionModels } from "./el/model";

export const ChatView = () => {
  return (
    <div css={sx.root}>
      <Image
        css={sx.chr}
        src={character}
        alt="character"
        width={300}
        height={270}
      />
      <HeaderView />
      <ChatFrame>
        <div>
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
          <AIQuestion
            textFromAI="AI에게 질문해보세요 : "
            questions={QuestionModels}
          />
          <ChatFromMe
            textFromMe="가나다라마바사아자차카타파하 가나다라마바사아자차카타파하
가나다라마바사아자차카타파하."
          />
          <ChatFromAI
            textFromAI="가나다라마바사아자차카타파하 가나다라마바사아자차카타파하
가나다라마바사아자차카타파하."
          />
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
          <ChatFromAI textFromAI="오늘 날씨는 맑아요" />
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
          <ChatFromAI textFromAI="오늘 날씨는 맑아요" />
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
          <ChatFromAI textFromAI="오늘 날씨는 맑아요" />
          <ChatFromMe textFromMe="오늘 날씨 어때?" />
        </div>
      </ChatFrame>
    </div>
  );
};

const sx = {
  root: css`
    background-image: url(/assets/bg/chat_bg.png);
    background-size: cover;
    min-height: 100vh;
    background-position: center;
    padding-top: 70px;
    position: relative;
  `,
  chr: css`
    position: absolute;
    bottom: 6%;
    left: 78.698vw;
    @media (max-width: 1760px) {
      display: none;
    }
  `,
  chatBottom: css`
    border: solid 1px #fff;
    padding-left: 20px;
  `,
  message: css`
    &::placeholder {
      color: ${Color.WhiteText} !important;
    }
  `,
  send: css`
    padding: 20px;
    height: 100%;
    border-left: solid 1px #fff;
  `,
};
