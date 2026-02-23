const RAW_BASE_URL = import.meta.env.BASE_URL || '/';
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
const BASE_PATH = BASE_URL.replace(/^\/+|\/+$/g, '');

const EXTERNAL_URL_PATTERN = /^(?:[a-z]+:|\/\/)/i;

export const resolveAssetPath = (assetPath = '') => {
  if (!assetPath) return '';
  if (EXTERNAL_URL_PATTERN.test(assetPath)) return assetPath;

  const cleanPath = assetPath.replace(/^\/+/, '');
  return `${BASE_URL}${cleanPath}`;
};

export const normalizeStoredAssetPath = (assetPath = '') => {
  if (!assetPath) return '';
  if (EXTERNAL_URL_PATTERN.test(assetPath)) return assetPath;

  const cleanPath = assetPath.replace(/^\/+/, '');

  if (!BASE_PATH) return cleanPath;
  if (cleanPath.startsWith(`${BASE_PATH}/`)) {
    return cleanPath.slice(BASE_PATH.length + 1);
  }

  return cleanPath;
};
