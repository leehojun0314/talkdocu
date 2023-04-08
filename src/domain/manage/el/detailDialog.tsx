import { Button, Dialog, Stack, Typography } from "@mui/material";
import { css } from "@emotion/react";
import closeIcon from "@/assets/icons/close.png";
import Image from "next/image";
import { Color } from "@/common/theme/colors";
import { detailModels } from "./model";
import edit from "@/assets/icons/edit.png";
import trash from "@/assets/icons/trash.png";
import { Mq, useCustomMediaQuery } from "@/common/theme/screen";

type DetailDialogType = {
  open: boolean;
  onClose: () => void;
  handleEditOpen: () => void;
  handleDeleteOpen: () => void;
};

export const DetailDialog = ({
  open,
  onClose,
  handleEditOpen,
  handleDeleteOpen,
}: DetailDialogType) => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <Dialog open={open} fullWidth css={sx.root}>
      <div css={sx.dialog}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb="40px"
        >
          <Typography variant={isSmall ? "h5" : "h2"}>{"파일 상세"}</Typography>
          <Button onClick={onClose} css={sx.closeIcon}>
            <Image
              src={closeIcon}
              alt="close"
              width={isSmall ? 24 : 48}
              height={isSmall ? 24 : 48}
            />
          </Button>
        </Stack>
        <ul>
          {detailModels.map((it, index) => (
            <li css={sx.list} key={index}>
              <Typography variant="body2" color={Color.GrayText}>
                {it.title}
              </Typography>
              <Typography variant="body2" color={Color.BlackText}>
                {it.desc}
              </Typography>
            </li>
          ))}
        </ul>
        <Stack
          direction="row"
          mt={isSmall ? "40px " : "48px"}
          justifyContent="flex-end"
          gap={isSmall ? "0" : "48px"}
        >
          <Button onClick={handleEditOpen}>
            <Stack
              direction="row"
              gap={isSmall ? "10px" : "13px"}
              alignItems="center"
            >
              <Image src={edit} alt="edit" width={24} height={24} />
              <Typography
                color={Color.Navy}
                variant={isSmall ? "body2" : "body1"}
              >
                {isSmall ? "" : "수정하기"}
              </Typography>
            </Stack>
          </Button>
          <Button onClick={handleDeleteOpen}>
            <Stack
              direction="row"
              gap={isSmall ? "10px" : "13px"}
              alignItems="center"
            >
              <Image src={trash} alt="edit" width={24} height={24} />
              <Typography
                color={Color.BrandMain}
                variant={isSmall ? "body2" : "body1"}
              >
                {isSmall ? "" : "삭제하기"}
              </Typography>
            </Stack>
          </Button>
        </Stack>
      </div>
    </Dialog>
  );
};

const sx = {
  root: css``,
  dialog: css`
    width: 100%;
    padding: 60px;
    @media ${Mq.sm} {
      padding: 40px;
    }
  `,
  closeIcon: css`
    min-width: fit-content;
    padding: 0;
  `,
  list: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 20px;
    border-bottom: solid 1px ${Color.LightGrayText};
    @media ${Mq.sm} {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `,
};
