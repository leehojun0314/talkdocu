import { Button, Dialog, Stack, Typography } from "@mui/material";
import Image from "next/image";
import closeIcon from "@/assets/icons/close.png";
import check from "@/assets/icons/check.png";
import { Color } from "@/common/theme/colors";
import { useCustomMediaQuery } from "@/common/theme/screen";
type DeleteDialog = {
  open: boolean;
  onClose: () => void;
};

export const DeleteDialog = ({ open, onClose }: DeleteDialog) => {
  const main = {
    msg: "FileName.pdf 을(를) 정말 삭제하시겠어요?\n삭제 이후에는 복구가 불가능해요.",
  };
  const { isSmall } = useCustomMediaQuery();
  return (
    <Dialog open={open} fullWidth>
      <Stack p={isSmall ? "40px" : "60px"}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant={isSmall ? "h5" : "h2"}>{"파일 삭제"}</Typography>
          <Button onClick={onClose}>
            <Image
              src={closeIcon}
              alt="close"
              width={isSmall ? 24 : 48}
              height={isSmall ? 24 : 48}
            />
          </Button>
        </Stack>
        <Typography variant="body2" color={Color.GrayText} my="40px">
          {main.msg}
        </Typography>
        <Stack direction="row" gap="10px" justifyContent="flex-end">
          <Image src={check} alt="check" width={24} height={24} />
          <Typography variant="body2" color={Color.Navy}>
            {"삭제하기"}
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
};
