# DevTasks ✅

[![React 19](https://img.shields.io/badge/React-19.2.5-black?style=flat-square&logo=react)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4.2.4-black?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite 6](https://img.shields.io/badge/Vite-v6.0.1-black?style=flat-square&logo=vite)](https://vite.dev)
[![GitHub Stars](https://img.shields.io/github/stars/shamilahmdt/devtasks?style=flat-square&logo=github&color=black)](https://github.com/shamilahmdt/devtasks/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)

A high-performance, minimalist task manager designed for developer roadmaps. DevTasks provides a premium, clean monochrome environment with fluid micro-animations, theme toggles, and state persistence to keep your engineering flow uninterrupted.

---

## ✨ Features

* ⚡ **Ultra-Fast Performance**: Built on React 19 and Vite 6 for instant reactivity and hot reloading.
* 🌓 **Dynamic Themes**: Seamless transitions between premium white and deep zinc dark modes.
* 🗂 **Categorized Engineering Tasks**: Group tasks by `FEATURE`, `BUG`, or `REFACTOR` with custom priority weights (`HIGH`, `MEDIUM`, `LOW`).
* 📊 **Roadmap Analytics**: Live visual progress indicators tracking your overall task completion percentage.
* 📜 **System Logs & History**: Dedicated recovery panel to audit and restore deleted tasks back into your roadmap.
* 📦 **Robust Persistence**: State stays persistent across browser reloads using LocalStorage.
* 🔔 **Polished Toasts**: Custom, stylized notifications powered by `sonner` matching the application's clean design.

---

## 🛠️ Tech Stack

* **Core**: [React 19](https://react.dev)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (utility-first, pure custom tokens)
* **Bundler & Dev Server**: [Vite 6](https://vite.dev)
* **Routing**: [React Router v7](https://reactrouter.com)
* **Notifications**: [Sonner](https://emilkowalski.github.io/sonner/)
* **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## 📦 Installation & Quick Start

Get your local development environment running in under 2 minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/shamilahmdt/devtasks.git
cd devtasks
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🤝 Contributing

We love open-source contributions! Whether you're a seasoned developer or looking to make your very first PR, you are welcome here.

⭐ **Support the Project**: If you find DevTasks helpful or are planning to contribute, please consider **giving us a star**! It helps others discover the project and shows your appreciation for our maintainers.

### 🌿 Contribution Pipeline
1. **Fork** the repository and clone your fork locally.
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feat/your-awesome-feature
   ```
3. **Commit your changes** using clean, descriptive commit messages.
4. **Push to your fork** and submit a **Pull Request** targeting our `main` branch.

---

## 💬 Discussions & Community

Got a feature idea, an architectural suggestion, or just want to chat about the roadmap?
* **Join the Conversations**: Head over to our **[GitHub Discussions](https://github.com/shamilahmdt/devtasks/discussions)** page.
* **Pitch New Features**: We love exploring new concepts! Start a discussion thread to discuss layout designs, icons, or state structures before writing code.

---

## 🎯 Active Beginner Issues

Ready to write some code? We actively maintain highly descriptive templates for first-time contributors. Look out for the `good first issue` and `help wanted` labels inside our **[GitHub Issues](https://github.com/shamilahmdt/devtasks/issues)** tracker!

### 💡 Featured Roadmap Tasks
Here are the current active issues open for implementation on our repository:

* 🟢 **Interactive Toast Actions & Route Navigation** ([#87](https://github.com/shamilahmdt/devtasks/issues/87))
  * *Goal*: Add interactive action links inside toast notifications (e.g., direct navigation shortcut back to list or dashboard page) and configure smooth transitions.
  * *Skills*: Toast configuration, navigation APIs, user flow orchestration.

* 🟢 **Improve Keyboard Shortcuts & HUD Browser Compatibility** ([#78](https://github.com/shamilahmdt/devtasks/issues/78))
  * *Goal*: Refactor the keyboard shortcut listener system to resolve compatibility bugs where some keys do not fire correctly on certain OS/browser combinations (such as `Alt` key menu activation in Windows Chrome), and optimize text input focus filtering.
  * *Skills*: Global window event listeners, preventDefault handling, cross-platform key mapping.

* 🟢 **Improve Mobile Responsiveness Across Core Pages** ([#76](https://github.com/shamilahmdt/devtasks/issues/76))
  * *Goal*: Optimize layouts for mobile displays ensuring dashboard cards, task list items, and system logs adapt gracefully to small screen sizes.
  * *Skills*: Responsive design, Tailwind CSS breakpoints, mobile UX.

* 🟢 **Improve Dark Mode Consistency & Consolidate Backup Actions** ([#61](https://github.com/shamilahmdt/devtasks/issues/61))
  * *Goal*: Unify zinc color schemes for perfect dark/light contrast on all components, and consolidate backup actions under a consistent interface.
  * *Skills*: Theme switching, custom design consistency, standard layout rules.

---

## 🚀 Future Architectural Vision (Next Milestones)

We are planning a major milestone refactoring of DevTasks to significantly boost developer workflow speed:

* 🎛️ **The Unified Dev Board & Workspace**: Consolidate `AddTasks`, `ListTasks`, `DeleteHistory`, and `DataCenter` into a single, high-efficiency split-pane dashboard workspace (`/workspace`). This eliminates redundant view-switching and lets developers create, filter, purge, and backup tasks in one cohesive command center.
* 📦 **Minimalist Snippet Vault**: Introduce a companion dashboard (`/snippets`) for engineers to store, search, and instantly copy reusable terminal commands and code blocks with smooth, micro-animated clipboard actions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
