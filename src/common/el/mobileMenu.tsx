import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { css } from "@emotion/react";
import { Logo } from "./logo";
import Link from "next/link";
import close from "@/assets/icons/close.svg";
import Image from "next/image";
import { Color } from "../theme/colors";

type MobileMenuType = {
  open: boolean;
  onClose: () => void;
};

export const MobileMenu = ({ open, onClose }: MobileMenuType) => {
  const MenuModels = [
    { name: "업로드", href: "/upload" },
    { name: "채팅", href: "/chat" },
    { name: "PDF관리", href: "/manage" },
    { name: "요금제", href: "/plan" },
  ];
  return (
    <Dialog open={open} fullScreen>
      <div css={sx.root}>
        <Stack direction="row" justifyContent="space-between">
          <Link href="/upload">
            <Logo />
          </Link>
          <Button onClick={onClose} css={sx.button}>
            <Image src={close} alt="close" width={24} height={24} />
          </Button>
        </Stack>
        <Stack css={sx.nav}>
          {MenuModels.map((it, index) => (
            <Link href={it.href} onClick={onClose} key={index}>
              <Typography color={Color.WhiteText} variant="h5">
                {it.name}
              </Typography>
            </Link>
          ))}
        </Stack>
      </div>
    </Dialog>
  );
};

const sx = {
  root: css`
    background-image: url(/assets/bg/chat_bg.png);
    height: 100%;
    padding: 16px;
  `,
  button: css`
    min-width: fit-content;
    padding: 0;
    &:hover {
      background-color: transparent;
    }
  `,
  nav: css`
    margin-top: 100px;
    gap: 40px;
    align-items: center;
  `,
};
