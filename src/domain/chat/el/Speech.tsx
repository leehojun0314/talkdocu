import {
  Button,
  CircularProgress,
  css,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import microphone from '@/assets/icons/microphone_white.svg';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { Color } from '@/common/theme/colors';
import { TSpeechMode } from '@/types/types';
import ModeIndicator from './ModeIndicator';
import { useRouter } from 'next/router';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { visualizerOptions } from '@/config';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import useDeviceDetect from '../hooks/useDeviceDetect';
export default function Speech() {
  const router = useRouter();
  const [isSpeechOpen, setSpeechOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<TSpeechMode>('listening');
  const [isListening, setIsListening] = useState<boolean>(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const visualizerRef = useRef<HTMLDivElement | null>(null);
  const [analyzer, setAnalyzer] = useState<AudioMotionAnalyzer | null>(null);
  useState<MediaStreamAudioDestinationNode>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { browserSupportsSpeechRecognition, transcript, resetTranscript } =
    useSpeechRecognition();
  const currentDevice = useDeviceDetect();
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null); // 소스 노드 추적용 ref 추가

  useEffect(() => {
    if (router.isReady && visualizerRef.current && audio) {
      const an = new AudioMotionAnalyzer(
        visualizerRef.current,
        visualizerOptions,
      );
      setAnalyzer(an);
      if (!sourceRef.current) {
        const source = an.connectInput(audio);
        sourceRef.current = source;
      }
      return () => {
        an.disconnectInput(sourceRef.current);
      };
    }
  }, [visualizerRef, router, audio]);
  useEffect(() => {
    // const newRecognition =
    // new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    // newRecognition.onresult = onRecognition;
    // newRecognition.onspeechend = onSpeechEnd;

    // newRecognition.continuous = true;

    // setRecognition(newRecognition);
    if (router.isReady) {
      const recognition = SpeechRecognition.getRecognition();
      if (recognition) {
        recognition.onspeechend = onSpeechEnd;
      }

      const newAudio = new Audio();
      newAudio.onended = onAISpeakEnd;
      newAudio.onplaying = onAIStartSpeaking;
      setAudio(newAudio);
    }
  }, [router]);

  const handleClose = useCallback(() => {
    setSpeechOpen(false);
    dialogRef.current?.close();
    if (mode === 'speaking') {
      if (audio && !audio.paused) {
        audio.pause();
      }
      if (isLoading) {
        setIsLoading(false);
      }
      setMode('listening');
    }
    setIsListening(false);
  }, [dialogRef, audio, mode, isLoading]);
  const handleOpen = useCallback(() => {
    // console.log('recognition: ', recognition);
    console.log(
      'browser support recognition: ',
      browserSupportsSpeechRecognition,
    );
    if (browserSupportsSpeechRecognition) {
      setSpeechOpen(true);
      dialogRef.current?.showModal();
    } else {
      window.alert('The browser does not support recognition api.');
    }
  }, [browserSupportsSpeechRecognition]);
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
        },
        video: false,
      });
      const micStream = analyzer?.audioCtx.createMediaStreamSource(stream);
      analyzer?.connectInput(micStream as MediaStreamAudioSourceNode);
      analyzer?.disconnectOutput();
      console.log('mic connected');
      return () => {
        stream.getAudioTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });

        analyzer?.disconnectInput(micStream);
        analyzer?.connectOutput();
        console.log('mic disconnected');
      };
    } catch (error) {
      console.log('get user media error:', error);
      window.alert('Error getting user media.');
      return () => {
        console.log('error return');
      };
    }
  }, [analyzer]);
  const getDisplayMedia = useCallback(
    async (prompt: string) => {
      const streamUrl = `${window.location.origin}/api/ai/speech?prompt=${prompt}&convStringId=${router.query.convId}`;
      if (audio) {
        audio.src = streamUrl;
        audio.play();
      }
    },
    [audio, router],
  );

  const onSpeechEnd = useCallback(() => {
    console.log('on speech end');
    setIsListening(false);
    setIsLoading(true);
    setMode('speaking');
  }, []);

  const onAISpeakEnd = useCallback(() => {
    setMode('listening');
    setIsListening(true);
    resetTranscript();
  }, []);
  const onAIStartSpeaking = useCallback(() => {
    setIsLoading(false);
  }, []);
  const handleListening = useCallback(() => {
    console.log('handle listening : ', mode, isListening);
    if (mode === 'listening') {
      setIsListening(!isListening);
    }
  }, [isListening, mode]);
  useEffect(() => {
    if (isSpeechOpen) {
      switch (mode) {
        case 'listening': {
          if (!audio) return;
          if (!isListening) return;

          console.log('start recognition');
          SpeechRecognition.startListening()
            .then((res) => {
              console.log('start recognition res: ', res);
            })
            .catch((err) => {
              console.log('start listening error: ', err);
              window.alert('Error occured on recognizing speech.');
            });
          let stopTrack: Promise<() => void>;
          if (currentDevice.isDesktop()) {
            stopTrack = getUserMedia();
          }

          return () => {
            if (stopTrack) {
              stopTrack
                .then((response) => {
                  console.log('track stoped');
                  response();
                })
                .catch((err) => {
                  console.log('stop track err: ', err);
                });
            }

            SpeechRecognition.abortListening().then(() => {
              console.log('stop recognition: ');
            });
          };
        }
        case 'speaking': {
          if (transcript) {
            getDisplayMedia(transcript);
          } else {
            onAISpeakEnd();
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSpeechOpen,
    mode,
    audio,
    isListening,
    // recognition,
    browserSupportsSpeechRecognition,
    getDisplayMedia,
    getUserMedia,
  ]);
  return (
    <>
      <Button css={sx.micButton} onClick={handleOpen}>
        <Image src={microphone} alt='microphone icon' width={24} />
      </Button>
      <dialog
        open={isSpeechOpen}
        onClose={handleClose}
        css={sx.dialog}
        ref={dialogRef}
      >
        <DialogTitle sx={{ m: '0 auto', p: 2 }} id='customized-dialog-title'>
          Talk to Document test
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.action.active,
          }}
        >
          <CloseIcon />
        </IconButton>
        <div css={sx.content}>
          <ModeIndicator
            mode={mode}
            isListening={isListening}
            handleListening={handleListening}
          />

          {isLoading ? (
            <div css={sx.loading}>
              <CircularProgress
                size={24}
                color={'secondary'}
                style={{ marginTop: 40 }}
              />
            </div>
          ) : (
            ''
          )}

          <div
            id='visualizer'
            ref={visualizerRef}
            style={{
              width: 100,
              height: 100,
              display: isLoading ? 'none' : 'block',
            }}
          ></div>
          <div>{transcript ? <div>prompt: {transcript}</div> : ''}</div>
        </div>
      </dialog>
    </>
  );
}
const sx = {
  micButton: css`
    min-width: fit-content;
    padding: 0;
    border-radius: 0;
    &:hover {
      background-color: ${Color.hoverDark};
    }
  `,
  content: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* font-size: larger; */
  `,
  state: css``,
  dialog: css`
    top: 50px;
    border-radius: 25px;
    min-height: 260px;
    &::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
  `,
  loading: css`
    height: 100px;
  `,
  transcriptContainer: css``,
};
