import { useTheme } from "../context/ThemeContext";

const images: Record<string, Record<string, string>> = {
  'light': {
    'light': "https://img.icons8.com/ios/50/sun--v1.png",
    'dark': "https://img.icons8.com/ios/50/do-not-disturb-2.png"
  },
  'dark': {
    'light': "https://img.icons8.com/ios/50/FFFFFF/sun--v1.png",
    'dark': "https://img.icons8.com/ios/50/FFFFFF/do-not-disturb-2.png"
  }
};

export default function Header() {
  const { theme, setTheme, resolved } = useTheme();

  const currentImages = images[resolved] || images['light'];

  return (
    <header className="header">
      <div className="width-wrapper">
        <div className="header__inner">
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="header__logo">⚡ PokéSearch</span>
          </a>
          <nav className="header__nav">
            <a href="/" style={{ marginRight: "20px", textDecoration: "none" }}>
              Home
            </a>
            <a href="/about" style={{ textDecoration: "none" }}>
              About
            </a>
            <div className="theme-switcher" aria-label="Theme switcher">
              {(["system", "light", "dark"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`theme-switcher__button${theme === option ? " theme-switcher__button--active" : ""}`}
                  onClick={() => setTheme(option)}
                  title={`Switch to ${option} theme`}
                  aria-pressed={theme === option}
                >
                  {option === "system" ? (
                  "Auto"
                ) : option === "light" ? (
                  <img
                    width="20"
                    height="20"
                    src={currentImages.light}
                    alt={`${option}-${theme}`}
                  />
                ) : (
                  <img
                    width="20"
                    height="20"
                    src={currentImages.dark}
                    alt={`${option}-${theme}`}
                  />
                )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
