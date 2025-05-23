# Exclude Mocks in Go to Implementation

[![Version](https://img.shields.io/vscode-marketplace/v/zihxs.exclude-mocks-go-to-impl)](https://marketplace.visualstudio.com/items?itemName=zihxs.exclude-mocks-go-to-impl)
[![Downloads](https://img.shields.io/vscode-marketplace/d/zihxs.exclude-mocks-go-to-impl)](https://marketplace.visualstudio.com/items?itemName=zihxs.exclude-mocks-go-to-impl)
[![License](https://img.shields.io/github/license/ZihxS/exclude-mocks-go-to-impl)](LICENSE)

**A Visual Studio Code extension to exclude mock files when using "Go to Implementation" in Go projects.**

---

## Description

This extension improves the default **Go to Implementation** behavior in Visual Studio Code for Go projects by **filtering out mock files** (e.g., `*_mock.go`, `mocks/*`) from navigation results. It is ideal for projects using mock generators like [gomock](https://github.com/golang/mock) or custom mock directories.

---

## Key Features

- ✅ Filters files based on customizable glob patterns (e.g., `**/*_mock.go`, `**/mocks/**/*.go`).
- ✅ Customize mock file patterns via `settings.json`.
- ✅ Displays a pick list if multiple valid implementations exist.
- ✅ Replaces the native `Go to Implementation` command (`ctrl+f12` or `cmd+f12` for mac) without disrupting normal usage.

---

## Installation

### From Visual Studio Code Marketplace (Recommended)
1. Open Visual Studio Code.
2. Open the Extensions Panel (`Ctrl + Shift + X` or `Cmd + Shift + X`).
3. Search for `Exclude Mocks in Go to Implementation`.
4. Click **Install**.

### Manual (For Development)
1. Clone the repository:
   ```bash
   git clone https://github.com/ZihxS/exclude-mocks-go-to-impl.git
   ```
2. Navigate to the directory:
   ```bash
   cd exclude-mocks-go-to-impl
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run compile
   ```
5. Run the extension in debug mode:
   - Open the folder in VS Code.
   - Press `F5` to launch the extension host.

---

## Usage

1. Open a `.go` file in Visual Studio Code.
2. Click on an **interface method** or **function signature**.
3. Press (`ctrl+f12` or `cmd+f12` for mac) to trigger **Go to Implementation**.
4. The extension will:
   - Fetch implementation locations from the language server (e.g., `gopls`).
   - Filter out mock files based on configured patterns.
   - Navigate to the result or show a pick list.

---

## Configuration

Customize mock file patterns in `settings.json`:

```js
{
  "excludeMockFiles.patterns": [
    "**/*_mock.go",     // Files ending with _mock.go
    "**/mock/**/*.go",  // Files in mock directories
    "**/mocks/**/*.go", // Files in mocks directories
    "**/mock_*.go"      // Files starting with mock_ followed by any characters
  ]
}
```

### Example Custom Patterns:
```js
{
  "excludeMockFiles.patterns": [
    "**/test/**",       // Files in test directories
    "**/testdata/**",   // Files in test directories
    "**/stubs/**/*.go", // Files in stubs directories
    "**/generated/*.go" // Auto-generated files
  ]
}
```

---

## Dependencies

- **[gopls](https://pkg.go.dev/golang.org/x/tools/gopls)**: Go language server supporting `Go to Implementation`.
- **[minimatch](https://www.npmjs.com/package/minimatch)**: For flexible glob pattern matching.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork this repository.
2. Create a feature branch: `git checkout -b new-feature`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin new-feature`.
5. Submit a Pull Request.

---

## License

MIT © [Muhammad Saleh Solahudin](https://github.com/ZihxS)

---

## Issues or Suggestions?

Report bugs or request features at:
[https://github.com/ZihxS/exclude-mocks-go-to-impl/issues](https://github.com/ZihxS/exclude-mocks-go-to-impl/issues)

---

## Keywords

`Go`, `Golang`, `VSCode`, `Mock`, `Go to Implementation`, `gopls`, `Mock Generator`, `Interface Navigation`

---

## Notes

- Works only for Go files (`editorLangId == 'go'`).
- Does not interfere with built-in commands for other languages.

---

### Example Output

#### Before (Without Extension)
```
interfaces.go:10: func DoSomething()
→ Implementations found:
  - service.go
  - mocks/mock_service.go
  - testdata/fake_service.go
```

#### After (With Extension)
```
interfaces.go:10: func DoSomething()
→ Implementations found:
  - service.go
```