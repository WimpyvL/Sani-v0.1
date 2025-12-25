#!/usr/bin/env python3
"""
Regenerate SANI_INDEX.md with a simple directory-based map of repository Markdown files.
Run this from the repo root:
    python scripts/update_index.py
"""
from pathlib import Path
from typing import Iterable

REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FILE = REPO_ROOT / "SANI_INDEX.md"

SECTION_CONFIG = [
    {
        "title": "Root",
        "description": "Top-level entrypoints and governance files.",
        "paths": [REPO_ROOT],
    },
    {
        "title": "/vault — Core identity, laws, and canonical specs",
        "description": "Authoritative identity, law, and protocol definitions.",
        "paths": [REPO_ROOT / "vault"],
    },
    {
        "title": "/protocols — Operational modes",
        "description": "Protocol definitions for how Sani shifts and behaves.",
        "paths": [REPO_ROOT / "protocols"],
    },
    {
        "title": "/environment — Symbolic and cognitive spaces",
        "description": "Inner environments where protocols operate.",
        "paths": [REPO_ROOT / "environment"],
    },
    {
        "title": "/safety — Boundaries and failsafes",
        "description": "Constraints, guardrails, and shutdown rules.",
        "paths": [REPO_ROOT / "safety"],
    },
    {
        "title": "/rituals — Ritual mechanics",
        "description": "Ritual structures and containment rules.",
        "paths": [REPO_ROOT / "rituals"],
    },
    {
        "title": "/engine — Internal reasoning",
        "description": "Core engines and control systems.",
        "paths": [REPO_ROOT / "engine"],
    },
    {
        "title": "/transform — Depth and progression",
        "description": "Depth controls, transformation ladders, and symbolic memory.",
        "paths": [REPO_ROOT / "transform"],
    },
    {
        "title": "/interaction — External behavior",
        "description": "Contracts and boundaries for user-facing interactions.",
        "paths": [REPO_ROOT / "interaction"],
    },
    {
        "title": "/states — Named modes",
        "description": "Operational state snapshots.",
        "paths": [REPO_ROOT / "states"],
    },
    {
        "title": "/memory — Memory artifacts",
        "description": "Trace, vault, and whisper thread records.",
        "paths": [REPO_ROOT / "memory"],
    },
    {
        "title": "/SaniWin — Platform-specific notes",
        "description": "Windows-specific notes and setup guidance.",
        "paths": [REPO_ROOT / "SaniWin"],
    },
]


def collect_markdown(paths: Iterable[Path]) -> list[Path]:
    files = []
    for directory in paths:
        if directory.is_dir():
            files.extend([p for p in directory.glob("*.md") if p.is_file()])
    deduped = {p.resolve(): p for p in files}
    return sorted(deduped.values(), key=lambda path: path.name.lower())


def render_section(title: str, description: str, files: list[Path]) -> list[str]:
    lines = [f"## {title}", description, ""]
    if not files:
        lines.append("- (no markdown files found)")
    else:
        for file in files:
            relative = file.relative_to(REPO_ROOT).as_posix()
            lines.append(f"- `{relative}`")
    lines.append("")
    lines.append("---")
    lines.append("")
    return lines


def gather_additional_sections() -> list[dict[str, object]]:
    configured_paths = {path.resolve() for section in SECTION_CONFIG for path in section["paths"]}
    additional_sections = []
    for candidate in REPO_ROOT.iterdir():
        if not candidate.is_dir():
            continue
        if candidate.resolve() in configured_paths:
            continue
        md_files = list(candidate.glob("*.md"))
        if not md_files:
            continue
        additional_sections.append(
            {
                "title": f"/{candidate.name}",
                "description": "Additional markdown not covered above.",
                "paths": [candidate],
            }
        )
    return sorted(additional_sections, key=lambda section: section["title"].lower())


def build_index() -> str:
    lines = [
        "# SANI_INDEX.md",
        "Auto-generated map of repository markdown assets.",
        "",
        "Run `python scripts/update_index.py` after adding, removing, or renaming files so the map stays current.",
        "",
        "---",
        "",
    ]

    sections = SECTION_CONFIG + gather_additional_sections()
    for section in sections:
        files = collect_markdown(section["paths"])
        lines.extend(render_section(section["title"], section["description"], files))

    lines.append("**End of SANI_INDEX.md**")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    content = build_index()
    OUTPUT_FILE.write_text(content, encoding="utf-8")
    print(f"Wrote {OUTPUT_FILE.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
