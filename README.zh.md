# DeepSeek Harness

[English](README.md) | 中文

DeepSeek Harness（`dsh`）是由 [DeepSeek AI](https://deepseek.com) 开发的开源 agent harness（智能体框架）。

它构建于**一切皆插件**的架构之上，由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512)。

文档：[https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## 开发者预览

DeepSeek Harness 处于 _开发者预览_ 阶段，正在快速迭代。**未来将出现破坏兼容性的变更。**

运行本项目前，请阅读[安全说明](SAFETY.zh.md)。

<a id="run"></a>

## 运行

### 通过 `npm` 运行

安装 `Node.js`，然后运行：

```sh
npx @deepseek-ai/dsh web
```

该命令默认会在 `http://127.0.0.1:3080` 启动 Web UI，本机启动时还会用默认浏览器打开页面。通过 SSH 启动时只打印宿主机 URL，因为本地转发地址由 SSH 客户端或编辑器持有。传入 `--no-open` 可仅运行服务器而不打开浏览器。详见 [Web UI 指南](docs/user/guide/index.zh.md)。

<a id="run-from-source"></a>

### 从源码运行

如需从仓库源码运行：

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 会准备仓库产物。`pnpm dsh web` 会直接使用这些已构建产物，不会重新构建。

### 使用 LM Studio 的本地模型运行

`dsh` 可以使用 LM Studio 在本机提供的模型。此配置只修改你的 profile 配置：无需改动源码，模型请求也不需要 DeepSeek 密钥。

启动 LM Studio 的本地服务器并加载模型，然后运行 `lms ps` 查看模型 ID 及其上下文长度。运行 `pnpm dsh --profile web --dump-config > /dev/null` 创建 profile，再将 `~/.dsh/profiles/web/cordis.patch.yml` 中的 `[]` 这一行替换为以下 patch：

```yaml
- id: llm-pi-ai
  config:
    providers:
      lm-studio:
        displayName: LM Studio
        api: openai-completions
        baseURL: http://127.0.0.1:1234/v1
        headers:
          Authorization: Bearer lm-studio
        streamIdleTimeoutMs: 900000
        models:
          - id: google/gemma-4-12b-qat
            name: Gemma 4 12B
            contextWindow: 30208
            maxTokens: 8192

- id: agent-default-model
  config:
    provider: lm-studio
    model: google/gemma-4-12b-qat

- id: compaction-basic
  config:
    modelPolicies:
      - provider: lm-studio
        model: google/gemma-4-12b-qat
        headroomTokens: 4096
```

将这三处 `google/gemma-4-12b-qat` 都替换为你的模型 ID，并把 `contextWindow` 设为 `lms ps` 显示的 `CONTEXT` 值。然后运行 `pnpm dsh web`：模型选择器会将你的模型显示为默认模型。

- `Authorization` 中是占位值。适配器要求提供此请求头，而未启用 API 令牌认证的 LM Studio 服务器不会检查它的值。
- `streamIdleTimeoutMs` 为长提示词预留时间，因为 LM Studio 处理提示词期间不发送任何数据。在 Apple M1 Pro 上，处理 24,000 token 的提示词约需四分钟。
- `headroomTokens` 替换默认的 65,536 token 压缩（compaction）余量，该默认值大于此上下文窗口。
- `headless` profile 读取 `~/.dsh/profiles/headless/cordis.patch.yml`。请用 `--profile headless` 创建该 profile，并在其中应用相同的 patch。

此配置有两项限制：

- Web profile 不会对较小的上下文窗口执行自动压缩。每个 Web agent 预设都挂载自己的 `compaction-basic` 行，而此 patch 无法作用于这些行。在默认压缩设置和 30,208 token 窗口下，某个回合在输入约 25,000 token 时未返回回复便结束。出现这种情况时，请新建会话。
- 默认的网页搜索提供方使用 DeepSeek 凭据，因此网页搜索仍需要 DeepSeek 密钥或账号登录。

[配置模型](docs/user/guide/providers.zh.md)介绍自定义模型 API 及其其他设置。

## 社区与支持

- 通过 [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) 提交反馈或 bug 报告。
- 为你的插件仓库添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题，便于被发现。
- 欢迎加入 DeepSeek Harness 企微群！扫描下方二维码填写入群问卷，小助手会定期发送入群邀请。

<table>
  <thead>
    <tr>
      <th align="center">入群问卷</th>
      <th align="center">微信公众号</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><a href="https://trtgsjkv6r.feishu.cn/share/base/form/shrcnIt5twSVdLGD52KJBckGCgg"><img src="https://cdn.deepseek.com/harness/readme/community-wecom-survey.png" alt="DeepSeek Harness 入群问卷二维码" width="180" height="180"></a></td>
      <td align="center"><img src="https://cdn.deepseek.com/harness/readme/community-wechat-official-account.png" alt="DeepSeek Harness 团队微信公众号二维码" width="180" height="180"></td>
    </tr>
  </tbody>
</table>

## 参与贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.zh.md)。

## 开发

请先阅读[开发指南](docs/development.zh.md)与[架构文档](docs/architecture.zh.md)。

`pnpm run dev:web` 会在一个终端里完成构建、启动，并在源码修改时重建 client bundle；`make help` 列出 Web 与 Desktop 对应的 Make target。完整表格见开发指南的「应用命令」一节。

面向 agent：请遵循 [AGENTS.md](AGENTS.md)。

## 引用

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## 许可证

[MIT](LICENSE)

第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
