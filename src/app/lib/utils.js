// lib/utils.js
import { createHash } from 'crypto';

export const generateShortCode = (url) => {
  const hash = createHash('sha256')
    .update(url + Date.now())
    .digest('hex');
  return hash.substring(0, 8);
};