import type { Surah, Ayah, TAyat, TLocale } from "@0x1eef/quran";
import { useTheme } from "~/hooks/useTheme";
import { AudioControl, TAudioStatus } from "~/components/AudioControl";
import { Head } from "~/components/Head";
import {
  PlayIcon,
  PauseIcon,
  RefreshIcon,
  StalledIcon,
} from "~/components/Icon";
import { Timer } from "~/components/Timer";
import { TFunction } from "~/lib/t";
import { Stream } from "./Stream";
import "@css/main/SurahStream.scss";

type Maybe<T> = T | null | undefined;

type Props = {
  surah: Surah;
  locale: TLocale;
  t: TFunction;
};

export function SurahStream({ surahId, localeId, t }: Props) {
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useState<TLocale>(Quran.locales[localeId]);
  const surahs = useMemo(() => Quran.surahs[locale.name], [locale.name]);
  const [surah, setSurah] = useState<Surah>(surahs[parseInt(surahId) - 1]);

  const [stream, setStream] = useState<TAyat>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [audioStatus, setAudioStatus] = useState<Maybe<TAudioStatus>>(null);
  const [endOfStream, setEndOfStream] = useState<boolean>(false);

  const rootRef = useRef<HTMLElement>(null);
  const audio = useMemo(() => new Audio(), []);
  const readyToRender = stream.length > 0;
  const ayah: Maybe<Ayah> = stream[stream.length - 1];

  useEffect(() => {
    setSurah(surahs[surahId - 1]);
  }, [locale.name]);

  useEffect(() => {
    if (!stream || !stream.length) {
      /* noop */
      return;
    } else if (surah.ayat[0].body === stream[0].body) {
      /* noop */
      return;
    } else {
      const slice = [...surah.ayat].slice(0, stream.length);
      setStream(slice);
    }
  }, [surah]);

  useEffect(() => {
    if (!endOfStream) {
      setStream([surah.ayat[0]]);
    }
  }, [endOfStream]);

  return (
    <article
      ref={rootRef}
      className={classNames(
        "flex flex-col h-full content theme",
        locale.name,
        locale.direction,
        theme,
        { hidden: !readyToRender },
      )}
    >
      <Head
        setLocale={setLocale}
        locale={locale}
        setTheme={setTheme}
        theme={theme}
      >
        {t(locale, "TheNobleQuran")}
      </Head>
      <Stream
        locale={locale}
        surah={surah}
        stream={stream}
        endOfStream={endOfStream}
        isPaused={isPaused}
        t={t}
      />
      <footer className="flex justify-between items-center h-16">
        {!endOfStream && isPaused && (
          <PlayIcon onClick={() => setIsPaused(false)} />
        )}
        {!endOfStream && !isPaused && (
          <PauseIcon onClick={() => setIsPaused(true)} />
        )}
        <span
          className={classNames("sound-box flex flex-col items-end w-16", {
            hidden: endOfStream,
          })}
        >
          <AudioControl
            audio={audio}
            surah={surah}
            ayah={ayah}
            hidden={endOfStream}
            enabled={audioEnabled}
            setEnabled={setAudioEnabled}
            onStatusChange={(status) => {
              if (status === "end") {
                setAudioEnabled(false);
              }
              setAudioStatus(status);
            }}
          />
        </span>
        <span
          className={classNames({
            hidden: endOfStream || audioStatus === "wait",
          })}
        >
          <Timer
            locale={locale}
            surah={surah}
            ayah={ayah}
            isPaused={isPaused}
            audio={audio}
            audioStatus={audioStatus}
            onComplete={(surah, ayah) => {
              const layah = surah.ayat[surah.ayat.length - 1];
              if (!layah || !ayah) {
                return;
              } else if (layah.id === ayah.id) {
                setEndOfStream(true);
              } else {
                setStream([...stream, surah.ayat[ayah.id]]);
              }
            }}
          />
        </span>
        {audioStatus === "wait" && <StalledIcon />}
        <span className={classNames({ hidden: !endOfStream })}>
          <RefreshIcon onClick={() => [setEndOfStream(false)]} />
        </span>
      </footer>
    </article>
  );
}
