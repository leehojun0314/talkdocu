import {
  Button,
  Input,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Color } from "@/common/theme/colors";
import { css } from "@emotion/react";
import menu from "@/assets/icons/menu.png";
import openIcon from "@/assets/icons/openFile.png";
import send from "@/assets/icons/send.png";
import { blue } from "@mui/material/colors";
import { UploadDialog } from "./uploadDialog";
import { useState } from "react";
import { Mq, useCustomMediaQuery } from "@/common/theme/screen";

type ChatFrameType = {
  children: React.ReactElement;
};

export const ChatFrame = ({ children }: ChatFrameType) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { isSmall } = useCustomMediaQuery();

  return (
    <Stack css={sx.chat}>
      <UploadDialog open={open} onClose={handleClose}></UploadDialog>
      <Stack css={sx.topChat} direction="row" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap="13px">
          <Button css={sx.menuBtn} onClick={handleClickOpen}>
            <Image src={menu} alt="menu" width={18} height={18} />
          </Button>
          <Typography color={Color.WhiteText}>
            {"filename 와(과) AI 채팅 중"}
          </Typography>
        </Stack>
        <Button css={sx.pdfButton}>
          <Stack
            css={sx.openFile}
            direction="row"
            alignItems="center"
            gap="12px"
          >
            {isSmall ? null : (
              <Typography color={Color.WhiteText}>{"PDF 파일보기"}</Typography>
            )}
            <Image src={openIcon} alt="open" width={16} height={16} />
          </Stack>
        </Button>
      </Stack>
      <Stack css={sx.chatContent}>{children}</Stack>
      <div css={sx.chatBottom}>
        <TextField
          css={sx.message}
          multiline
          variant="standard"
          placeholder="메시지를 입력하세요."
          InputProps={{
            disableUnderline: true,
            style: { color: "white" },
          }}
        />
        <Button css={sx.sendbtn}>
          <div css={sx.send}>
            <Image src={send} alt="send" width={24} height={24} />
          </div>
        </Button>
      </div>
    </Stack>
  );
};

const sx = {
  chat: css`
    max-width: 1000px;
    margin: 0 auto;
    height: calc(100vh - 70px);
  `,
  topChat: css`
    border: solid 1px #fff;
    padding-left: 23px;
  `,
  menuBtn: css`
    min-width: 0;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,
  pdfButton: css`
    padding: 0;
    min-width: fit-content;
    &:hover {
      background-color: transparent;
    }
  `,
  openFile: css`
    border-left: solid 1px #fff;
    height: 100%;
    padding: 17px 20px 17px 20px;
  `,
  chatContent: css`
    padding: 60px;
    border-left: solid 1px #fff;
    border-right: solid 1px #fff;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      background-color: transparent;
      width: 20px;
    }
    ::-webkit-scrollbar-thumb {
      border: 7px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
      border-radius: 999px;
      background-color: rgba(255, 255, 255, 0.6);
    }

    @media ${Mq.sm} {
      padding: 40px 20px 120px 20px;
    }
  `,
  chatBottom: css`
    border: solid 1px #fff;
    padding-left: 20px;
    display: grid;
    grid-template-columns: auto 64px;
    grid-template-rows: auto;
  `,
  message: css`
    width: 100%;
    outline: none;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  `,
  send: css`
    padding: 20px;
    height: 100%;
    border-left: solid 1px #fff;
    width: 63.99px;
    flex: 1;
    display: flex;
    align-items: center;
  `,
  sendbtn: css`
    min-width: fit-content;
    padding: 0;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,
};
