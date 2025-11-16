import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

const LANGS = [
  { code: "vi", label: "Tiếng Việt", icon: "https://flagcdn.com/vn.svg" },
  { code: "en", label: "English", icon: "https://flagcdn.com/us.svg" },
];

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "vi");

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem("lang", code);
    setOpen(false);
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".language-switcher")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative language-switcher">
      {/* Main button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <img
          src={LANGS.find((l) => l.code === lang)?.icon}
          width={22}
          height={22}
          className="rounded-sm"
          alt="flag"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-xl p-2 z-50 animate-slide-down">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition ${
                lang === l.code ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <img src={l.icon} width={22} height={22} className="rounded-sm" />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
