import { PcFooter } from "@/common/el/footer/PcFooter";
import { ManageHeaderView } from "@/common/el/Header/manageHeaderView";
import { Color } from "@/common/theme/colors";
import { useCustomMediaQuery } from "@/common/theme/screen";
import { css } from "@emotion/react";
import { List, ListItem, Stack, Typography } from "@mui/material";

export const TermsView = () => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <div css={sx.root}>
      <ManageHeaderView />
      <Stack p={isSmall ? "20px" : "60px"} css={sx.dialog}>
        <Typography
          variant="h2"
          color={Color.BlackText}
          textAlign="center"
          mb="20px"
        >
          {"Terms"}
        </Typography>
        <List css={sx.terms}>
          <ListItem sx={{ mb: 1 }}>
            <Typography>
              1. Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <Typography>
              2.Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <Typography>
              3. Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <Typography>
              4. Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </ListItem>
          <ListItem sx={{ mb: 1 }}>
            <Typography>
              5. Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </ListItem>
        </List>
      </Stack>
      <PcFooter position={isSmall ? "relative" : "fixed"} />
    </div>
  );
};

const sx = {
  root: css`
    background-image: url(/assets/bg/chat_bg.png);
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100vh;
    padding-top: 62px;
  `,
  dialog: css`
    max-width: 1000px;
    background-color: #fff;
    border-radius: 20px;
    margin: 67px auto;
    height: calc(100vh - 300px);
  `,
  terms: css`
    overflow-y: auto;
    height: 100%;
  `,
};
