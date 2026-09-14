# Installation, Updates, and Troubleshooting

[English](usage.md) · [简体中文](usage.zh-CN.md)

## Install

Use **Hexo 7 or 8**, **Node.js 20+**, npm, and Git. Node.js 24 is recommended.

If you do not have a blog yet:

```sh
npx hexo-cli init my-blog
cd my-blog
npm install
```

Run the following in your **Hexo blog root**:

```sh
git clone https://github.com/cweiai/hexo-theme-cosmos.git themes/cosmos
cd themes/cosmos
npm install
cd ../..
```

In the blog's `_config.yml`, set these fields while keeping your other site settings:

```yaml
title: My Notebook
author: Your name
url: https://example.com
root: /
language: en
theme: cosmos
index_generator:
  path: blog
  per_page: 10
  order_by: -date
```

Replace `url` with your blog's address. Create `_config.cosmos.yml` in the **blog root**, alongside `_config.yml`:

```yaml
home:
  title: My field
  aside: notes.
about:
  profile:
    name: Your name
    facts:
      - { label: Focus, value: Writing and design }
  content: |
    ## Hello
    Welcome to my notebook.
```

Start your blog:

```sh
npx hexo clean
npx hexo generate
npx hexo server
```

Open the address printed by Hexo, normally `http://localhost:4000/`. The cover is at `/`, posts at `/blog/`, and About at `/about/`.

**Installing a theme archive instead:** if you already have a Cosmos `.tgz` archive, run `npm install "/path/to/hexo-theme-cosmos-<version>.tgz"` in the blog root. Its dependencies install automatically. Use `theme: cosmos` and the same configuration above; use one installation method at a time.

## Update and rollback

Review the [recent changes](https://github.com/cweiai/hexo-theme-cosmos/commits/main/), back up the blog's configuration, `source/`, and package/lock files, and record your current theme commit:

```sh
cd themes/cosmos
git rev-parse HEAD
git pull --ff-only
npm install
cd ../..
npx hexo clean
npx hexo generate
npx hexo server
```

Check home, About, an article, search, and a narrow screen before deploying. If Git reports local changes or diverging history, preserve those changes and resolve them before retrying; do not overwrite them. To roll back an unmodified theme checkout, run `git -C themes/cosmos checkout <previous-commit>`, run `npm install` in `themes/cosmos`, then return to the blog root to clean and generate again. To resume following a branch later, use `git -C themes/cosmos switch <branch>`.

For archive installations, install the desired `.tgz` with `npm install "/path/to/theme.tgz"`; retain the previous archive for rollback. Restore the blog's dependency lockfile from your backup and run `npm ci` if you also need to restore its dependency versions.

**Switching from another theme:** keep your old theme until Cosmos is verified. Preserve posts and their original dates/permalinks, keep images in the blog's `source/`, and move personal settings into `_config.cosmos.yml`. Check literal URLs in custom HTML when using a subdirectory deployment.

## FAQ

| Problem | What to check |
| --- | --- |
| Settings do not change | Select `theme: cosmos`; edit the blog-root `_config.cosmos.yml`. Inline `theme_config`, About data, or front matter may override it. Restart Hexo, then clean and generate. |
| Theme or renderer cannot be found | For a Git installation, check `themes/cosmos/layout/` and run `npm install` in `themes/cosmos`. For a theme archive installed with npm, check `node_modules/hexo-theme-cosmos/layout/` and run `npm install` in the blog root. Always run Hexo from the blog root. |
| Cover conflicts with another page | Remove or move your own `source/index.md` when using cover mode, or choose `home.mode: blog`. |
| About content does not change | An existing `source/about/index.md` overrides the automatic page. Edit that page or move its content into the configured About file. |
| Images or CSS return 404 | Put assets in the blog's `source/`; omit `/source/` from public URLs. Match filename case and deploy the generated `public/` directory. |
| Site is below a subdirectory | Set both `url: https://example.com/notebook` and `root: /notebook/` in the blog config. Include the prefix in literal custom HTML URLs. |
| Search misses a post | Check `search.json`. Posts with `search: false` or `noindex: true` are excluded. |
| Comments, LaTeX, or Mermaid are missing | These need a provider or renderer; `post.comments` only enables the article-end HTML slot. See [optional integrations](content.md#optional-integrations). |
| Old pages remain after changing routes | Run `npx hexo clean`, regenerate, and replace the deployed output. |

For help, [open an issue](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=bug.yml) with theme/Hexo/Node versions, the first error, minimal configuration, and reproduction steps. [Feature requests](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=feature.yml) are welcome. Support is best-effort; external services and custom scripts may require separate diagnosis.
