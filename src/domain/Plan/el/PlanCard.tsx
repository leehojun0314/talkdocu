import { css } from "@emotion/react";
import { Stack, Typography } from "@mui/material";
import check from "@/assets/icons/check_gray.png";
import Image from "next/image";
import { Color } from "@/common/theme/colors";
import { Mq, useCustomMediaQuery } from "@/common/theme/screen";

type PlanCardType = {
  question: string;
  title: string;
  models: string[];
};

export const PlanCard = ({ question, title, models }: PlanCardType) => {
  const { isSmall, isExtraSmall } = useCustomMediaQuery();
  return (
    <Stack css={sx.card} gap="20px">
      <Typography
        variant={isExtraSmall ? "subtitle1" : "body1"}
        color={Color.GrayText}
      >
        {question}
      </Typography>
      <Typography variant={isExtraSmall ? "h5" : "h2"}>{title}</Typography>
      <Stack css={sx.planContent} pb="20px" gap="10px">
        {models.map((it, index) => (
          <Stack direction="row" key={index}>
            <Image
              src={check}
              alt="check"
              width={isSmall ? 18 : 24}
              height={isSmall ? 18 : 24}
            />
            <Typography
              variant={isExtraSmall ? "subtitle1" : "body1"}
              color={Color.GrayText4}
            >
              {it}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Typography variant={isExtraSmall ? "subtitle2" : "h2"} css={sx.free}>
        무료
      </Typography>
    </Stack>
  );
};

const sx = {
  card: css`
    background-color: #fff;
    padding: 40px;
    width: 480px;
    border-radius: 20px;

    @media ${Mq.sm} {
      width: 100%;
      padding: 20px;
    }
  `,
  planContent: css`
    border-bottom: solid 1px ${Color.GrayText2};
  `,
  free: css`
    display: flex;
    justify-content: end;
  `,
};
