# Collapse Defs

Collapses all function or method blocks in your code using customizable regex patterns.

## 🚀 Usage

- Run the command: **Collapse All Function Blocks**
- Or use the shortcut: `Ctrl+K Ctrl+Shift+{`

This command folds all top-level function definitions in the current file based on the active language.

---

## ⚙️ Configuration

You can override fold patterns per language via `settings.json`:

```jsonc
"collapseDefs.foldPatterns": {
  "python": "^\\s*def\\s+\\w+\\s*\\(.*\\)\\s*:",
  "cpp": "^(?!\\s*(if|else|for|while|switch|do|try|catch|namespace|class|struct|union)\\b)[\\w:<>&\\*,=\\s]+\\s+[\\w:<>&\\*,=\\s]+\\s*\\(.*\\)\\s*(const)?\\s*\\{"
}
```

The keys are language IDs (e.g. `"python"`, `"cpp"`, `"javascript"`), and the values are regex strings used to detect function headers.

If no override is provided, built-in patterns will be used for common languages.

---

## 🧠 Tips

- Only multi-line blocks are folded. One-liners are ignored by design.
- Works with any language — just supply a valid regex!
- Matches are logged in the output panel under **Collapse Defs**.
