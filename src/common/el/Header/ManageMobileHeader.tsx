import { PurpleLogo } from "../logo";
import Image from "next/image";
import { css } from "@emotion/react";
import menu_black from "@/assets/icons/menu_black.png";
import { Button } from "@mui/material";
import { MobileMenu } from "../mobileMenu";
import { useState } from "react";
import Link from "next/link";

export const ManageMobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleClickOpen = () => {
    setMenuOpen(true);
  };
  const handleClose = () => {
    setMenuOpen(false);
  };
  return (
    <div css={sx.root} className="headerBg">
      <MobileMenu open={menuOpen} onClose={handleClose} />
      <PurpleLogo />

      <Button onClick={handleClickOpen}>
        <Image src={menu_black} alt="menu" width={24} height={24} />
      </Button>
    </div>
  );
};

const sx = {
  root: css`
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    padding: 16px;
    width: 100%;
    align-items: center;
    z-index: 55;
    &.headerBg {
      background-color: #fff;

      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    }
  `,
};
