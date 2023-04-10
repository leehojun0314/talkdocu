import { Color } from "@/common/theme/colors";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { css } from "@emotion/react";
import { Mq, useCustomMediaQuery } from "@/common/theme/screen";

export type SectionLayoutType = { desc: string };

export const SectionLayout1 = ({ desc }: SectionLayoutType) => {
  const text = {
    desc: "For Students For Students For Students For Students For StudentsFor Students For Students For Students For Students For StudentsFor Students For Students For Students For Students For StudentsFor Students For Students For Students For Students For Students ",
  };
  const { isSmall } = useCustomMediaQuery();
  return (
    <Stack css={sx.root}>
      <Typography
        variant={isSmall ? "h5" : "h2"}
        color={Color.BlackText}
        textAlign="center"
      >
        {"나만의 위한 AI 채팅 봇을 설정해보세요."}
      </Typography>
      <Stack direction="row" css={sx.content}>
        <Accordion css={sx.accordion}>
          <AccordionSummary
            css={sx.summary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography color={Color.BlackText} variant="body2">
              {" For Students"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails css={sx.detail}>
            <Typography color={Color.GrayText} css={sx.desc}>
              {text.desc}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Typography
          whiteSpace="pre-wrap"
          color={Color.GrayText}
          variant={isSmall ? "body2" : "body1"}
        >
          {desc}
        </Typography>
      </Stack>
    </Stack>
  );
};

const sx = {
  root: css`
    padding: 100px 0;
    @media ${Mq.sm} {
      padding: 40px;
    }
  `,
  content: css`
    height: 190px;
    margin-top: 100px;
    gap: 100px;
    align-items: center;
    @media ${Mq.sm} {
      flex-direction: column-reverse;
      text-align: center;
      height: auto;
      gap: 40px;
      margin-top: 40px;
    }
  `,
  accordion: css`
    width: 400px;
    border: solid 1px ${Color.GrayText2};
    @media ${Mq.sm} {
      width: 100%;
    }
  `,
  summary: css`
    border-bottom: solid 1px #f7f7f7;
  `,
  detail: css`
    padding: 20px;
  `,
  desc: css`
    font-size: 12px !important;
    text-align: left;
  `,
};
