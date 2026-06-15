import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-purple-600/80 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
    >
      {i18n.language === 'en' ? 'አማርኛ' : 'English'}
    </button>
  );
}