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
import texts from './model/texts';
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
			<FirstSection text={texts[0]} />
			<SecondSection text={texts[1]} />
			<ThirdSection text={texts[2]} />
			<PcFooter position='relative' />
		</div>
	);
};

const sx = {
	root: css`
		height: 100%;
	`,
};
