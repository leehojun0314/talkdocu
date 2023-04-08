import { Mq } from "@/common/theme/screen";
import { css } from "@emotion/react";
import { SectionLayout1 } from "../el/SectionLayout1";

export const FirstSection = () => {
  const desc =
    "논문이 읽기가 힘들고 에세이 작성이 힘드신가요?\nAI 채팅한테 물어보세요.";
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
