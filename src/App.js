import { Helmet } from "react-helmet";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faPlay,
  faForward,
  faPause,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

const Wrapper = styled.main`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
`;

const Container = styled.div`
  width: 450px;
  height: 430px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 50px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 40px;
  position: absolute;
  text-align: center;
  font-weight: bold;
  background: linear-gradient(to right top, #fab1a0, #e84393);
  color: transparent;
  background-clip: text;
  padding: 10px 0;
  top: 10px;
`;

const Musics = styled.ul`
  display: flex;
  gap: 150px;
`;

const Music = styled(motion.li)`
  width: 180px;
  height: 180px;
  background-color: black;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  font-size: 48px;
  span {
    font-size: 25px;
  }
`;

const MusicTitle = styled.h2`
  font-size: 19px;
  width: 300px;
  text-align: center;
`;

const MusicButtons = styled.div`
  display: flex;
  gap: 25px;
  align-items: center;
`;

const MusicButton = styled(FontAwesomeIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const MusicProgress = styled.input`
  width: 100%;
  height: 15px;
  accent-color: white;
  border: none;
  outline: none;
`;

const Slider = styled.div`
  width: 330px;
  display: flex;
  gap: 10px;
`;

const Time = styled.span``;

const musicVariants = {
  entry: (back) => ({
    x: back ? -300 : 300,
    opacity: 0,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
  exit: (back) => ({
    x: back ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.4 },
  }),
};

const MusicVolume = styled(motion.input)`
  height: 10px;
  accent-color: white;
  border: none;
  outline: none;
`;

const Volume = styled(motion.div)`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const VolumeVariants = {
  initial: {
    width: "0px",
    opacity: 0,
  },
  hover: {
    width: "100px",
    opacity: 1,
  },
};

function App() {
  const music_list = useMemo(
    () => [
      "The Chainsmokers - Closer ( cover by J.Fla ).mp3",
      "Taylor Swift - Look What You Made Me Do ( cover by J.Fla ).mp3",
      "Alan Walker - The Spectre ( cover by J.Fla ).mp3",
      "Alan Walker - Alone & Sing Me To Sleep ( MASHUP cover by J.Fla ).mp3",
      "Ed Sheeran - Shape Of You ( cover by J.Fla ).mp3",
      "Clean Bandit - Symphony.mp3",
      "Avicii - Wake Me Up ( cover by J.Fla ).mp3",
      "ILLENIUM, Anna Clendening - Broken Ones.mp3",
    ],
    []
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [music, setMusic] = useState(0);
  const [back, setBack] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const handleCurrentTimeChange = useCallback(() => {
    setCurrentTime(audio.currentTime);
  }, [setCurrentTime, audio]);
  useEffect(() => {
    if (!audio && music_list) {
      const audioFile = new Audio(`/musics/${music_list[music]}`);
      audioFile.volume = volume;
      audioFile.onloadedmetadata = function () {
        setAudio(audioFile);
      };
    }
  }, [music, setIsPlaying, music_list, volume, audio]);
  useEffect(() => {
    if (audio) {
      audio.addEventListener("timeupdate", handleCurrentTimeChange);
      return () => {
        if (audio) {
          audio.removeEventListener("timeupdate", handleCurrentTimeChange);
        }
      };
    }
  }, [audio, handleCurrentTimeChange]);
  const nextPlease = () => {
    if (music_list) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
      setBack(false);
      audio.currentTime = 0;
      setCurrentTime(0);
      setMusic((prev) => (prev === music_list.length - 1 ? 0 : prev + 1));
    }
  };
  const prevPlease = () => {
    if (music_list) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
      setBack(true);
      audio.currentTime = 0;
      setCurrentTime(0);
      setMusic((prev) => (prev === 0 ? music_list.length - 1 : prev - 1));
    }
  };
  const onPlay = useCallback(() => {
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      setIsPlaying(!audio.paused);
    }
  }, [audio]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        onPlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPlay]);
  return (
    <>
      <Helmet>
        <title>Music App</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <Wrapper>
        <Container>
          <Title>Music App</Title>
          <Musics>
            <AnimatePresence initial={false} mode="popLayout" custom={back}>
              <Music
                custom={back}
                variants={musicVariants}
                initial="entry"
                animate="center"
                exit="exit"
                key={music}
              >
                {music_list ? music_list[music].slice(0, 1) : "로딩 중.."}
                <span>
                  ({music + 1}/{music_list ? music_list.length : "0"})
                </span>
              </Music>
            </AnimatePresence>
          </Musics>
          <MusicTitle>
            {music_list ? music_list[music].replace(".mp3", "") : ""}
          </MusicTitle>
          <Slider>
            <Time>
              {String(Math.floor(currentTime / 60)).padStart(2, "0")}:
              {String(Math.floor(currentTime % 60)).padStart(2, "0")}
            </Time>
            <MusicProgress
              type="range"
              value={currentTime}
              onChange={(e) => {
                audio.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }}
              min="0"
              max={audio?.duration + ""}
            />
            <Time>
              {String(Math.floor(audio?.duration / 60)).padStart(2, "0")}:
              {String(Math.floor(audio?.duration % 60)).padStart(2, "0")}
            </Time>
          </Slider>
          <MusicButtons>
            <MusicButton onClick={prevPlease} icon={faBackward} />
            <MusicButton onClick={onPlay} icon={isPlaying ? faPause : faPlay} />
            <MusicButton onClick={nextPlease} icon={faForward} />
            <Volume initial="initial" whileHover="hover">
              <MusicButton
                onClick={() => {
                  if (volume !== 0) {
                    setPreviousVolume(volume);
                    audio.volume = 0;
                    setVolume(0);
                  } else {
                    audio.volume = previousVolume;
                    setVolume(previousVolume);
                  }
                }}
                icon={
                  volume > 0.6
                    ? faVolumeHigh
                    : volume > 0.2
                    ? faVolumeLow
                    : volume > 0.0
                    ? faVolumeOff
                    : faVolumeXmark
                }
              />
              <MusicVolume
                type="range"
                value={volume}
                onChange={(e) => {
                  audio.volume = e.target.value;
                  setVolume(e.target.value);
                }}
                min="0"
                step="0.01"
                max="1"
                variants={VolumeVariants}
              />
            </Volume>
          </MusicButtons>
        </Container>
      </Wrapper>
    </>
  );
}

export default App;
