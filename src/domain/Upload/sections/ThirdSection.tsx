import { Mq } from "@/common/theme/screen";
import { css } from "@emotion/react";
import { SectionLayout1 } from "../el/SectionLayout1";

export const ThirdSection = () => {
  const desc = "원하는 질문과 파일은\n무엇이든 AI 채팅이 해결해줍니다.";
  return (
    <div>
      <div css={sx.inner}>
        <SectionLayout1 desc={desc} />
      </div>
    </div>
  );
};

const sx = {
  inner: css`
    width: 1000px;
    margin: 0 auto;
    @media ${Mq.xl} {
      width: 90%;
    }
  `,
};
