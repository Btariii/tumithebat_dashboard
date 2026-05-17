import re

with open("src/App.css", "r") as f:
    content = f.read()

color_map = {
    "#0d1117": "var(--bg-main)",
    "#161b22": "var(--bg-card)",
    "#30363d": "var(--border-color)",
    "#e5e7eb": "var(--text-main)",
    "#8b949e": "var(--text-muted)",
    "#ffffff": "var(--text-bright)",
    "#d9f924": "var(--accent-color)",
    "#c6e31e": "var(--accent-hover)",
    "#000000": "var(--accent-text)",
    "#1a2315": "var(--bg-gradient-center)"
}

for color, var in color_map.items():
    content = re.sub(color, var, content, flags=re.IGNORECASE)

root_vars = """
:root {
  --bg-main: #0d1117;
  --bg-card: #161b22;
  --border-color: #30363d;
  --text-main: #e5e7eb;
  --text-muted: #8b949e;
  --text-bright: #ffffff;
  --accent-color: #d9f924;
  --accent-hover: #c6e31e;
  --accent-text: #000000;
  --bg-gradient-center: #1a2315;
}

[data-theme='light'] {
  --bg-main: #f0f4f8;
  --bg-card: #ffffff;
  --border-color: #d1d5db;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --text-bright: #111827;
  --accent-color: #3b82f6;
  --accent-hover: #2563eb;
  --accent-text: #ffffff;
  --bg-gradient-center: #e0e7ff;
}

[data-theme='light'] .pill-dot.high, [data-theme='light'] .risk-tag.high .pill-dot { background: #ef4444; }
[data-theme='light'] .pill-dot.low, [data-theme='light'] .risk-tag.low .pill-dot { background: #22c55e; }
"""

new_content = root_vars + content

with open("src/App.css", "w") as f:
    f.write(new_content)

print("Updated App.css with CSS variables.")
