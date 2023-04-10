import { Pcheader } from "@/common/el/Header/PCheader";
import { Color } from "@/common/theme/colors";
import { css } from "@emotion/react";
import { Button, Stack, Typography } from "@mui/material";
import file from "@/assets/icons/file.png";
import pdf from "@/assets/icons/pdf.png";
import Image from "next/image";
import { Mq } from "@/common/theme/screen";

export const MainSection = () => {
  const text = {
    title: "AI 채팅과 함께 작업을 해보세요.",
    upload: "파일 업로드",
    desc: "파일을 드래그하여 업로드하거나, 아래 공간을 클릭해 파일을 선택해 주세요.",
    drag: "PDF 파일을 여기로 드래그하거나\n여기를 클릭해서 파일을 업로드해 주세요.",
    filename: "filename.pdf",
  };

  return (
    <div css={sx.root}>
      <Stack css={sx.inner}>
        <Pcheader />
        <Typography textAlign="center" color={Color.WhiteText} variant="h1">
          {text.title}
        </Typography>
        <div css={sx.dialog}>
          <Typography variant="h2" color={Color.BlackText} mb="16px">
            {text.upload}
          </Typography>
          <Typography variant="body2" color={Color.GrayText}>
            {text.desc}
          </Typography>
          <Stack css={sx.dashedBox}>
            <Image src={file} alt="file" width={20} height={11} />
            <Typography color={Color.BrandMain} css={sx.purpleText}>
              {text.drag}
            </Typography>
          </Stack>

          <Stack direction="row" gap="20px" alignItems="center">
            <Stack direction="row" gap="22px" css={sx.fileInput}>
              <Image src={pdf} alt="pdf" width={20} height={20} />
              <Typography variant="body2" color={Color.BrandMain}>
                {text.filename}
              </Typography>
            </Stack>
            <Button css={sx.button}>PDF 생성하기</Button>
          </Stack>
        </div>
      </Stack>
    </div>
  );
};

const sx = {
  root: css`
    background-image: url(/assets/bg/upload_bg.png);
    background-size: cover;
    background-position: center;
    height: 700px;
    padding-top: 62px;
  `,
  inner: css`
    max-width: 1000px;
    margin: 0 auto;
    justify-content: center;
    height: 100%;
    gap: 40px;
    @media ${Mq.xl} {
      padding-left: 60px;
      padding-right: 60px;
    }
  `,
  dialog: css`
    padding: 40px;
    background-color: #fff;
    border-radius: 20px;
  `,
  dashedBox: css`
    height: 160px;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23B13FDCFF' stroke-width='4' stroke-dasharray='22' stroke-dashoffset='32' stroke-linecap='square'/%3e%3c/svg%3e");
    border-radius: 10px;
    margin: 20px 0;
    align-items: center;
    justify-content: center;
    gap: 16px;
    cursor: pointer;

    background-color: ${Color.lightPurple};
  `,
  purpleText: css`
    font-size: 12px !important;
    text-align: center;
  `,
  fileInput: css`
    background-color: ${Color.lightPurple};
    width: 100%;
    padding: 13px;
    border-radius: 10px;
    align-items: center;
    height: 100%;
  `,
  button: css`
    color: #fff;
    background-color: ${Color.BrandMain};
    width: 128px;
    padding: 12px;
    font-size: 15px;
    border-radius: 10px;
    line-height: 26px;
    &:hover {
      background-color: ${Color.hoverBrandMain};
    }
  `,
};
