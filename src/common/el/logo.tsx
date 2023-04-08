import { css } from "@emotion/react";

import { Typography } from "@mui/material";
import Link from "next/link";
import { Color } from "../theme/colors";

export const Logo = () => {
  return (
    <>
      <Link href="/upload">
        <div css={sx.logo}>
          <div css={sx.logoImg}></div>
          <Typography color={Color.WhiteText} variant="body1">
            DrawBy
          </Typography>
        </div>
      </Link>
    </>
  );
};

const sx = {
  logo: css`
    display: flex;
    gap: 10px;
  `,
  logoImg: css`
    width: 30px;
    height: 30px;
    background-color: #fff;
    border-radius: 50%;
  `,
};

export const PurpleLogo = () => {
  return (
    <>
      <div css={sx.logo}>
        <div css={ppl.logoImg}></div>
        <Typography color={Color.BrandMain} variant="body1">
          DrawBy
        </Typography>
      </div>
    </>
  );
};

const ppl = {
  logoImg: css`
    width: 30px;
    height: 30px;
    background-color: ${Color.BrandMain};
    border-radius: 50%;
  `,
};
