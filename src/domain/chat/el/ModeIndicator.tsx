import React, { useState } from 'react';
import { TSpeechMode } from '@/types/types';
import { css } from '@emotion/react';
import Image from 'next/image';
import microphone from '@/assets/icons/microphone_black.svg';
import speaker from '@/assets/icons/speaker.svg';
import { Color } from '@/common/theme/colors';
const ModeIndicator = ({
	mode,
	isListening,
	handleListening,
}: {
	mode: TSpeechMode;
	isListening: boolean;
	handleListening: () => void;
}) => {
	return (
		<div className='app' css={sx2.container}>
			<div className='indicator-container'>
				<div className={`indicator ${mode}`}>
					<span className='text'>Listening</span>
					<div
						className={`image-container ${
							isListening ? 'isListening' : ''
						} ${mode}`}
						onClick={handleListening}
					>
						<Image
							// src={mode === 'listening' ? microphone : speaker}
							src={microphone}
							alt='mode icon'
							width={20}
							height={20}
						/>
					</div>
					<span className='text'>Speaking</span>
				</div>
			</div>
		</div>
	);
};
const sx2 = {
	container: css`
		.app {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100vh;
			background-color: #f0f0f0;
		}

		.indicator-container {
			position: relative;
			width: 400px;
			height: 50px;
			display: flex;
			justify-content: space-between;
			/* border: 1px solid #000; */
			border-radius: 20px;
			box-sizing: content-box;
		}

		.text {
			width: 200px;
			text-align: center;
			line-height: 50px;
			position: relative;
			z-index: 1;
			font-size: 18px;
			color: ${Color.BlackText};
		}
		.indicator {
			display: flex;
			flex-direction: row;
			box-sizing: border-box;
		}

		.indicator::before {
			content: '';
			position: absolute;
			width: 200px;
			height: 50px;
			/* background-color: #de8fff; */
			/* background-color: ; */
			background: linear-gradient(to right, #de8fff, ${Color.WhiteText});
			transition: all 0.5s ease, background-color 0.5s ease;
			z-index: 0;
			border-radius: 19px 0 0 19px;
			box-sizing: border-box;
			left: 0;
		}

		.speaking::before {
			transform: translateX(200px);
			/* background-color: #f44336; */
			border-radius: 0 19px 19px 0;
			background: linear-gradient(to left, #de8fff, ${Color.WhiteText});
		}
		.image-container {
			width: 40px;
			height: 40px;
			position: absolute;
			left: calc(50% - 20px);
			top: 5px;
			background-color: ${Color.Red};
			box-shadow: 0 0 5px ${Color.Red}, 0 0 25px ${Color.Red};
			border: 1px solid black;
			border-radius: 24px;
			padding: 5px;
			transition: all 0.5s ease;
			z-index: 10;
		}
		.image-container.listening {
			cursor: pointer;
			&:hover {
				box-shadow: none;
			}
		}
		.image-container.speaking {
			cursor: progress;
		}

		.image-container.isListening {
			background-color: ${Color.blue};

			box-shadow: 0 0 5px ${Color.blue}, 0 0 25px ${Color.blue};
			&:hover {
				box-shadow: none;
			}
		}
		.image-container img {
			margin: 0;
			display: block;
			width: 100%;
			height: 28px;
		}

		button {
			margin-top: 20px;
			padding: 10px 20px;
			font-size: 16px;
			cursor: pointer;
			border: none;
			border-radius: 5px;
			background-color: #007bff;
			color: #fff;
			transition: background-color 0.3s ease;
		}

		button:hover {
			background-color: #0056b3;
		}
	`,
};

export default ModeIndicator;
