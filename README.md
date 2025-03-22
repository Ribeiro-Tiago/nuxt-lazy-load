# nuxt-lazyload-files

[![Latest version][npm-version-src]][npm-version-href] [![npm downloads][npm-downloads-src]][npm-downloads-href] [![npm][npm-src]][npm-href] [![Publish workflow][publish-workflow-src]][publish-workflow-href]

- [✨ Release Notes](/CHANGELOG.md)
- [🏀 Online playground](https://stackblitz.com/github/Ribeiro-Tiago/nuxt-lazy-load?file=playground%2Fapp.vue)
- [📖 Documentation](https://ribeiro-tiago.github.io/nuxt-lazyload-files/)

## Features

This module allows you to configure your nuxt app to import files as needed. By default nuxt will load every css, js, whatever else file. In many cases, this delays first paint and impacts performance and the feel of website, as in many cases this stuff might not be needed yet (or won't be needed at all as it can be platform specific code, such mobile only CSS styles).

This module adds 2 functionalities to your project:

- the actual module bit, which prepares the files to be lazy loaded during build
- a plugin that runs on client only, and handles the actual loading based on the file time and the rules configured

## Quick Setup

Install the module to your Nuxt application with one command:

- npm: `npx nuxi module add nuxt-lazyload-files`
- bun: `bunx nuxi module add nuxt-lazyload-files`
- yarn berry: `yarn dlx nuxi module add nuxt-lazyload-files`

In your `nuxt.config` you'll need to specify which rules ([available rules](#supported-files-and-rules)) to apply and add either:

- `inputDir`, a path where the files to lazy load are, and the module will try to process all files in it
- `files.[type]`, any specific files you want to lazy load

You can specify both and it'll try to process all files in `inputDir` **first** and all specific files in `files`. Any duplicate files are ignored.
<small>:information_source:Duplicate files are determined by path + filename, for example if you specify `inputDir: "mydir"` and `files.css: ["mydir/myfile"]`, myfile will be ignored when processing `files`</small>

Rules can specified both global (will apply to all files of type) or specific to each file. You'll need to specify at **least one** rule or nothing will happen

```javascript
lazyLoadFiles: {
  inputDir?: "path/to/dir";
  files?: {
    css: [
      { filePath: ["path/to/specific/file.scss"], {...<rule configuration>} }
    ]
  }
  {...<rule configuration>}
}
```

:exclamation:**Don't import files that you want to lazy load any other way (from other files, `css` prop in `nuxt.config`, etc).** This will result in those files being loaded twice: first by nuxt on first load automagically, secondly whenever the loading rules are true

:white_check_mark:That's it! You can now use nuxt-lazyload-files in your Nuxt app ✨

## Supported files and rules

<details>
  <summary>css</summary>

At the moment this module only supports lazy loading SCSS files. All other preprocessors and vanilla CSS still needs to be implemented, haven't had the time

These files also get compiled into plain CSS during build time, and it's those that the plugin uses

| Rule                   | Config            | Supported format | Description                                               |
| ---------------------- | ----------------- | ---------------- | --------------------------------------------------------- |
| windowWidthGreaterThan | { width: number } | SCSS             | Loads the files when window width is greater than `width` |
| windowWidthLessThan    | { width: number } | SCSS             | Loads the files when window width is less than `width`    |

</details>

<details>
  <summary>js (coming soon)</summary>
</details>

## Contribution

Any and all help is always welcome, check [open issues](https://github.com/Ribeiro-Tiago/nuxt-lazy-load/issues) or [the project](https://github.com/users/Ribeiro-Tiago/projects/1/views/1) if you're not too sure what to work on

<details>
  <summary>Local development</summary>

```bash
# Install dependencies
bun install

# Generate type stubs
bun run dev:prepare

# Develop with the playground
bun run dev

# bun the playground
bun run dev:build

# Run ESLint
bun run lint

# Run Vitest
bun run test
bun run test:watch

# Release new version
bun run release
```

#### Link package for local debugging

If you're developing something and want to test against a real example project, or are debugging something in your project that uses this module, you can link both projects, effectively making your project use your local version of the module instead (as [detailed here](https://vueschool.io/lessons/navigating-the-official-starter-template) at around the 9 minute mark)

```bash
# Go the dependency in node modules and run bun link to enable linking
cd ./node_modules/nuxt-lazyload-files && bun link && cd -

# back at the root of your project do, link it to the package
bun link nuxt-lazyload-files
```

</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-lazyload-files/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-lazyload-files
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-lazyload-files.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-lazyload-files
[npm-src]: https://img.shields.io/npm/l/nuxt-lazyload-files.svg?style=flat&colorA=020420&colorB=00DC82
[npm-href]: https://npmjs.com/package/nuxt-lazyload-files
[publish-workflow-src]: https://img.shields.io/github/actions/workflow/status/ribeiro-tiago/nuxt-lazyload-files/publish.yml?branch=master
[publish-workflow-href]: https://github.com/Ribeiro-Tiago/nuxt-lazyload-files/actions/workflows/publish.yml
