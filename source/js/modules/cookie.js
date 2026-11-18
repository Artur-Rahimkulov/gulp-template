/**
 * Модуль уведомления об использовании файлов Cookie.
 * Показывает плашку на сайте, если пользователь ещё не дал согласие.
 * Сохраняет статус в localStorage и document.cookie (для проверки на стороне CMS Bitrix).
 */

export const cookie = () => {
  const cookieBanner = document.querySelector('[data-cookie]');
  if (!cookieBanner) return;

  const STORAGE_KEY = 'cookie_accepted';
  const COOKIE_NAME = 'cookie_accepted';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 год в секундах

  const hasAccepted = () => {
    // 1. Проверяем localStorage
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        return true;
      }
    } catch {
      // Игнорируем ошибки доступа к localStorage в приватном режиме
    }

    // 2. Проверяем document.cookie
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) === 'true' : false;
  };

  const showBanner = () => {
    // Небольшая задержка перед показом для плавности после загрузки первого экрана
    setTimeout(() => {
      cookieBanner.classList.remove('is-hidden');
      cookieBanner.classList.add('is-active', 'is-visible');
    }, 600);
  };

  const hideBanner = () => {
    cookieBanner.classList.remove('is-active', 'is-visible');
    cookieBanner.classList.add('is-hidden');
  };

  const acceptCookies = () => {
    // Сохраняем в localStorage
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('[Cookie] Не удалось записать в localStorage:', e);
    }

    // Сохраняем в document.cookie для Bitrix ($_COOKIE['cookie_accepted'])
    document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    hideBanner();

    document.dispatchEvent(new CustomEvent('cookie:accepted'));
  };

  // Если согласие ещё не дано — показываем
  if (!hasAccepted()) {
    showBanner();
  }

  // Клик по кнопке «ПРИНЯТЬ ВСЁ»
  const acceptBtn = cookieBanner.querySelector('[data-cookie-accept]');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', acceptCookies);
  }

  // Публичный API для сброса / тестирования
  window.resetCookieConsent = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    showBanner();
  };
};
