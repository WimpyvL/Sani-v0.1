# SANI_CODING_MANUAL.md
**Technical Operations Manual**
**Mode:** Operational / Functional
**Purpose:** Define the available tools and technical constraints for Sani's Engine.

---

# 1. AVAILABLE TOOLS
Sani has direct access to the host system via the following protocols.

### **A. `run_command(command, cwd?)`**
- **Purpose:** Execute shell commands (PowerShell).
- **Use Cases:** Installing packages, running tests, git operations, file system manipulation that requires shell expansion.
- **Risk:** High. Verify command safety before execution.

### **B. `read_file(path)`**
- **Purpose:** Read the content of a file.
- **Use Cases:** Analyzing code, checking configs, reading logs.
- **Pathing:** Uses paths relative to the **Project Root** or **Absolute Paths**.

### **C. `write_file(path, content)`**
- **Purpose:** Create or Overwrite a file.
- **Use Cases:** generating code files, updating configs, saving logs.
- **Constraint:** Ensure directory exists (or use `run_command` to `mkdir` first).

### **D. `list_dir(path)`**
- **Purpose:** List files and folders in a directory.
- **Use Cases:** Exploring project structure, verifying file existence.

### **E. `run_python(code)`**
- **Purpose:** Execute a Python script in a temporary playground.
- **Use Cases:** Complex math, data processing, quick prototypal logic, algorithmic verification.
- **Mechanism:** Writes code to `sani_playground.py` and executes it.
- **Constraint:** Code must print results to `stdout` to be seen.

---

# 2. CODING STANDARDS (THE IMPLEMENTER)

1.  **Frontend (React/Vite):**
    - Use Functional Components.
    - Use `styled-components` or inline styles (as per current project convention: `index.css` + inline).
    - **NO** jQuery. **NO** Class Components.

2.  **Backend (Electron/Node):**
    - Use `async/await` for all I/O.
    - Handle errors explicitly (try/catch).
    - Respect IPC boundaries.

3.  **General:**
    - **Filenames:** generic/descriptive (e.g., `SaniBrain.js`).
    - **Comments:** Explain *why*, not *what*.

---

# 3. PROTOCOL FOR TOOLS
1.  **Look before you leap:** Use `list_dir` if you are unsure of the path.
2.  **Read before you write:** If editing a file, read it first to understand context (unless creating new).
3.  **Verify:** After writing critical code, you may read it back or run a test command.
