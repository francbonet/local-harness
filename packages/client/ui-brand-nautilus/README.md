---
description: "Nautilus brand occupants and palette layer for the Web client; for users and maintainers changing the product's logo, name, or colors."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-brand-nautilus

English | [中文](README.zh.md)

## Summary

This package gives the Web client the Nautilus identity: the spiral mark and name in the sidebar, the mark in the conversation hero, and a small palette layer. The dark palette moves the main surfaces to navy `#0A0E17`, both palettes use a sky accent for links and active states, and focus rings use pink. Change this package to change the product's logo, name, or colors.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Mount this plugin in the browser roster in place of `dsh-client-ui-brand-official`. It registers in every build profile and has no configuration.

### Changing the identity

The mark and name live in [`Brand.tsx`](src/client/Brand.tsx), and the palette lives in [`palette.ts`](src/client/palette.ts). A palette token states a value for each color scheme, so a change to one scheme must keep the other readable. The specification checks link and focus-ring contrast on both base surfaces.

The browser-tab icon and install icons are separate: `apps/web/public/favicon.svg` carries the same artwork, and `pnpm --filter @deepseek-ai/dsh-web-frontend run render:app-icons` renders the install icons from it.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The two sidebar occupants install as one declaration-aware registration set, and the hero occupant installs independently because its slot belongs to `ui-conversation`. The palette is one `ctx.theme.overrideTokens()` layer inside an effect, so disposing the plugin restores the shipped tokens. The browser half ships through `exports["./client"]`; the host entry exists only to give Loader an inert row.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

Read these pages when the brand surface is not enough. They move from the slots this package occupies to the theme it overrides.

- [ui-sidebar](../ui-sidebar/README.md) — declares `sidebar.brand.mark` and `sidebar.brand.name`.
- [ui-conversation](../ui-conversation/README.md) — declares `conversation.hero.brand.mark`.
- [ui-theme](../ui-theme/README.md) — owns the `--dsw-*` tokens and override layers.
- [Web UI style reference](../../../docs/web-styling.md) — defines styling ownership.

-----

<a id="model-experience"></a>
## Model Experience

None, as the package contributes browser presentation only; nothing here reaches a model request.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>


These limits define what the brand plugin can reach. They are current package constraints, not a task backlog.

- **The build version is not shown** — occupying the name slot replaces the shell's local-build label and its version badge.
- **The first paint uses the shipped palette** — the layer applies when the plugin activates, so a dark page briefly shows the shipped background.
- **The browser title is independent** — it comes from `DSH_CLIENT_TITLE` or the `brand.localBuild` locale entry rather than from a slot.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
