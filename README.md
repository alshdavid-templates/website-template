# Starter Template for websites

### Demo page

[https://alshdavid-templates.github.io/website-template](https://alshdavid-templates.github.io/website-template/)

It features;
- Rspack bundler
- TypeScript
- Preact
- CSS Modules/Nesting
- Web Workers
- Bundle Size Stats
- Workflow to publish to GitHub Pages
- Template distributes 5kb of content (Preact, CSS, Worker + App code)

# Commands

```bash
npm run build
```

Build for production

```bash
npm run dev
```

Start dev server that reloads automatically on file change. Served on port `4200`

```bash
npm run stats
```

Display bundle size stats in the browser

```bash
npm run format
```

Formats the code using prettier

```bash
npm run watch
```

Watch for changes and rebuild

```bash
npm run serve
```

Serve the contents of the `./dist` directory on port `4200`. Use in conjunction with `npm run build` or `npm run watch`

# Getting Started

Download the repo as a `.zip` file, extract it and rename the things as needed

```bash
wget https://github.com/alshdavid-templates/website-template/archive/refs/heads/main.zip

unzip main.zip
```

## Auto install script

This script will download and extract the template to a target folder

```bash
# TODO

curl -sSf \
  https://raw.githubusercontent.com/alshdavid-templates/website-template/refs/heads/main/.github/install.js \
    | node - \
      --folder my-website \
      --project-name my-website
```