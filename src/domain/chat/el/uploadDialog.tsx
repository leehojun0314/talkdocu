import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import closeIcon from "@/assets/icons/close.png";
import Image from "next/image";
import { css } from "@emotion/react";
import pdf from "@/assets/icons/pdf_black.png";
import { Color } from "@/common/theme/colors";
import time from "@/assets/icons/time.png";
import arrow from "@/assets/icons/arrowRight_purple.png";
import { documentModel } from "./model";
import { Mq, useCustomMediaQuery } from "@/common/theme/screen";

type UploadDialogType = {
  open: boolean;
  onClose: () => void;
};

export const UploadDialog = ({ open, onClose }: UploadDialogType) => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <Dialog open={open} fullWidth css={sx.root}>
      <div css={sx.dialog}>
        <Stack
          css={sx.title}
          direction="row"
          mb="4px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">{"문서목록"}</Typography>
          <Button onClick={onClose}>
            <Image
              src={closeIcon}
              alt="close"
              width={isSmall ? 24 : 48}
              height={isSmall ? 24 : 48}
            />
          </Button>
        </Stack>
        {documentModel.map((it, index) => (
          <Button key={index} onClick={onClose} css={sx.fileBtn}>
            <Stack direction="row" alignItems="center" css={sx.fileBtnInner}>
              <Stack gap="11px">
                <Stack direction="row" alignItems="center" gap="12px">
                  <Image src={pdf} alt="file" width={24} height={24} />
                  <Typography color={Color.BlackText} variant="body1">
                    {it.filename}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap="12px">
                  <Image src={time} alt="time" width={24} height={24} />
                  <Typography variant="body2" color={Color.GrayText}>
                    {it.time}
                  </Typography>
                </Stack>
              </Stack>
              <Image src={arrow} alt="arrow" width={36} height={36} />
            </Stack>
          </Button>
        ))}
      </div>
    </Dialog>
  );
};

const sx = {
  root: css`
    .MuiPaper-root {
      box-sizing: border-box;
      @media ${Mq.sm} {
        min-width: 90%;
      }
    }
  `,
  dialog: css`
    width: 100%;
    padding: 60px;
    @media ${Mq.md} {
      padding: 16px;
    }
  `,
  title: css`
    border-bottom: solid 1px ${Color.LightGrayText};
    padding-bottom: 20px;
  `,
  fileBtn: css`
    border-bottom: solid 1px ${Color.LightGrayText};
    padding: 20px 16px;
    display: block;
    width: 100%;
  `,
  fileBtnInner: css`
    justify-content: space-between;
  `,
};
