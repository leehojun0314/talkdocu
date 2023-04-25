import { Mq } from '@/common/theme/screen';
import { css } from '@emotion/react';
import { SectionLayout1 } from '../el/SectionLayout1';
import { Ttext } from '../UploadView';

export const ThirdSection = ({ text }: { text: Ttext }) => {
	return (
		<div>
			<div css={sx.inner}>
				<SectionLayout1 text={text} />
			</div>
		</div>
	);
};

const sx = {
	inner: css`
		width: 1000px;
		margin: 0 auto;
		@media ${Mq.xl} {
			width: 90%;
		}
	`,
};
