# ELADMIN-WEB

前端基于 Vue 3.5 + Vite 5 + Element Plus 2.8.8 + Pinia 构建。

初始模板参考：[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

#### 环境要求

- **Node.js**: >= 18
- **包管理器**: pnpm（推荐）

#### 安装依赖

```bash
pnpm install
```

#### 开发命令

```bash
# 启动开发服务（默认端口 18013，代理到 localhost:18000）
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview

# ESLint 检查
pnpm lint

# 代码生成（plop）
pnpm new
```

#### 项目结构

```
src/
├── api/                接口请求定义
├── assets/             静态资源（图标、样式、图片）
│   ├── icons/svg/      SVG 图标源文件
│   └── styles/         全局样式、主题变量
├── components/         公共组件
│   ├── Crud/           CRUD 通用组件（表格、工具栏、分页）
│   ├── Dict/           字典数据绑定组件
│   └── IconSelect/     图标选择器
├── layout/             页面布局（侧边栏、导航栏、标签页）
├── router/             路由配置
│   └── index.js        路由定义 + 异步路由加载
├── store/              Pinia 状态管理
│   └── modules/        用户、权限、设置、标签页等
├── utils/              工具函数
│   ├── auth.js         Token 操作
│   ├── permission.js   权限检查
│   └── request.js      Axios 封装
├── views/              页面视图
│   ├── system/         系统管理（用户、角色、菜单、部门）
│   ├── monitor/        系统监控
│   ├── maint/          运维管理
│   ├── generator/      代码生成
│   └── tools/          系统工具
├── App.vue             根组件
├── main.js             入口文件
└── permission.js       路由守卫
```

#### 开发配置

- **代理配置**: `vite.config.js` 中配置开发服务器代理
- **环境变量**: `.env.development` / `.env.production`
- **ESLint**: 使用 Flat Config 配置

#### 常见问题

1. **端口冲突**
   开发服务默认使用 `18013`，如被占用可在 `vite.config.js` 中修改 `server.port`。

2. **代理失效**
   确保后端服务运行在 `localhost:18000`，或在 `vite.config.js` 中调整代理目标。

#### 特别鸣谢

- 感谢 [JetBrains](https://www.jetbrains.com/) 提供的非商业开源软件开发授权
- 感谢 [PanJiaChen](https://github.com/PanJiaChen/vue-element-admin) 大佬提供的前端模板
- 感谢 [Moxun](https://github.com/moxun1639) 大佬提供的前端 CRUD 通用组件

#### 反馈交流

- QQ 交流群：891137268、947578238、659622532
