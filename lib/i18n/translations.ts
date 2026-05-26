export const translations = {
  en: {
    "nav.home": "Home",
    "nav.trending": "Trending",
    "nav.admin": "Admin",
    "nav.profile": "Profile",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "button.getStarted": "Get Started",
    "hero.title": "Universal Link Commenting Platform",
  },
  ko: {
    "nav.home": "홈",
    "nav.trending": "트렌딩",
    "nav.admin": "관리자",
    "nav.profile": "프로필",
    "nav.login": "로그인",
    "nav.logout": "로그아웃",
    "button.getStarted": "시작하기",
    "hero.title": "유니버설 링크 댓글 플랫폼",
  }
};

export type Language = 'en' | 'ko';
export type TranslationKey = keyof typeof translations['en'];