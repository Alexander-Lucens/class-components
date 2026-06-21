"use client";

import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import { useTheme } from "../context/ThemeContext";
import LocaleSwitcher from "./LocaleSwitcher";

const THEME_OPTIONS = ["system", "light", "dark"] as const;

export default function Header() {
  const t = useTranslations("Header");
  const tTheme = useTranslations("Theme");
  const { theme, setTheme } = useTheme();

  return (
    <header className="header">
      <div className="width-wrapper">
        <div className="header__inner">
          <Link href="/" className="header__logo">
            ⚡ {t("logo")}
          </Link>
          <nav className="header__nav">
            <Link href="/" className="header__nav-link">
              {t("home")}
            </Link>
            <Link href="/about" className="header__nav-link">
              {t("about")}
            </Link>
            <LocaleSwitcher />
            <div className="theme-switcher" aria-label={tTheme("label")}>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`theme-switcher__button${
                    theme === option ? " theme-switcher__button--active" : ""
                  }`}
                  onClick={() => setTheme(option)}
                  title={tTheme(option)}
                  aria-pressed={theme === option}
                >
                  {tTheme(option)}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
