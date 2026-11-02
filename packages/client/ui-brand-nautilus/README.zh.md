---
description: "面向 Web 客户端的 Nautilus 品牌填充与配色层；供修改产品标志、名称或颜色的用户与维护者阅读。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-brand-nautilus

[English](README.md) | 中文

## 概述

本包为 Web 客户端提供 Nautilus 身份：侧栏中的螺旋标志与名称、会话首屏中的标志，以及一个小型配色层。深色配色将主要表面改为海军蓝 `#0A0E17`，两种配色都以天蓝色作为链接与活动状态的强调色，焦点环使用粉色。修改产品标志、名称或颜色时请修改本包。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

在浏览器插件名单中用本插件替代 `dsh-client-ui-brand-official`。本插件在每个构建 profile 中都会注册，没有配置项。

### 修改身份

标志与名称位于 [`Brand.tsx`](src/client/Brand.tsx)，配色位于 [`palette.ts`](src/client/palette.ts)。每个配色 token 都为两种配色方案各声明一个值，因此修改其中一种时必须保持另一种可读。测试规格会检查链接与焦点环在两种基础表面上的对比度。

浏览器标签图标与安装图标相互独立：`apps/web/public/favicon.svg` 携带同一图稿，`pnpm --filter @deepseek-ai/dsh-web-frontend run render:app-icons` 由它渲染安装图标。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

两个侧栏填充作为一组声明感知的注册安装，首屏填充独立安装，因为其 slot 属于 `ui-conversation`。配色是效果内的一个 `ctx.theme.overrideTokens()` 层，因此销毁插件会恢复随附的 token。浏览器半边通过 `exports["./client"]` 发布；host 入口只为 Loader 提供一个空操作行。

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

当品牌面不够用时阅读以下页面。它们从本包占据的 slot 进入本包覆盖的主题。

- [ui-sidebar](../ui-sidebar/README.zh.md)——声明 `sidebar.brand.mark` 与 `sidebar.brand.name`。
- [ui-conversation](../ui-conversation/README.zh.md)——声明 `conversation.hero.brand.mark`。
- [ui-theme](../ui-theme/README.zh.md)——拥有 `--dsw-*` token 与覆盖层。
- [Web UI 样式参考](../../../docs/web-styling.zh.md)——定义样式归属。

-----

<a id="model-experience"></a>
## 模型体验

无，因为本包只贡献浏览器呈现；这里没有任何内容进入模型请求。

#### KV Cache 影响

无；本包既不组装也不发送提供方请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>


这些限制界定了品牌插件的作用范围。它们是当前包约束，不是任务积压。

- **不显示构建版本**——占据名称 slot 会替换外壳的本地构建标签及其版本徽标。
- **首次绘制使用随附配色**——配色层在插件激活时生效，因此深色页面会短暂显示随附背景。
- **浏览器标题独立**——标题来自 `DSH_CLIENT_TITLE` 或 `brand.localBuild` 区域设置条目，而非 slot。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文——点击展开</summary>

无。

</details>
