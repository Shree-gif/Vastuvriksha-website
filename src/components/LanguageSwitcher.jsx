import { useLanguage } from '../context/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-switcher" 
      onClick={toggleLanguage}
      aria-label="Switch Language"
      title={language === 'en' ? 'Switch to Marathi' : 'Switch to English'}
    >
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>English</span>
      <span className="divider">|</span>
      <span className={`lang-option ${language === 'mr' ? 'active' : ''}`}>मराठी</span>
    </button>
  );
}

export default LanguageSwitcher;

