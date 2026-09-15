'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const yaml = require('js-yaml');
const Hexo = require('hexo');
const { createSite } = require('../tools/site.cjs');
const { merge } = require('../lib/settings.cjs');
async function build(siteOverride={}, themeOverride={}, prepare=()=>{}, examples=true) {
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cosmos-test-'));
  createSite(directory,examples);
  const base=yaml.load(fs.readFileSync(path.join(__dirname,'../examples/_config.yml'),'utf8'));
  fs.writeFileSync(path.join(directory,'_config.yml'),yaml.dump(merge(base,siteOverride)));
  fs.writeFileSync(path.join(directory,'_config.cosmos.yml'),yaml.dump(themeOverride));
  prepare(directory);
  const hexo=new Hexo(directory,{silent:true});
  const errors=[];
  hexo.log.error=(...args)=>errors.push(args.map(String).join(' '));
  try {
    await hexo.init(); await hexo.call('generate',{});
    assert.deepEqual(errors,[], 'Hexo must build without script or rendering errors');
    const read=file=>fs.readFileSync(path.join(directory,'public',file),'utf8');
    const exists=file=>fs.existsSync(path.join(directory,'public',file));
    return {directory,read,exists,close:async()=>{await hexo.exit();fs.rmSync(directory,{recursive:true,force:true});}};
  } catch(error) { await hexo.exit(); fs.rmSync(directory,{recursive:true,force:true}); throw error; }
}
test('standard cover, posts, pagination, archives, categories, tags, About and 404 build',async()=>{
  const site=await build();
  try {
    for(const file of ['index.html','blog/index.html','blog/page/2/index.html','about/index.html','archives/index.html','archives/2024/index.html','archives/2024/06/index.html','categories/index.html','categories/Reference/index.html','tags/index.html','tags/Markdown/index.html','404.html','search.json']) assert.ok(site.exists(file),file);
    assert.match(site.read('index.html'),/hero-without-image/);
    assert.ok(!site.exists('README.html'), 'The theme asset-module guide is not a blog page');
    assert.ok(!site.exists('README.zh-CN.html'), 'The translated asset-module guide is not a blog page');
    assert.ok(!site.read('index.html').includes('<header class="site-header'));
    const post=site.read('2024/06/12/formatting/index.html');
    for(const markup of ['<table>','<blockquote>','class="highlight javascript"','<details>','<math ','class="contents"','entry-older']) assert.ok(post.includes(markup),markup);
    assert.ok(!post.includes('Copy article link'));
    assert.ok(!site.read('2023/11/03/first-entry/index.html').includes('entry-older'));
    assert.equal(JSON.parse(site.read('search.json')).length,4);
  } finally { await site.close(); }
});
test('subdirectory URLs, renamed routes, Chinese labels, profile and custom HTML',async()=>{
  const site=await build({url:'https://example.org/notebook',root:'/notebook/',language:'zh-CN',index_generator:{path:'writing'}},{routes:{about:'profile'},navigation:[{route:'about'},{route:'blog'}],about:{profile:{name:'Example <Author>',email:'hello@example.org',facts:[{label:'Location',value:'Example City'}],contacts:[{label:'GitHub',url:'https://github.com/example',value:'@example'},{label:'Unused',url:''},{label:'Unsafe',url:'javascript:alert(1)'}]},content:'<section id="custom-content"><h2>自定义 HTML</h2><img src="/notebook/images/campus.svg" alt="Example illustration"></section>'}},dir=>{fs.mkdirSync(path.join(dir,'source/images'));fs.writeFileSync(path.join(dir,'source/images/campus.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>');});
  try {
    const about=site.read('profile/index.html');
    assert.match(about,/href="\/notebook\/writing\/"/);
    assert.match(about,/src="\/notebook\/images\/campus.svg"/);
    assert.match(about,/src="\/notebook\/js\/main.js"/);
    assert.match(about,/Example &lt;Author&gt;/);
    assert.match(about,/自定义 HTML/);
    assert.equal((about.match(/class="profile-contact-row"/g)||[]).length,2);
    assert.ok(!about.includes('javascript:'));
    assert.ok(!about.includes('Unused'));
  } finally {await site.close();}
});
test('blog-at-root mode and disabled features remove their markup and search index',async()=>{
  const site=await build({}, {home:{mode:'blog'},search:{enabled:false},navigation:[],listing:{categories:false,excerpts:false,category:false,date:false,reading_time:false},post:{toc:false,progress:false,copy_code:false,navigation:false,tags:false,reading_time:false},about:{profile:{enabled:false}},footer:{enabled:false}});
  try {
    const index=site.read('index.html'); const post=site.read('2024/06/12/formatting/index.html');
    assert.ok(!index.includes('hero-stage'));
    assert.ok(!index.includes('id="post-search"'));
    assert.ok(!index.includes('site-footer'));
    assert.ok(!site.exists('search.json'));
    assert.ok(!post.includes('class="contents"'));
    assert.ok(!post.includes('class="reading-progress"'));
    assert.ok(!post.includes('class="entry-pagination"'));
    assert.match(post,/data-copy-code="false"/);
    assert.match(site.read('about/index.html'),/without-profile/);
  } finally {await site.close();}
});
test('source About overrides generated content; custom HTML, hooks and assets need no theme edits',async()=>{
  const site=await build({}, {about:{content:'Default content',profile:{name:'Fallback'}},pages:{custom:[{path:'projects',title:'Projects',file:'_content/projects.md'}]},custom:{css:['/custom.css'],js:['/custom.js'],head:'<meta name="custom-head" content="yes">',after_about:'<div id="about-hook">After About</div>',after_post:'<div id="comments">Comments</div>'},labels:{blog:'Journal'},style:{colors:{accent:'#123456'},typography:{quote_size:'20px'}}},dir=>{
    fs.mkdirSync(path.join(dir,'source/about'),{recursive:true});
    fs.writeFileSync(path.join(dir,'source/about/index.md'),'---\nlayout: about\ntitle: A custom About\nprofile: false\n---\n\n<section id="custom-biography"><p>Custom HTML biography</p></section>');
    for(const name of ['custom.css','custom.js']) fs.writeFileSync(path.join(dir,'source',name),'');
    fs.writeFileSync(path.join(dir,'source/README.md'),'---\nlayout: page\ntitle: My guide\n---\nSite-owned README content');
    fs.writeFileSync(path.join(dir,'source/README.zh-CN.md'),'---\nlayout: page\ntitle: 我的指南\n---\n站点自己的中文 README');
  });
  try {
    const about=site.read('about/index.html');
    assert.match(site.read('README.html'), /Site-owned README content/);
    assert.match(site.read('README.zh-CN.html'), /站点自己的中文 README/);
    assert.match(about,/id="custom-biography"/);
    assert.ok(!about.includes('Default content'));
    assert.match(about,/id="about-hook"/);
    assert.match(about,/--accent:#123456/);
    assert.match(about,/--quote-size:20px/);
    assert.match(about,/href="\/custom.css"/);
    assert.match(about,/src="\/custom.js"/);
    assert.match(about,/>Journal<\/a>/);
    assert.match(site.read('projects/index.html'),/First project/);
  } finally {await site.close();}
});
test('empty site and source taxonomy pages build without fabricated profile data',async()=>{
  const site=await build({}, {},()=>{},false);
  try {
    assert.match(site.read('blog/index.html'),/Nothing published here yet/);
    assert.match(site.read('tags/index.html'),/Nothing published here yet/);
    assert.ok(!site.read('about/index.html').includes('profile-contact-row'));
    assert.deepEqual(JSON.parse(site.read('search.json')),[]);
  } finally {await site.close();}
});
test('inline site theme settings take precedence over external list overrides',async()=>{
  const site=await build({theme_config:{navigation:[],about:{profile:{contacts:[]}}}}, {navigation:[{route:'about'}],about:{profile:{contacts:[{label:'Website',url:'https://example.org'}]}}});
  try {
    assert.ok(!site.read('about/index.html').includes('class="profile-contact-row"'));
    assert.ok(!site.read('about/index.html').includes('class="icon-control menu-toggle"'));
  } finally {await site.close();}
});

test('all About regions accept HTML, without a separate education configuration',async()=>{
  const site=await build({}, {about:{header_html:'<h1 id="html-heading">A <em>custom</em> title</h1>',sidebar_html:'<section id="html-sidebar"><h2>Custom sidebar</h2><a href="mailto:hello@example.org">Contact</a></section>',content:'<section id="html-body"><h2>Education</h2><ol class="education-timeline"><li>Any HTML content</li></ol></section>'}});
  try {
    const about=site.read('about/index.html');
    for(const id of ['html-heading','html-sidebar','html-body'])assert.match(about,new RegExp('id="'+id+'"'));
    assert.ok(!about.includes('id="profile-name"'));
    assert.equal((about.match(/education-timeline/g)||[]).length,1);
    assert.ok(!fs.existsSync(path.join(__dirname,'../layout/_partial/education.ejs')));
    const defaults=yaml.load(fs.readFileSync(path.join(__dirname,'../_config.yml'),'utf8'));
    assert.equal(defaults.about.education,undefined);
  } finally {await site.close();}
});

test('untitled posts keep usable titles across article, listing, navigation and search routes', async t => {
  for (const [name, language, labels, postLanguage, expected] of [
    ['English', 'en', {}, '', 'Untitled'],
    ['Chinese', 'zh-CN', {}, '', '无标题'],
    ['post language', 'en', {}, 'zh-CN', '无标题'],
    ['label override', 'zh-CN', { untitled: 'Note <&>' }, '', 'Note <&>'],
    ['explicit empty override', 'en', { untitled: '' }, '', '']
  ]) {
    await t.test(name, async () => {
      const site = await build({ language, per_page: 10, index_generator: { per_page: 10 }, archive_generator: { per_page: 10 } }, { labels }, dir => {
        fs.mkdirSync(path.join(dir, 'source/_posts'), { recursive: true });
        for (const [slug, title, day] of [['named', 'A <named> & post', 5], ['missing', undefined, 4], ['blank', '   ', 3]]) {
          const front = { date: `2024-06-0${day} 12:00:00`, categories: ['Notes'], tags: ['Writing'] };
          if (title !== undefined) front.title = title;
          if (postLanguage) front.lang = postLanguage;
          fs.writeFileSync(path.join(dir, `source/_posts/${slug}.md`), `---\n${yaml.dump(front)}---\nBody for ${slug}.`);
        }
      }, false);
      try {
        const escaped = require('hexo-util').escapeHTML(expected);
        for (const [slug, day] of [['missing', 4], ['blank', 3]]) {
          const post = site.read(`2024/06/0${day}/${slug}/index.html`);
          assert.ok(post.includes(`<title>${escaped} — Example Notebook</title>`));
          assert.ok(post.includes(`property="og:title" content="${escaped} — Example Notebook"`));
          assert.match(post, new RegExp(`<h1 data-entry="[^"]+">${escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h1>`));
        }
        for (const route of ['blog/index.html', 'archives/index.html', 'categories/Notes/index.html', 'tags/Writing/index.html']) {
          const entries = [...site.read(route).matchAll(/class="entry-title"[^>]*>(.*?)<\/a>/g)].map(match => match[1]);
          assert.deepEqual(entries, ['A &lt;named&gt; &amp; post', escaped, escaped], route);
        }
        assert.ok(site.read('2024/06/05/named/index.html').includes(`<strong>${escaped}</strong>`));
        assert.ok(site.read('2024/06/03/blank/index.html').includes(`<strong>${escaped}</strong>`));
        const search = JSON.parse(site.read('search.json'));
        assert.deepEqual(search.map(post => post.title), ['A <named> & post', expected, expected]);
        assert.ok(search.every(post => post.path && post.key));
      } finally { await site.close(); }
    });
  }
});

test('front-matter photos render safely in order and respect the deployment root', async t => {
  for (const root of ['/', '/notebook/']) {
    await t.test(root, async () => {
      const language = root === '/' ? 'en' : 'zh-CN';
      const site = await build({ url: `https://example.org${root}`, root, language }, {}, dir => {
        fs.mkdirSync(path.join(dir, 'source/_posts'), { recursive: true });
        fs.mkdirSync(path.join(dir, 'source/images'), { recursive: true });
        for (const name of ['first.svg', 'second.svg']) fs.writeFileSync(path.join(dir, 'source/images', name), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>');
        const photos = ['/images/first.svg', 'images/second.svg', 'https://example.org/photo.jpg?q="paper"&size=2', '', null, 'javascript:alert(1)', 'data:image/svg+xml,unsafe', '//example.org/photo.jpg', 'mailto:hello@example.org', 'tel:123', '#fragment'];
        for (const [slug, value] of [['gallery', photos], ['empty', []], ['single', '/images/first.svg'], ['legacy', '/images/first.svg']]) {
          const front = { title: slug, date: '2024-06-01', [slug === 'legacy' ? 'photo' : 'photos']: value };
          fs.writeFileSync(path.join(dir, `source/_posts/${slug}.md`), `---\n${yaml.dump(front)}---\nBody after the gallery.`);
        }
      }, false);
      try {
        const html = site.read('2024/06/01/gallery/index.html');
        const gallery = html.match(/<div class="post-gallery">([\s\S]*?)<\/div>/)?.[1];
        assert.ok(gallery, 'A gallery is rendered from front-matter photos');
        assert.deepEqual([...gallery.matchAll(/src="([^"]+)"/g)].map(match => match[1]), [`${root}images/first.svg`, `${root}images/second.svg`, 'https://example.org/photo.jpg?q=&#34;paper&#34;&amp;size=2']);
        assert.deepEqual([...gallery.matchAll(/alt="([^"]+)"/g)].map(match => match[1]), [1, 2, 3].map(number => `${language === 'en' ? 'Photo' : '图片'} ${number}`));
        assert.equal((gallery.match(/loading="lazy"/g) || []).length, 3);
        assert.ok(html.indexOf('class="post-gallery"') < html.indexOf('<p>Body after the gallery.</p>'));
        assert.ok(!site.read('2024/06/01/empty/index.html').includes('class="post-gallery"'));
        assert.ok(site.read('2024/06/01/single/index.html').includes(`src="${root}images/first.svg"`));
        assert.ok(site.read('2024/06/01/legacy/index.html').includes(`src="${root}images/first.svg"`));
      } finally { await site.close(); }
    });
  }
});
