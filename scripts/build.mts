import { $ } from 'zx';

// 环境变量 test | grey | prod 三种
const env = process.env.NODE_ENV || 'prod';
await $`node -v`;
await $`pnpm -v`;
$`echo current env: ${env}`;
$`echo current BASE_URL: ${process.env.BASE_URL}`;
// 根据环境变量做相应的处理
if (['prod', 'grey'].includes(env)) {
  await $`CI= `;
}
// 执行 build 命令
await $`tsc && env-cmd --no-override -e ${env} vite build`;
