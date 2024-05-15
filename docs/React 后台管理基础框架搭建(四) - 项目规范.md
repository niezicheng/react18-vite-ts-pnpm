# Editor + ESLint + Prettier + husky + lint-staged

## Editor

`VS Code` 商店安装 `EditorConfig for VS Code` 插件，帮助统一编辑器风格

### 配置 EditConfig

```.editorconfig
# Editor configuration, see http://editorconfig.org

root = true                        # 是否为根目录，支持不同层级单独配置

[*]                                # 适用所有文件
indent_style = space               # tab | space
indent_size = 2                    # 缩进
end_of_line = crlf                 # lf | cr | crlf
charset = utf-8                    # 字符集
trim_trailing_whitespace = true    # 自动切掉首尾空格
insert_final_newline = true        # 末尾空行

[*.{js,ts,vue,jsx,tsx}]            # 如何处理这些文件
indent_size = 2                    # 缩进为 2

[*.md]                             # 如何处理这些文件
trim_trailing_whitespace = false   # 不自动切掉首尾空格

```

## Prettier

`VS Code` 商店安装 `Prettier - Code formatter` 插件，帮助将代码格式化为统一风格

### 安装 Prettier

```zsh
npm install prettier -D
```

### 配置 Prettier

```.prettierrc
{
  "useTabs": false, // 使用 tab 缩进
  "tabWidth": 2, // tab 宽度
  "printWidth": 100, // 每行最大长度
  "singleQuote": true, // 使用单引号
  "trailingComma": "none", // 行尾逗号
  "semi": true, // 使用分号
  "arrowParens": "avoid", // 箭头函数参数括号
  "jsxSingleQuote": true, // jsx 使用单引号
  "bracketSpacing": true // 对象字面量的花括号间使用空格
}
```

### 使用 prettier

```zsh
npx prettier --write . # 格式化当前目录下所有文件
```

## husky + lint-staged

### 安装

```zsh
pnpm install husky lint-staged -D
```

### 配置 husky

执行以下命令会在根目录生成 `.husky/` 目录并指定该目录为 `git hooks` 所在的目录

```zsh
npx husky install
```

执行命令添加 `git hooks`，执行下面命令后 `.husky/` 目录下会增加 `pre-commit` 的 `shell` 脚本文件。当在执行 `git commit` 命令前会执行该脚本内容

```zsh
npx husky add .husky/pre-commit "pnpm run lint"
```

### 配置 lint-staged

在 `package.json` 文件中添加以下内容

```json
{
  "scripts": {
    "lint": "lint-staged --allow-empty",
    // "prepare": "husky install"
  },
  "lint-staged": {
    "src/**/!(*.min).js": [
      "prettier --write",
      "eslint --fix"
    ],
    "src/**/*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "src/**/*.{ts,js,tsx,html,css,scss,sass,stylus}": [
      "prettier --write"
    ]
  },
}
```

## commitlint

### 安装

```zsh
pnpm install @commitlint/config-conventional @commitlint/cli -D
```

### 配置

在根目录下创建 `commitlint.config.ts` 文件

```typescript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'header-max-length': [2, 'always', 72],
    'subject-full-stop': [0, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'build']
    ]
  }
};
```

执行命令添加 `git hooks`，执行下面命令后 `.husky/` 目录下会增加 `commit-msg` 的 `shell` 脚本文件。当在执行 `git commit` 命令时会执行该脚本内容

```zsh
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
```

添加 commitlint.config.ts 文件进入 tsconfig.node.json 的 include 中，解决 commitlint 配置文件校验报错问题

```json
{
 "include": ["vite.config.ts", "commitlint.config.ts"]
}
```

更多的规范可以参考我的这篇文章 [Vue3 项目模版搭建（二）](https://juejin.cn/post/7064471026532352037)

## Tailwind CSS

### 安装

```zsh
pnpm install tailwindcss postcss autoprefixer -D
```

```zsh
npx tailwindcss init -p
```

### 配置

在根目录下创建 `tailwind.config.ts` 文件

```typescript
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 禁止 tailwind 的默认样式
    preflight: false
  }
}
```

在根目录下创建 `postcss.config.ts` 文件

```typescript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

在 `vite.config.ts` 文件中添加 `postcss` 配置

```typescript
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ]
    }
  }
});
```

添加 `assets/style/tailwind.less` 文件，引入 `tailwindcss` 样式

```less
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 `src/main.ts` 文件中引入 `tailwindcss` 样式

```typescript
import 'assets/style/tailwind.less'
```

### 使用

解决样式冲突问题

方式一：在 `tailwind.config.ts` 文件中添加 `purge` 配置

```typescript
/** @type {import('tailwindcss').Config} */

export default {
  corePlugins: {
    // 禁止 tailwind 的默认样式
    preflight: false
  }
}
```

方式二：引入其他样式之前导入 Tailwind css 样式文件
