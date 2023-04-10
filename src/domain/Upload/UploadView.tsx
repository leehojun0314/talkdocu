import { PcFooter } from "@/common/el/footer/PcFooter";
import { useCustomMediaQuery } from "@/common/theme/screen";
import { css } from "@emotion/react";

import {
  FirstSection,
  MainSection,
  MobileMainSection,
  SecondSection,
  ThirdSection,
} from "./sections";

export const UploadView = () => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <div css={sx.root}>
      {isSmall ? <MobileMainSection /> : <MainSection />}
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <PcFooter position="relative" />
    </div>
  );
};

const sx = {
  root: css`
    height: 100%;
  `,
};
