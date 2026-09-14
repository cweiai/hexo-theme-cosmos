'use strict';
const fs = require('node:fs');
const path = require('node:path');
const theme = path.resolve(__dirname,'..');
function createSite(directory, examples = true) {
  fs.mkdirSync(directory,{recursive:true});
  if (examples) fs.cpSync(path.join(theme,'examples'),directory,{recursive:true});
  fs.mkdirSync(path.join(directory,'source'),{recursive:true});
  fs.mkdirSync(path.join(directory,'themes/cosmos'),{recursive:true});
  const themeFiles = ['_config.yml','package.json','layout','scripts','lib','source','assets','languages'];
  const links = [['node_modules',path.join(theme,'node_modules')], ...themeFiles.map(name => [`themes/cosmos/${name}`,path.join(theme,name)])];
  for (const [link,target] of links) {
    if (!fs.existsSync(path.join(directory,link))) fs.symlinkSync(target,path.join(directory,link),fs.statSync(target).isDirectory() ? 'junction' : 'file');
  }
  const dependencies = require('../package.json').peerDependencies;
  fs.writeFileSync(path.join(directory,'package.json'),JSON.stringify({private:true,hexo:{version:'8.1.2'},dependencies},null,2));
  return directory;
}
module.exports = { createSite };
