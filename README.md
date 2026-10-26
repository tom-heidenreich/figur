# figur

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts --manifest path/to/manifest.json [--case <id>]...
```

To build Docker image:

```bash
docker build . -t figur
```

To run docker image:

```bash
docker run --mount type=bind,src=path/to/directory,dst=/data figur
```

`--manifest` defaults to `./manifest.json`. `--case` can be given multiple times to run only selected cases. Without a `--case` argument, all cases run.

## Inputs

The Inputs are described by a JSON manifest file. A case is the paper document with its artifact (R package).

```json
{
  "version": 1,
  "output": "./output",
  "work": "/tmp/figur-work",
  "cases": [
    {
      "id": "smith2024-lme",
      "paper": { "path": "./papers/smith2024.pdf" },
      "artifact": { "path": "./artifacts/smith2024/pkg/lmeExtra" }
    },
    {
      "id": "doe2023-bayes",
      "paper": { "path": "./papers/doe2023/index.html", "format": "html" },
      "artifact": { "path": "./artifacts/doe2023" },
      "output": "./output/doe-special"
    }
  ]
}
```

| Field                   | Description                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `version`               | Manifest format version, currently `1`.                                                        |
| `output`                | Output root. Each case writes to `<output>/<id>/` unless it sets its own `output`.             |
| `work`                  | Scratch directory for writable copies of artifacts. Defaults to `<os tmpdir>/figur`. optional. |
| `cases[].id`            | Unique ID, matching `[a-z0-9._-]+`.                                                            |
| `cases[].paper.path`    | Path to the paper file.                                                                        |
| `cases[].paper.format`  | `pdf` or `html`. Inferred from the extension (`.pdf`, `.html`, `.htm`) if omitted. optional.   |
| `cases[].artifact.path` | Path to the R package root, i.e. the directory containing `DESCRIPTION`.                       |
| `cases[].output`        | Overrides the case's output directory. optional                                                |

Rules:

- Relative paths are resolved against the directory of the manifest file, so the same manifest works inside and outside the container.
- Unknown fields are rejected.
- The manifest is fully validated before any case runs: paper files and artifact directories must exist, and IDs and output directories must be unique. All problems are reported at once.
