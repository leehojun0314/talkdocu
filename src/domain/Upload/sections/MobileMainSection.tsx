import { MobileHeader } from "@/common/el";
import { Color } from "@/common/theme/colors";
import { css } from "@emotion/react";
import { Button, Stack, Typography } from "@mui/material";
import add from "@/assets/icons/add.png";
import Image from "next/image";
import pdf from "@/assets/icons/pdf_white.png";

export const MobileMainSection = () => {
  return (
    <div css={sx.root}>
      <MobileHeader />
      <Stack>
        <Stack direction="row" css={sx.uploadWrap}>
          <Stack gap="10px">
            <Typography variant="h5" color={Color.GrayText2}>
              {"파일 업로드"}
            </Typography>
            <Typography css={sx.desc} color={Color.GrayText2}>
              {"버튼을 클릭해 파일을 선택해 주세요."}
            </Typography>
          </Stack>
          <Image src={add} alt="add" width={42} height={42} />
        </Stack>
        <Stack direction="row" gap="22px" css={sx.fileInput}>
          <Image src={pdf} alt="pdf" width={24} height={24} />
          <Typography variant="body2" color={Color.WhiteText}>
            {"filename.pdf"}
          </Typography>
        </Stack>
        <Button css={sx.button}>PDF 생성하기</Button>
      </Stack>
    </div>
  );
};

const sx = {
  root: css`
    background-image: url("/assets/bg/upload_bg.png");

    background-position: center;
    position: relative;
    width: 100%;
    padding: 82px 20px 20px 20px;
  `,
  uploadWrap: css`
    justify-content: space-between;
  `,
  desc: css`
    font-size: 12px !important;
  `,
  fileInput: css`
    align-items: center;
    background: rgba(247, 235, 252, 0.5);
    padding: 12px;
    border-radius: 10px;
    margin: 20px 0;
  `,
  button: css`
    background-color: ${Color.BrandMain};
    color: #fff;
    height: 50px;
    &:hover {
      background-color: ${Color.hoverBrandMain};
    }
  `,
};
