import { Color } from '@/common/theme/colors';
import { Mq } from '@/common/theme/screen';
import { css } from '@emotion/react';
import { SectionLayout2 } from '../el/SectionLayout2';
import { Ttext } from '../UploadView';

export const SecondSection = ({ text }: { text: Ttext }) => {
	return (
		<div css={sx.root}>
			<div css={sx.inner}>
				<SectionLayout2 text={text} />
			</div>
		</div>
	);
};

const sx = {
	root: css`
		background-color: ${Color.backgroundGray};
	`,
	inner: css`
		width: 1000px;
		margin: 0 auto;
		@media ${Mq.xl} {
			width: 90%;
		}
	`,
};
