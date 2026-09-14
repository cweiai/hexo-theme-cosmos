'use strict';

const icons = require('../assets/social-icons/icons.json');
const aliases = { douyin: 'tiktok', mail: 'email', rednote: 'xiaohongshu', twitter: 'x' };

hexo.extend.helper.register('profile_icon', function (name) {
  const key = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const resolved = Object.hasOwn(aliases, key) ? aliases[key] : key;
  const svg = Object.hasOwn(icons, resolved) ? icons[resolved] : icons.custom;
  return svg.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg\b/, '<svg class="profile-contact-icon" aria-hidden="true" focusable="false"').trim();
});
