import { Color } from "@/common/theme/colors";
import { Mq } from "@/common/theme/screen";
import { css } from "@emotion/react";
import { SectionLayout2 } from "../el/SectionLayout2";

export const SecondSection = () => {
  const desc = "워크 스페이스에서도\n활용할 수 있는 AI 채팅 입니다.";
  return (
    <div css={sx.root}>
      <div css={sx.inner}>
        <SectionLayout2 desc={desc} />
      </div>
    </div>
  );
};

const sx = {
  root: css`
    background-color: ${Color.backgroundGray};
  `,
  inner: css`
    width: 1000px;
    margin: 0 auto;
    @media ${Mq.xl} {
      width: 90%;
    }
  `,
};
