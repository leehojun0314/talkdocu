import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import closeIcon from "@/assets/icons/close.png";
import { Color } from "@/common/theme/colors";
import { css } from "@emotion/react";
import check from "@/assets/icons/check.png";
import { useCustomMediaQuery } from "@/common/theme/screen";
type EditDialogType = {
  open: boolean;
  onClose: () => void;
};

export const EditDialog = ({ open, onClose }: EditDialogType) => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <Dialog open={open} fullWidth>
      <Stack p={isSmall ? "40px " : "60px"}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant={isSmall ? "h5" : "h2"}>
            {"파일명 수정"}
          </Typography>
          <Button onClick={onClose}>
            <Image
              src={closeIcon}
              alt="close"
              width={isSmall ? 24 : 48}
              height={isSmall ? 24 : 48}
            />
          </Button>
        </Stack>
        <Stack my="40px" css={sx.fileName} gap="6px">
          <Typography color={Color.GrayText} variant="body2">
            {"신규 파일명"}
          </Typography>

          <TextField
            variant="standard"
            placeholder="FileName.pdf"
            InputProps={{
              disableUnderline: true,
            }}
          />
        </Stack>
        <Stack direction="row" gap="10px" justifyContent="flex-end">
          <Image src={check} alt="check" width={24} height={24} />
          <Typography variant="body2" color={Color.Navy}>
            수정하기
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
};

const sx = {
  fileName: css`
    border-bottom: solid 1px ${Color.LightGrayText};
  `,
};
