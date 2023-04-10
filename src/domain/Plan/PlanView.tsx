import { HeaderView } from "@/common/el/Header/HeaderView";
import { Color } from "@/common/theme/colors";
import { css } from "@emotion/react";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { PlanCard, PlanModels1, PlanModels2 } from "./el";
import { Mq, useCustomMediaQuery } from "@/common/theme/screen";
import { PcFooter } from "@/common/el/footer/PcFooter";

export const PlanView = () => {
  const title = {
    main: "가격안내",
    desc: "비즈니스 단계에 따라 합리적인 플랜을 선택하세요 ",
  };
  const { isSmall, isLarge } = useCustomMediaQuery();
  return (
    <div css={sx.root}>
      <HeaderView />
      <Stack
        alignItems="center"
        css={sx.content}
        gap={isSmall ? "20px" : "44px"}
      >
        <Stack alignItems="center" gap="20px">
          <Typography color={Color.WhiteText} variant="h1">
            {title.main}
          </Typography>
          <Typography
            color={Color.GrayText2}
            variant={isSmall ? "body2" : "h5"}
            textAlign="center"
          >
            {title.desc}
          </Typography>
        </Stack>
        <Stack direction="row" gap={isSmall ? "20px" : "40px"} css={sx.cards}>
          <PlanCard
            question="비즈니스 대화에도 돈이 든다고요?"
            title="무료플랜"
            models={PlanModels1}
          />
          <PlanCard
            question="비즈니스 대화에도 돈이 든다고요?"
            title="무료플랜"
            models={PlanModels2}
          />
        </Stack>
      </Stack>
      <PcFooter position={isLarge ? "absolute" : "fixed"} />
    </div>
  );
};

const sx = {
  root: css`
    position: relative;
    height: 100vh;
    width: 100%;
    background-image: url(/assets/bg/chat_bg.png);
    background-size: cover;
    background-position: center;
    padding-top: 62px;
    padding-bottom: 102px;
    @media ${Mq.lg} {
      height: 100%;
    }
    @media ${Mq.sm} {
      padding-bottom: 266px;
    }
  `,
  content: css`
    height: 100%;
    justify-content: center;

    @media ${Mq.lg} {
      padding: 40px;
    }
  `,
  cards: css`
    @media ${Mq.lg} {
      flex-direction: column;
    }
    @media ${Mq.sm} {
      width: 100%;
    }
  `,
};
