import { isClient } from 'app/utils';
import * as Cookie from 'tiny-cookie';

const I18NUtils = {
  getUrlLocale: (path, languages) => (languages.find((lang) => {
    const regexp = new RegExp(`^\/?${lang.key}\/|^\/?${lang.key}$`);
    return path.match(regexp);
  }) || {}).key,

  getCoockieLocale: (cookie = {}) => {
    if (isClient && Cookie.get('locale')) {
      return Cookie.get('locale');
    }

    return cookie.locale;
  },

  getDefaultLocale: languages => (languages.find(language => language.default) || {}).key,

  getLocale: (path, languages = [], cookie = {}) => I18NUtils.getUrlLocale(path, languages) ||
    I18NUtils.getCoockieLocale(cookie) || I18NUtils.getDefaultLocale(languages),

  saveLocale: (locale) => {
    if (isClient) {
      return Cookie.set('locale', locale, { expires: 365 * 10 });
    }
  }
};

export default I18NUtils;
