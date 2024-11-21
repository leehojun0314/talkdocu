import { PcFooter } from '@/common/el/footer/PcFooter';
import { useCustomMediaQuery } from '@/common/theme/screen';
import { css } from '@emotion/react';

import {
  FirstSection,
  MainSection,
  MobileMainSection,
  SecondSection,
  ThirdSection,
} from './sections';
import { enTexts } from './model/texts';
export type Ttext = {
  bigTitle: string;
  rightText: string;
  leftTitle: string;
  leftText: string;
};
export const UploadView = () => {
  const { isSmall } = useCustomMediaQuery();
  return (
    <div css={sx.root}>
      {isSmall ? <MobileMainSection /> : <MainSection />}
      <FirstSection text={enTexts[0]} />
      <SecondSection text={enTexts[1]} />
      <ThirdSection text={enTexts[2]} />
      <PcFooter position='relative' />
    </div>
  );
};

const sx = {
  root: css`
    height: 100%;
  `,
};
