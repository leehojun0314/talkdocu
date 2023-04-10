import { Color } from "@/common/theme/colors";
import { Mq } from "@/common/theme/screen";
import { css } from "@emotion/react";
import { Typography } from "@mui/material";
import Link from "next/link";

type PcFooterType = {
  position: string;
};

export const PcFooter = ({ position }: PcFooterType) => {
  const navModels = [
    { name: "My Account", link: "javascript:void(0);" },
    { name: "Contact", link: "javascript:void(0);" },
    { name: "Terms", link: "/terms" },
    { name: "Twitter", link: "javascript:void(0);" },
    { name: "Pricing", link: "javascript:void(0);" },
  ];

  return (
    <div css={sx.root(position)}>
      <ul css={sx.inner}>
        {navModels.map((it, index) => (
          <li key={index}>
            <Link href={it.link}>
              <Typography color={Color.WhiteText} variant="subtitle1">
                {it.name}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
      <Typography
        textAlign="center"
        mt="20px"
        color={Color.WhiteText}
        variant="subtitle1"
      >
        Copyright Drawby
      </Typography>
    </div>
  );
};

const sx = {
  root: (position: string) => css`
    background: #b05fa5;
    padding: 20px 0;
    width: 100%;
    position: ${position};
    bottom: 0;
    left: 0;
    @media ${Mq.sm} {
      padding: 40px 0;
    }
  `,
  inner: css`
    max-width: 469px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    & li {
      display: flex;
      align-items: center;
    }
    & li:not(:last-child)::after {
      content: "·";
      margin: 0 29px;
      float: right;
      display: block;
      color: #fff;
      @media ${Mq.sm} {
        display: none;
      }
    }
    @media ${Mq.sm} {
      flex-direction: column;
      grid-gap: 10px;
      align-items: center;
    }
  `,
};
