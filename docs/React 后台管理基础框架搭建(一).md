React 后台项目基础框架搭建

## 前言

近期刚好在准备一个新的后台项目，所以就想着搭建一个基础框架，方便后续开发。虽然网上有很多现成的框架，如：[Antd pro](https://pro.ant.design/zh-CN/)、[react admin](https://marmelab.com/react-admin/) 等，但是个人感觉他们的定制化还是太强，并不太适合。所以，这里自己搭建一个基础的后台管理项目。

技术点：

> [React v18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite v5](https://vitejs.dev/) + [React Router v6](https://reactrouter.com/en/main) + [Redux Toolkit](https://redux-toolkit.js.org/) + [Antd v5](https://ant.design/index-cn)

## 项目初始化

使用 [vite](https://vitejs.dev/guide/) 提供的 `react-ts` 模版

```zsh
pnpm create vite react18-vite-ts-pnpm --template react-ts
```

### 文件警告处理

**Q1**：非 `node` 模块解析下无法指定 `resolveJsonModule` 选项。如下图所示：

![image-20231219111933268](/Users/10036514/Library/Application Support/typora-user-images/image-20231219111933268.png)

**解决方案**：修改模块解析策略  `moduleResolution` 改为 `node` 方式，如下所示：

```json
// tsconfig.json
{
	"compilerOptions": {
		"moduleResolution": "node",
		"allowSyntheticDefaultImports": true,
		"resolveJsonModule": true,
	}
}

// tsconfig.node.json
{
	"compilerOptions": {
		"moduleResolution": "node",
	}
}
```

更多参考 [moduleResolution 总结](https://juejin.cn/post/7221551421833314360)

**Q2**: `.eslintrc.cjs` 文件警告：`Missed semicolon (CssSyntaxError)stylelint(CssSyntaxError)`。如下图所示：

![image-20231219111100101](/Users/10036514/Library/Application Support/typora-user-images/image-20231219111100101.png)

**解决方案**：项目根目录下创建 `.stylelintignore` 文件，忽略 `.eslintrc.cjs` 文件。如下所示：

```.stylelintignore
/.svelte/
/build/
/functions/
/node_modules/
/static/
/tmp/

*.cjs
*.json
*.txt
```

更多参考 [eslintrc.cjs: Missed semicolon (CssSyntaxError)](https://github.sheincorp.cn/stylelint/vscode-stylelint/issues/160)

如遇到每个文件第一行都报有该警告，可以尝试检查 stylelint 相应插件版本【我这里是之前安装了stylelint-plus 导致的，卸载就好了】

![image-20240423142441004](/Users/10036514/Library/Application Support/typora-user-images/image-20240423142441004.png)

### 路径别名处理

`Vite` 项目中 `TypeScript` 路径别名，使用 [vite-tsconfig-paths](https://www.npmjs.com/package/vite-tsconfig-paths) 插件处理，安装插件如下所示：

```zsh
pnpm i vite-tsconfig-paths -D
```

在 `vite.config.ts` 中配置插件，如下所示：

```typescript
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths()],
})
```

结合 `tsconfig.json` 中的 `baseUrl` 配置，如下所示：

```json
{
	"compilerOptions": {
		"baseUrl": "./src",
	}
}
```

## 菜单配置

后台管理基础框架搭建(二) - 路由、菜单联动

### 状态管理

后台管理基础框架搭建(三) - 状态管理

### 项目规范

后台管理基础框架搭建(四) - 项目规范
