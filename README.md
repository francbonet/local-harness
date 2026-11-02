# DeepSeek Harness

English | [中文](README.zh.md)

DeepSeek Harness (`dsh`) is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com).

It is built on an **everything-is-a-plugin** architecture and powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Documentation: [https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## Developer preview

DeepSeek Harness is in _developer preview_ and iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

Review the [safety notice](SAFETY.md) before running the project.

## Run

### Run from `npm`

Install `Node.js`, then run:

```sh
npx @deepseek-ai/dsh web
```

The command starts the Web UI at `http://127.0.0.1:3080` by default and opens it in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

### Run from source

To run from a repository checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` prepares the repository artifacts. `pnpm dsh web` uses those built artifacts without rebuilding.

### Run with a local model from LM Studio

`dsh` can use a model that LM Studio serves on this machine. This setup changes only your profile configuration: it needs no source change, and model requests need no DeepSeek key.

Start the LM Studio local server and load a model, then run `lms ps` to read the model ID and its context length. Run `pnpm dsh --profile web --dump-config > /dev/null` to create the profile, then replace the `[]` line in `~/.dsh/profiles/web/cordis.patch.yml` with this patch:

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

Replace `google/gemma-4-12b-qat` with your model ID in all three places, and set `contextWindow` to the `CONTEXT` value from `lms ps`. Then run `pnpm dsh web`: the model selector shows your model as the default.

- `Authorization` holds a placeholder. The adapter requires this header, and an LM Studio server without API token authentication does not check its value.
- `streamIdleTimeoutMs` allows for long prompts because LM Studio sends no data while it processes a prompt. On an Apple M1 Pro, a 24,000-token prompt took about four minutes.
- `headroomTokens` replaces the default 65,536-token compaction headroom, which is larger than this context window.
- The `headless` profile reads `~/.dsh/profiles/headless/cordis.patch.yml`. Create that profile with `--profile headless` and apply the same patch there.

This setup has two limitations:

- The Web profile does not run automatic compaction for a small context window. Each Web agent preset mounts its own `compaction-basic` row, and this patch does not reach those rows. With default compaction settings and a 30,208-token window, a turn ended without a reply at about 25,000 input tokens. Start a new session when this happens.
- The default web search provider uses DeepSeek credentials, so web search still needs a DeepSeek key or sign-in.

[Configure models](docs/user/guide/providers.md) describes custom model APIs and their other settings.

## Community and support

- Submit feedback or bug reports through [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions).
- Add the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic to your plugin repository for discoverability.
- Join <a href="https://discord.gg/4MrtZUhpxg">DeepSeek Harness Discord community</a>.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md).

`pnpm run dev:web` builds, serves, and rebuilds client bundles on source edits in one terminal, and `make help` lists the matching Make targets for Web and Desktop; the guide's application commands section owns the full table.

For agents, follow [AGENTS.md](AGENTS.md).

## Citation

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## License

[MIT](LICENSE)

Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
