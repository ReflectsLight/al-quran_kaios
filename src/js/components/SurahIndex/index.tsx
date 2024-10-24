import type { TLocale } from "@0x1eef/quran";
import { useTheme } from "~/hooks/useTheme";
import { formatNumber, TFunction } from "~/lib/t";
import { Arrow } from "~/components/Icon";
import { Head } from "~/components/Head";
import "@css/main/SurahIndex.scss";

type Props = {
  localeId: TLocale;
  t: TFunction;
};

export function SurahIndex({ localeId, t }: Props) {
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useState<TLocale>(Quran.locales[localeId]);
  const index = useMemo(() => Quran.surahs[locale.name], [locale.name]);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeEl = useMemo(
    () => document.activeElement,
    [document.activeElement],
  );

  useEffect(() => {
    const onKeyPress = (e) => {
      if (e.key === "SoftLeft") {
        setShowLangDropdown(!showLangDropdown);
      } else if (e.key === "SoftRight") {
        setShowThemeDropdown(!showThemeDropdown);
      }
    };
    activeEl.addEventListener("keydown", onKeyPress);
    return () => activeEl.removeEventListener("keydown", onKeyPress);
  }, [activeEl, showLangDropdown, showThemeDropdown]);

  return (
    <div
      ref={rootRef}
      className={classNames(
        "flex flex-col h-full content surah-index theme",
        theme,
        locale.name,
        locale.direction,
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
      <ul className="flex flex-wrap body index scroll-y list-none m-0 p-0 w-full h-full">
        {index.map((surah, key) => (
          <li
            className={classNames("flex justify-center surah mb-2", {
              "w-full": locale.direction === "ltr",
              "w-1/2": locale.direction === "rtl",
            })}
            key={key}
          >
            <a
              className="flex items-center color-primary no-underline rounded w-11/12 h-8"
              href={`/${locale.name}/${surah.id}/`}
            >
              <span className="flex items-center justify-center h-6 background-primary color-secondary ml-2 mr-3 rounded font-extrabold w-14 text-center">
                {formatNumber(locale, surah.id)}
              </span>
              <span className="w-48">{surah.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <footer className="flex flex-row justify-between mb-5 h-12">
        <a
          className="flex flex-row items-center no-underline"
          href={`/${locale.name}/random/`}
        >
          {locale.direction === "ltr" ? (
            <Arrow direction="right" />
          ) : (
            <Arrow direction="left" />
          )}
          <span
            className={classNames({
              "pl-3": locale.direction === "ltr",
              "pr-3": locale.direction === "rtl",
            })}
          >
            {t(locale, "ChooseRandomChapter")}
          </span>
        </a>
      </footer>
    </div>
  );
}
