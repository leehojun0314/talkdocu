import { Button, Stack, Typography } from "@mui/material";
import { css } from "@emotion/react";
import { Color } from "@/common/theme/colors";
import Image from "next/image";
import profile from "@/assets/images/profile.png";
import { Mq } from "@/common/theme/screen";
type chatFromMeType = {
  textFromMe: string;
};

export const ChatFromMe = ({ textFromMe }: chatFromMeType) => {
  return (
    <Stack direction="row" gap="10px" css={sx.textFromMeWrap}>
      <Typography variant="body2" color={Color.BlackText} css={sx.textFromMe}>
        {textFromMe}
      </Typography>
      <Image src={profile} alt="profile" width={40} height={40} />
    </Stack>
  );
};

const sx = {
  textFromMe: css`
    background: ${Color.chatBackground};
    border-radius: 20px 0px 20px 20px;
    padding: 10px;
    max-width: 60%;
  `,
  textFromMeWrap: css`
    justify-content: flex-end;
    padding: 20px 0;
    @media ${Mq.sm} {
      padding: 10px 0;
    }
  `,
  chatFromaIWrap: css`
    padding: 20px 0;
    @media ${Mq.sm} {
      padding: 10px 0;
    }
  `,
  textFromAI: css`
    border-radius: 0px 20px 20px 20px;
    border: solid 1px ${Color.chatBackground};
    padding: 10px;
    max-width: 60%;
  `,
  questionBtn: css`
    justify-content: flex-start;
    text-align: left;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,
};

type ChatFromAIType = {
  textFromAI: string;
};
export const ChatFromAI = ({ textFromAI }: ChatFromAIType) => {
  return (
    <Stack direction="row" gap="10px" css={sx.chatFromaIWrap}>
      <Image src={profile} alt="profile" width={40} height={40} />
      <Typography variant="body2" color={Color.WhiteText} css={sx.textFromAI}>
        {textFromAI}
      </Typography>
    </Stack>
  );
};

type AIQuestionType = {
  textFromAI: string;
  questions: string[];
};

export const AIQuestion = ({ textFromAI, questions }: AIQuestionType) => {
  return (
    <Stack direction="row" gap="10px" css={sx.chatFromaIWrap}>
      <Image src={profile} alt="profile" width={40} height={40} />
      <Stack css={sx.textFromAI}>
        <Typography variant="body2" color={Color.WhiteText}>
          {textFromAI}
        </Typography>
        {questions.map((it, index) => (
          <Button key={index} css={sx.questionBtn}>
            <Typography variant="h4" color={Color.WhiteText}>
              {it}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};
