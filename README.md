# Collapse Defs

**Selectively** collapse function and method definitions in your code using customizable regex patterns — unlike "Fold All" which collapses everything (classes, loops, conditionals, etc.), this extension focuses on just the blocks you care about.

## 🚀 Usage

- Run the command: **Collapse All Function Blocks**
- Or use the shortcut: `Ctrl+K Ctrl+Shift+{`

This command folds all function definitions in the current file based on the active language.

---

## 🎯 Why Use This?

**Standard "Fold All" (`Ctrl+K Ctrl+0`) collapses everything:**

- Classes
- Loops (`for`, `while`)
- Conditionals (`if`, `switch`)
- Try-catch blocks
- Functions

**Collapse Defs only folds what you want** — typically just functions and methods, giving you a clean overview of your code's structure without hiding control flow.

With creative regex patterns, you can collapse any subset of blocks: only public methods, only async functions, only exported functions — whatever helps you navigate your code.

---

## 📋 Supported Languages (Built-in Patterns)

The extension comes with default patterns for:

- **Python** - `def` and `async def` functions
- **JavaScript** - Named functions, anonymous functions, arrow functions
- **TypeScript** - Functions, methods, arrow functions (with type annotations)
- **Java** - Methods with access modifiers
- **C#** - Methods with access modifiers
- **C** - Function definitions
- **C++** - Function definitions (excludes control flow keywords)

No pattern for your language? Just add a custom regex in settings!

---

## ⚙️ Configuration

### Custom Fold Patterns

Override or add fold patterns per language via `settings.json`:

```jsonc
"collapseDefs.foldPatterns": {
  "python": "^\\s*(async\\s+)?def\\s+\\w+\\s*\\(.*\\)\\s*(\\s*->\\s*[^:]+)?:$",
  "javascript": "^.*(async\\s+)?function(\\s+\\w+)?\\s*\\([^)]*\\)\\s*\\{$|^.*(async\\s+)?\\([^)]*\\)\\s*=>\\s*\\{$",
  "css": "^.*\\{$",
  "html": "^\\s*<[^/>]+>\\s*$"
}
```

The keys are VS Code language IDs (e.g., `"python"`, `"cpp"`, `"javascript"`), and the values are regex strings that match the opening line of a block.

### Debug Mode

Enable debug logging to see which lines are being matched:

```jsonc
"collapseDefs.debug": true
```

Output appears in the **Collapse To Defs** panel (View → Output → select "Collapse To Defs" from dropdown).

---

## 🧠 How It Works

The extension:

1. Scans the file from bottom to top
2. Tests each line against your regex pattern
3. Verifies the next line exists and is indented (multi-line block detection)
4. Folds the block if all conditions pass

**One-liners are ignored by design** — only actual multi-line blocks get folded.

---

## 💡 Examples

### Fold only exported TypeScript functions

```jsonc
"typescript": "^\\s*export\\s+(async\\s+)?function\\s+\\w+\\s*\\([^)]*\\).*\\{$"
```

### Fold CSS rule blocks

```jsonc
"css": "^.*\\{$"
```

### Fold HTML opening tags

```jsonc
"html": "^\\s*<[^/>]+>\\s*$"
```

Get creative with your patterns to collapse exactly what you need!

---

## 📝 License

MIT
