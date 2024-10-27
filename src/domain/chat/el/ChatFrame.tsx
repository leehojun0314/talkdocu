import getConfig from 'next/config';
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import menu from '@/assets/icons/menu.png';
import send from '@/assets/icons/send.png';
import React, { RefObject, useState } from 'react';
import { Mq, useCustomMediaQuery } from '@/common/theme/screen';
import { ConversationDialog } from './ConversationDialog';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { TChatMode, TConversation } from '@/types/types';
import Speech from './Speech';
import TuneIcon from '@mui/icons-material/Tune';
type TChatFrame = {
  children: React.ReactElement;
  conversation: TConversation | undefined;
  input: string;
  setInput: (content: string) => void;
  handleSubmit: (input: string) => void;
  isLoading: boolean;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  messageBoxRef: RefObject<HTMLDivElement>;
  handleOptionClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  chatMode: 'QA' | 'Debate';
  handleChatMode: (
    chatMode: TChatMode,
  ) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
  toggleAdd: () => void;
  handleConvDiaOpen: () => void;
};

export const ChatFrame = ({
  children,
  conversation,
  input,
  setInput,
  handleSubmit,
  isLoading,
  handleScroll,
  messageBoxRef,
  handleOptionClick,
  chatMode,
  handleChatMode,
  toggleAdd,
  handleConvDiaOpen,
}: TChatFrame) => {
  // const { isLarge } = useCustomMediaQuery();
  return (
    <Stack css={sx.chat(chatMode)}>
      {/* <UploadDialog open={open} onClose={handleClose}></UploadDialog> */}

      <Stack css={sx.topChat} direction='row' justifyContent='space-between'>
        <Stack direction='row' alignItems='center' gap='13px'>
          <Button css={sx.menuBtn} onClick={handleConvDiaOpen}>
            <Image src={menu} alt='menu' width={18} height={18} />
          </Button>
          <Typography color={Color.WhiteText}>
            {conversation?.conversation_name}
          </Typography>
        </Stack>
        <div css={sx.optionBtn} onClick={handleOptionClick}>
          <TuneIcon fontSize='medium' />
        </div>
        {/* <Stack
					style={{
						display: 'flex',
						flexDirection: 'row',
					}}
				> */}

        {/* <Stack
						style={{
							justifyContent: 'center',
							marginRight: '10px',
						}}
					>
						<select css={sx.chatModeSelect}>
							<option>Document Analysis</option>
							<option>Conversation Inference</option>
						</select>
					</Stack> */}
        {/* <Stack
						alignItems={'center'}
						justifyContent={'center'}
						style={{
							marginRight: '20px',
						}}
					>
						<Typography color={Color.WhiteText}>
							ID : {conversation?.conversation_id}
						</Typography>
					</Stack> */}
        {/* <Button css={sx.pdfButton}>
						<a href={conversation?.fileUrl} target={'_blank'}>
							<Stack
								css={sx.openFile}
								direction='row'
								alignItems='center'
								gap='12px'
							>
								{isSmall ? null : (
									<Typography color={Color.WhiteText}>
										{'PDF Viewer'}
									</Typography>
								)}
								<Image
									src={openIcon}
									alt='open'
									width={16}
									height={16}
								/>
							</Stack>
						</a>
					</Button> */}
        {/* </Stack> */}
      </Stack>
      {/* {isLarge && (
				<GoogleAd
					client={publicRuntimeConfig.ADSENSE_CLIENT}
					slot={publicRuntimeConfig.ADSENSE_SLOT}
					format='auto'
					responsive='true'
					height='100px'
				/>
			)}
		 */}
      <div
        css={sx.chatContent}
        // onScroll={handleScroll}
        onWheel={handleScroll}
        ref={messageBoxRef}
        id='chatScrollBox'
      >
        {/* <div css={sx.chatContent} onScroll={handleScroll}> */}
        {children}
      </div>
      <div css={sx.chatBottom}>
        <Button css={sx.addButton} onClick={toggleAdd}>
          <PostAddIcon
            style={{
              width: '24px',
              height: '24px',
              color: Color.WhiteText,
            }}
            fontSize='large'
          />
        </Button>
        <TextField
          css={sx.message}
          multiline
          variant='standard'
          placeholder='Please input your question here'
          InputProps={{
            disableUnderline: true,
            style: { color: 'white' },
          }}
          value={input}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter') {
              console.log('input : ', input.length);
              if (!input.length) {
                return;
              }
              if (!isLoading) {
                handleSubmit(input);
                setInput('');
              }
            }
          }}
          onChange={(evt) => {
            if (!isLoading) {
              const text = evt.currentTarget.value;
              setInput(text);
            }
          }}
          disabled={isLoading}
        />
        <Button
          css={sx.sendbtn}
          onClick={() => {
            if (!input.length) {
              return;
            }
            if (!isLoading) {
              handleSubmit(input);
              setInput('');
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress
              size={20}
              style={{
                color: Color.WhiteText,
              }}
            />
          ) : (
            <div css={sx.send}>
              <Image src={send} alt='send' width={24} height={24} />
            </div>
          )}
        </Button>
        <Speech />
      </div>
    </Stack>
  );
};

const sx = {
  // chat: css`
  // 	/* flex: 2; */
  // 	max-width: 1000px;
  // 	/* margin: 0 auto; */
  // 	height: calc(100vh - 70px);
  // 	/* for ani */
  // 	position: absolute;
  // 	transition: transform 0.2s ease;
  // `,
  chat: (chatMode: 'QA' | 'Debate') => {
    return css`
      /* flex: 2; */
      max-width: 1024px;
      min-width: 100%;
      /* margin: 0 auto; */
      height: calc(100vh - 70px);
      /* for ani */
      position: absolute;
      transition: transform 0.2s ease;
      transform: ${chatMode === 'QA' ? '' : 'translateX(-100%)'};
    `;
  },
  topChat: css`
    border: solid 1px #fff;
    padding-left: 10px;
    padding-right: 5px;
    height: 64px;
  `,
  menuBtn: css`
    min-width: 45px;
    height: 35px;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,
  pdfButton: css`
    padding: 0;
    min-width: fit-content;
    &:hover {
      background-color: transparent;
    }
  `,
  openFile: css`
    border-left: solid 1px #fff;
    height: 100%;
    padding: 17px 20px 17px 20px;
  `,
  chatContent: css`
    padding: 60px;
    border-left: solid 1px #fff;
    border-right: solid 1px #fff;
    overflow-y: scroll;
    height: 100%;
    /* min-width: 100%; */
    width: 100%;
    ::-webkit-scrollbar {
      background-color: transparent;
      width: 20px;
    }
    ::-webkit-scrollbar-thumb {
      border: 7px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
      border-radius: 999px;
      background-color: rgba(255, 255, 255, 0.6);
    }

    @media ${Mq.sm} {
      padding: 40px 20px 120px 20px;
    }
  `,
  chatBottom: css`
    border: solid 1px #fff;
    /* padding-left: 5px; */
    display: grid;
    grid-template-columns: 64px auto 64px 64px;
    grid-template-rows: auto;
    min-height: 64px;
  `,
  addButton: css`
    min-width: fit-content;
    padding: 0;
    border-right: solid 1px #fff;
    border-radius: 0;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,
  message: css`
    width: 100%;
    outline: none;
    padding-right: 20px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  `,
  send: css`
    padding: 20px;
    height: 100%;
    border-left: solid 1px #fff;
    border-right: solid 1px #fff;
    width: 63.99px;
    flex: 1;
    display: flex;
    align-items: center;
  `,
  sendbtn: css`
    min-width: fit-content;
    padding: 0;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,

  optionBtn: css`
    display: flex;
    min-width: 45px;
    justify-content: center;
    align-items: center;
    color: ${Color.WhiteText};
    padding: 6px;
    margin: 7px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: ${Color.hoverDark};
    }
    transition: 250ms;
  `,
};
