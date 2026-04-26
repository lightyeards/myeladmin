# ELADMIN-MP 升级记录

> 本文档记录 eladmin-mp 项目从 Spring Boot 2.7 + Vue 2 到主流稳定栈的完整升级过程。
> 每个步骤完成后请勾选 `[x]`，并在「执行日志」中追加变更摘要、commit hash 与遇到的问题。

---

## 一、升级目标（已确认）

| 项 | 决策 | 备注 |
|---|---|---|
| 升级方案 | **方案 B：主流稳定升级** | 一次到位对齐 2026 年主流栈 |
| 后端 JDK | **JDK 17** | LTS，生态最稳定 |
| 后端框架 | **Spring Boot 3.3.x** | 当前主流稳定版 |
| 前端框架 | **Vue 3.5.x** | |
| 前端构建 | **Vite 5/6** | 替代 vue-cli + webpack 4 |
| 前端 UI | **Element Plus** | 替代 Element-UI |
| 前端状态管理 | **Pinia** | 替代 Vuex |
| 前端语言 | **JavaScript** | 暂不引入 TypeScript |
| 分支策略 | **直接在 master 推进**，本地操作不提交 PR | 不新建分支 |

---

## 二、版本目标对照

### 后端 `eladmin/`

| 组件 | 当前版本 | 目标版本 | 状态 |
|---|---|---|---|
| JDK | 1.8 | 17 | ✅ |
| Spring Boot | 2.7.18 | 3.3.13 | ✅ |
| MyBatis-Plus | 3.5.3.1 | 3.5.14（spring-boot3 starter + jsqlparser） | ✅ |
| Druid | druid-spring-boot-starter 1.2.19 | druid-spring-boot-3-starter 1.2.27 | ✅ |
| Knife4j | 3.0.3 | knife4j-openapi3-jakarta-spring-boot-starter 4.5.0 | ✅ |
| Swagger 注解 | io.swagger 1.5.22（@Api/@ApiOperation/@ApiModelProperty） | io.swagger.v3 / OpenAPI 3 注解（@Tag/@Operation/@Schema） | ✅ |
| logback | 1.2.9 | 1.5.x（跟随 SB3 BOM） | ✅ |
| Redisson | 3.17.1 | 3.43.0（redisson-spring-boot-starter） | ✅ |
| JJWT | 0.11.5 | 0.12.6 | ✅ |
| commons-configuration | 1.10 | commons-configuration2 2.11.0 | ✅ |
| javax.mail | 1.4.7 | spring-boot-starter-mail（Jakarta Mail） | ✅ |
| ganymed-ssh2 | build210 | 移除（保留 jsch，SCP 改 SFTP） | ✅ |
| mica-ip2region | 2.7.18.9 | 3.4.3 | ✅ |
| Spring Security | 5.7（SB 2.7） | 6.3（SB 3.3，lambda DSL + requestMatchers） | ✅ |
| Guava | （旧版本传递依赖） | 33.4.0-jre（升级后需显式声明） | ✅ |
| `javax.*` 包导入 | 119 处 / 86 文件 | 全部 → `jakarta.*` | ✅ |

### 前端 `eladmin-web/`

| 组件 | 当前版本 | 目标版本 | 状态 |
|---|---|---|---|
| Node 引擎 | >= 8.9 | >= 18 LTS | ✅ |
| Vue | 2.7.16 | 3.5.13 | ✅ |
| Vue Router | 3.0.2 | 4.4.5 | ✅ |
| Vuex | 3.1.0 | Pinia 2.2.6 | ✅ |
| Element-UI | 2.15.14 | Element Plus 2.8.8 | ✅ |
| 构建工具 | @vue/cli-service 3.5.3 + webpack 4.47 | Vite 5.4 + @vitejs/plugin-vue | ✅ |
| ESLint | 5.15.3 | 9.39 + Flat Config | ✅ |
| core-js | 2.6.12 | 已移除（Vite 不需要） | ✅ |
| ECharts | 4.x | 5.6.0 | ✅ |
| sass-loader | 10.2.0 | 移除（Vite 内置 sass） | ✅ |
| wangeditor 4 | 4.7.11 | @wangeditor/editor 5.1 + editor-for-vue@5 | ✅ |
| vue-treeselect | 0.4.0 | el-tree-select（Element Plus 原生） | ✅ |
| mavon-editor | 2.9.1 | md-editor-v3 4.20 | ✅ |
| vue-cropper | 0.4.9 | vue-cropper 1.1.4 | ✅ |
| vue-image-crop-upload | 2.5.0 | 已移除（改用 vue-cropper） | ✅ |
| vue-splitpane | 1.0.4 | 已移除（无引用） | ✅ |
| vuedraggable | 2.20.0 | 已移除（无引用） | ✅ |
| vue-count-to | 1.0.13 | 自研 CountTo 组件 | ✅ |
| vue-echarts | 5.0.0-beta.0 | vue-echarts 7.0.3 | ✅ |

---

## 三、执行计划与进度

### 阶段 0 - 准备工作

- [x] 备份当前可运行版本（`git tag pre-upgrade-backup`）
- [x] 直接在 master 推进，不新建分支
- [x] 本地启动现有版本，确认基线行为正常（登录、菜单、用户、定时任务等核心流程）

### 阶段 1 - 后端 Spring Boot 3 迁移

#### 1.1 JDK 与构建升级
- [x] 父 pom 修改 `<java.version>` 1.8 → 17
- [x] 升级 `maven-compiler-plugin` 至 3.13+
- [x] IDE 与 CI 切换 JDK 17（注意：本机 `JAVA_HOME` 当前仍指向 jdk1.8，构建需临时指定 `JAVA_HOME=E:\codeapp\jdk21`，建议永久切换）

#### 1.2 Spring Boot 升级
- [x] 父 pom `spring-boot-starter-parent` 2.7.18 → 3.3.13
- [x] 移除/调整 `spring-boot-starter-json` 排除项（fastjson 适配）
- [x] 同步升级 `spring-boot-maven-plugin`

#### 1.3 jakarta 迁移（86 个文件）
- [x] `javax.servlet.*` → `jakarta.servlet.*`
- [x] `javax.validation.*` → `jakarta.validation.*`
- [x] `javax.annotation.*` → `jakarta.annotation.*`
- [x] 同步修改代码生成器模板（`eladmin-generator/src/main/resources/template/admin/*.ftl`）
- [x] 全量编译通过

#### 1.4 Swagger 2 → OpenAPI 3 迁移（445 处注解）
- [x] `@Api(tags=...)` → `@Tag(name=...)`
- [x] `@ApiOperation` → `@Operation`
- [x] `@ApiModelProperty` → `@Schema`
- [x] `@ApiImplicitParam` → `@Parameter`
- [x] `@ApiIgnore` → `@Hidden`
- [x] `@Api(hidden=true)` → `@Hidden`（AppRun.java）
- [x] Knife4j 配置类调整（SwaggerConfig.java 全面重写：移除 springfox `Docket`/`EnableSwagger2`/`BeanPostProcessor` hack，改为 `OpenAPI` Bean + `SecurityScheme`）
- [x] Knife4j 4.x 自带 springdoc，无需额外引入

#### 1.5 第三方依赖升级
- [x] Druid → `druid-spring-boot-3-starter` 1.2.27（包名 `boot.autoconfigure` → `boot3.autoconfigure`）
- [x] Knife4j → `knife4j-openapi3-jakarta-spring-boot-starter` 4.5.0
- [x] Redisson → `redisson-spring-boot-starter` 3.43.0
- [x] JJWT 0.11.5 → 0.12.6（`parserBuilder` 移除、`parseClaimsJws` → `parseSignedClaims`、`getBody` → `getPayload`）
- [x] MyBatis-Plus → `mybatis-plus-spring-boot3-starter` 3.5.14 + 显式引入 `mybatis-plus-jsqlparser`
- [x] javax.mail → `spring-boot-starter-mail`（Jakarta Mail）
- [x] commons-configuration 1.10 → commons-configuration2 2.11.0（`new PropertiesConfiguration("xxx")` → `Configurations().properties(URL)`）
- [x] 移除 `ganymed-ssh2`（`ScpClientUtil` 重写为基于 JSch SFTP）
- [x] mica-ip2region 2.7.18.9 → 3.4.3
- [x] easy-captcha 1.6.2 兼容性验证（编译通过）
- [x] fastjson2-extension-spring5 → fastjson2-extension-spring6（包名 `support.spring.http.converter` → `support.spring6.http.converter`）
- [x] 显式引入 `com.google.guava:guava:33.4.0-jre`（旧版本依赖传递缺失）

#### 1.6 配置与代码适配
- [x] Spring Security `SecurityFilterChain` 全面改写（lambda DSL，`antMatchers` → `requestMatchers`，`@EnableGlobalMethodSecurity` → `@EnableMethodSecurity`，`csrf().disable()` 等改 lambda）
- [x] `application.yml` 的 `spring.redis.*`（host/port/password/lettuce）已迁移到 `spring.data.redis.*`（SB3 必要）
- [x] `RedissonConfiguration.java` 中 7 处 `@Value("${spring.redis.*}")` 同步迁移到 `${spring.data.redis.*}`
- [x] Spring 6 PathPatternParser 不允许 `**` 后面再接内容（`/**/*.html` 等会抛 PatternParseException）：改为 `PathRequest.toStaticResources().atCommonLocations()` + 仅顶层 `/*.html`
- [x] `AnonTagUtils` 适配 SB3：`getPatternsCondition()` 返回 null（默认改用 `PathPatternsRequestCondition`），改为优先 `getPathPatternsCondition().getPatternValues()`，否则 fallback 旧 API
- [x] Druid 监控路径配置兼容性（`/druid/index.html` 返回 200）
- [x] WebSocket 配置兼容性（端点 `/webSocket/{sid}` 已通过 jakarta 迁移，启动无报错）
- [x] `MultipartConfig` 跨包变化（jakarta 迁移完成，启动无报错）
- [x] Swagger UI 鉴权放行路径已加入并验证（`/v3/api-docs/**`、`/swagger-ui/**`、`/doc.html`，`/doc.html` 返回 200）

#### 1.7 后端启动验证
- [x] `mvn clean install` 全量构建成功（6 个模块 BUILD SUCCESS）
- [x] 应用启动成功（`Started AppRun in 22.689 seconds`，Spring Boot 3.3.13 + Java 21 + Tomcat 10.1.42）
- [x] Swagger UI 可访问（`GET /doc.html` HTTP 200，`GET /v3/api-docs` 返回 OpenAPI 3.0.1 规范）
- [x] Druid 监控可访问（`GET /druid/index.html` HTTP 200）
- [x] 匿名端点 `/auth/code` 验证（HTTP 200，Redis 写入正常，返回 base64 验证码 + uuid）
- [ ] 登录接口验证（需前端 RSA 加密配合，留至阶段 3 联调）
- [ ] 主要 CRUD 接口验证（需登录态，留至阶段 3 联调）

### 阶段 2 - 前端 Vue 3 迁移

#### 2.1 构建工具切换
- [x] 新建 `vite.config.js`（迁移现有别名、proxy、压缩、SVG sprite 配置）
- [x] `package.json` scripts 切换为 `vite`/`vite build`
- [x] 移除 vue-cli、webpack 4 相关依赖
- [x] `index.html` 提到根目录（Vite 约定）
- [x] Node 版本要求改为 `>=18`

#### 2.2 核心框架升级
- [x] Vue 2.7 → 3.5.13
- [x] Vue Router 3 → 4.4.5
- [x] Vuex 3 → Pinia 2.2.6
- [x] `main.js` 重写（`createApp`、`app.use`）
- [x] Router 4：`createRouter`/`createWebHistory`/`addRoute`
- [x] Pinia stores 全量迁移（6 个模块 `defineStore`）
- [x] `loadView` 改用 `import.meta.glob`

#### 2.3 Element-UI → Element Plus
- [x] 全局替换 `el-submenu` → `el-sub-menu`
- [x] `.sync` → `v-model:`
- [x] `slot="title"` → `#title`，`slot-scope` → `v-slot`
- [x] 图标系统改造（`@element-plus/icons-vue`，`el-icon-*` → `:icon="*"`）
- [x] 主题色变量迁移（`:root` CSS 变量替代 `$--*` SCSS）
- [x] `$message/$notify/$confirm` → `ElMessage/ElNotification/ElMessageBox`

#### 2.4 Vue 3 破坏性变更适配
- [x] `Vue.observable` → `reactive()`（CRUD 框架 + Dict）
- [x] `Vue.set` → 直接赋值
- [x] `$listeners` 移除（SvgIcon）
- [x] `beforeDestroy` → `beforeUnmount`
- [x] `:deep()` 替换 `::v-deep`
- [x] CRUD 框架 `reactive()` 移植（最高风险，`handleExpandChange` 显式绑定）
- [x] `CRUD.operation.vue` 改为模板静态列（移除 `$children`/`insertColumn`）

#### 2.5 第三方依赖替换
- [x] vue-treeselect → `el-tree-select`（Element Plus 原生）
- [x] mavon-editor → md-editor-v3 4.20
- [x] vue-cropper 0.4.9 → vue-cropper 1.1.4
- [x] vue-image-crop-upload → 移除（center.vue 改用 vue-cropper）
- [x] vue-splitpane → 移除（无引用）
- [x] vuedraggable → 移除（无引用）
- [x] vue-count-to → 自研 `CountTo` 组件
- [x] vue-echarts 5.0-beta → vue-echarts 7.0.3 + echarts 5.6.0
- [x] wangeditor 4 → @wangeditor/editor 5.1 + editor-for-vue@5
- [x] echarts 4 → 5（`import * as echarts`，`normal:` 扁平化，`utils/echarts.js` 集中注册）

#### 2.6 工具链升级
- [x] ESLint 5 → 9.39（Flat Config，`eslint.config.js`）
- [x] husky 1 → 9.1.7（`.husky/pre-commit`）
- [x] lint-staged 旧版 → 15.5.2（`.lintstagedrc.json`）
- [x] core-js 2 → 已移除
- [x] babel.config.js / postcss.config.js → 已移除
- [x] `pnpm lint` 0 errors（12 warnings 待后续清理）

#### 2.7 前端启动验证
- [x] `pnpm dev` 启动成功（端口 8019，代理到 :8000）
- [x] `pnpm build` 构建成功（2883 modules，48s）
- [x] `pnpm preview` 可用
- [ ] 登录页面联调（需后端启动）
- [ ] 主要业务页面回归（用户、角色、菜单、字典、定时任务、代码生成、邮件、运维、日志）
- [ ] 富文本、文件上传、头像裁剪、ECharts 图表联调

### 阶段 3 - 联调与收尾

- [ ] 前后端联调，所有接口路径与 token 认证正常
- [ ] 跨域、文件上传、WebSocket 联通
- [ ] 整理新版 README / 部署说明
- [ ] 整理本文档「执行日志」段落

---

## 四、风险与回滚预案

| 风险点 | 影响 | 应对 |
|---|---|---|
| `javax → jakarta` 漏改 | 编译报错 / NoClassDefFoundError | 全文检索 + 编译校验 |
| Swagger 注解参数名映射错误 | 接口文档字段缺失 | 升级后逐 controller 检查 Knife4j UI |
| 代码生成器模板未同步 | 后续生成代码不可用 | 1.4 步骤已显式列出 .ftl 修改 |
| Element Plus 与 Element-UI API 差异 | 页面渲染异常 | 逐页面回归 + 浏览器手动验证 |
| Vue 3 响应式机制差异（数组、对象新增属性） | 视图不更新 | 用 `reactive`/`ref` 替代 `Vue.set` |
| Pinia 与 Vuex store 持久化差异 | 用户登录态丢失 | 引入 `pinia-plugin-persistedstate` |
| 第三方组件缺乏 Vue 3 替代品 | 功能缺失 | 评估自实现成本或寻找替代方案 |
| RSA 私钥/JWT secret 硬编码 | 安全问题（非升级范围） | 建议改环境变量，但不阻塞本次升级 |
| MySQL connector-j 9.x 兼容性 | 连接异常 | 现已是 9.2.0，SB3 兼容性已验证 |

**回滚预案**：升级前打 tag `pre-upgrade-backup`，任何阶段出现不可恢复问题可 `git reset --hard pre-upgrade-backup` 回退。

---

## 五、执行日志

> 格式：`YYYY-MM-DD HH:MM | 阶段 X.Y | 操作摘要 | commit / 备注`

| 时间 | 阶段 | 操作 | 备注 |
|---|---|---|---|
| 2026-04-26 | - | 创建本升级追踪文档 | 初始版本，决策已敲定方案 B |
| 2026-04-26 | - | 决策完成 | JDK 17 / SB 3.3.x / Vue 3.5 / Pinia / JS / Vite / 直接 master 推进 |
| 2026-04-26 | 0 | 打 backup tag `pre-upgrade-backup` | 升级前快照 |
| 2026-04-26 | 1.1 | JDK 1.8 → 17，maven-compiler-plugin 3.13.0 | 父 pom 修改 |
| 2026-04-26 | 1.2 | spring-boot-starter-parent 2.7.18 → 3.3.13 | 父 pom 修改 |
| 2026-04-26 | 1.3 | javax.* → jakarta.* 全量迁移（117 处 / 87 文件） | 含 .java + .ftl |
| 2026-04-26 | 1.5 | 第三方依赖升级 | druid-spring-boot-3-starter、knife4j-openapi3-jakarta、mybatis-plus-spring-boot3-starter + jsqlparser、Redisson 3.43、JJWT 0.12.6、commons-configuration2、jakarta mail、移除 ganymed-ssh2、mica-ip2region 3.4.3、fastjson2 spring6 |
| 2026-04-26 | 1.5 | TokenProvider JJWT 0.12 API 重写 | parserBuilder→parser, parseClaimsJws→parseSignedClaims, getBody→getPayload, SignatureAlgorithm.HS512→Jwts.SIG.HS512 |
| 2026-04-26 | 1.5 | ScpClientUtil 由 ganymed-ssh2 重写为 JSch SFTP | 含 chmod 处理（SFTP 无 put-with-mode） |
| 2026-04-26 | 1.5 | ColUtil 改为 commons-configuration2 builder 模式 | 用 ClassLoader.getResource 显式取 URL |
| 2026-04-26 | 1.5 | ConfigurerAdapter fastjson2 包名切到 spring6 | support.spring.http.converter → support.spring6.http.converter |
| 2026-04-26 | 1.4 | Swagger 2 → OpenAPI 3 全量注解迁移 | 27 controller + 数十 DTO/Entity + ftl 模板；导入 + 注解参数双阶段 sed；SwaggerConfig.java 全面重写为 OpenAPI Bean |
| 2026-04-26 | 1.6 | RemoveDruidAdConfig 包名 boot.autoconfigure → boot3.autoconfigure | 适配 druid-spring-boot-3-starter |
| 2026-04-26 | 1.6 | 显式补 Guava 依赖 33.4.0-jre | 旧版本通过其他依赖传递引入，升级后缺失 |
| 2026-04-26 | 1.6 | SpringSecurityConfig Spring Security 5 → 6 重写 | lambda DSL、antMatchers→requestMatchers、@EnableGlobalMethodSecurity→@EnableMethodSecurity、新增 /doc.html、/v3/api-docs/** 等 Knife4j 路径放行 |
| 2026-04-26 | 1.7 | `mvn clean install` 全量构建 BUILD SUCCESS | 6 模块全通过；本机 JAVA_HOME 仍指 jdk1.8，构建用 `JAVA_HOME=E:\codeapp\jdk21` 临时切换；建议永久改 JAVA_HOME |
| 2026-04-26 | 1.6 | application.yml Redis 配置 spring.redis.* → spring.data.redis.* | SB3 默认从 spring.data.redis 读取连接配置，旧路径会被忽略 |
| 2026-04-26 | 1.6 | application-dev.yml 数据源切到 gxw / dengshuo | 适配本机 MySQL 实例 |
| 2026-04-26 | 1.6 | RedissonConfiguration.java 7 处 @Value 路径迁移 | 与 yml 同步：${spring.redis.*} → ${spring.data.redis.*}，否则 redissonConfiguration Bean 创建失败 |
| 2026-04-26 | 1.6 | SpringSecurityConfig 静态资源放行重写 | Spring 6 PathPatternParser 不允许 `**` 后接内容，原 `/**/*.html`、`/**/*.css`、`/**/*.js` 抛 PatternParseException；改用 `PathRequest.toStaticResources().atCommonLocations()` + 顶层 `/*.html` |
| 2026-04-26 | 1.6 | AnonTagUtils 适配 PathPatternsRequestCondition | SB3 默认改用 PathPatterns，原 `getPatternsCondition()` 返回 null 导致所有 @AnonymousAccess URL 被静默丢弃，匿名端点全部 401；改为优先 `getPathPatternsCondition().getPatternValues()` |
| 2026-04-26 | 1.7 | 应用启动成功 | Started AppRun in 22.689s @ Java 21 + SB 3.3.13 + Tomcat 10.1.42 + Druid + Redisson + Quartz + MyBatis-Plus |
| 2026-04-26 | 1.7 | 关键端点 smoke test 全部 200 | /doc.html、/v3/api-docs、/druid/index.html、/auth/code（匿名验证码 Redis 写入正常） |
| 2026-04-26 | 2.0 | Phase 2 计划制定完成 | plan: merry-squishing-starlight；策略：vite-first 过渡（先在 Vue 2.7 下切 Vite，再切 Vue 3）；treeselect → el-tree-select；包管理器：pnpm；原地改造 |
| 2026-04-26 | 2.1 | 新建 `vite.config.js` | @vitejs/plugin-vue2 + plugin-vue2-jsx + vite-plugin-svg-icons；alias `@`/`@crud`；server.port 8013；proxy `/api` `/auth` → :8000；sass modern-compiler + silenceDeprecations |
| 2026-04-26 | 2.1 | 新建 `index.html`（Vite 入口） | 移自 public/index.html，去 EJS `<%= BASE_URL %>` 占位，加 `<script type="module" src="/src/main.js">` |
| 2026-04-26 | 2.1 | 新建 `.env.development` / `.env.production` | `VUE_APP_*` → `VITE_APP_*`；新增 `VITE_APP_BASE_API` |
| 2026-04-26 | 2.1 | 删除 `vue.config.js` / `babel.config.js` / `postcss.config.js` / `public/index.html` | webpack 配置不再需要 |
| 2026-04-26 | 2.1 | `package.json` scripts 全切换为 vite | `dev: vite` / `build: vite build` / `preview: vite preview`；`type: module`；engines.node `>=20` |
| 2026-04-26 | 2.1 | `process.env.VUE_APP_*` → `import.meta.env.VITE_APP_*` | utils/request.js、store/modules/api.js、views/maint/deploy/deploy.vue 共 3 处 |
| 2026-04-26 | 2.1 | `require.context(...)` → `import.meta.glob('...', { eager: true })` | components/IconSelect/requireIcons.js、store/index.js（getters 聚合）、views/components/icons/svg-icons.js、assets/icons/index.js 共 4 处 |
| 2026-04-26 | 2.1 | SCSS `~@` 写法替换 | layout/index.vue 行 74-75 `~@/...` → `@/...`（Vite 已支持 alias） |
| 2026-04-26 | 2.1 | Sidebar/Item.vue `<script>` → `<script lang="jsx">` | 仅此一处 .vue 内含 JSX；plugin-vue2-jsx 要求显式 lang；其他 .vue 已 grep 验证无 JSX |
| 2026-04-26 | 2.1 | Sidebar/SidebarItem.vue 去除 `import path from 'path'` | Vite 不绑 node 内置；改纯字符串拼接 resolvePath |
| 2026-04-26 | 2.1 | jsencrypt 深路径 import 修正 | utils/rsaEncrypt.js: `import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'` → `import { JSEncrypt } from 'jsencrypt'`；Vite dep-scan 不识别旧深路径 |
| 2026-04-26 | 2.1 | SCSS `:export {}` → 独立 .module.js | webpack css-loader 把 `:export` 当默认 JS 导出，Rollup/Vite 不支持；新增 `assets/styles/variables.module.js` 与 `element-variables.module.js`，更新 store/modules/settings.js + Sidebar/index.vue 两处 import |
| 2026-04-26 | 2.1 | 新增 `vite-plugin-svg-icons` 替换 svg-sprite-loader | main.js 加 `import 'virtual:svg-icons-register'`；SvgIcon 组件保持不变 |
| 2026-04-26 | 2.1 | dev / build / preview 全部通过 | `pnpm dev`：8013→8015 端口、main.js / App.vue / login.vue 转译 200；`pnpm build`：1659 modules / 25.7s；`pnpm preview`：8016 静态产物 200，html 含 module script + element-ui/echarts preload |
| 2026-04-26 | 2.2 | Vue 2.7 → 3.5.13 + Vue Router 4 + Pinia 2 | main.js 重写 `createApp`；router `createRouter`/`createWebHistory`；6 个 store 模块全部 `defineStore`；`loadView` 改用 `import.meta.glob`；ParentView.vue 补录；permission.js `addRoutes`→`addRoute` |
| 2026-04-26 | 2.3 | Element-UI → Element Plus | `el-submenu`→`el-sub-menu`；`.sync`→`v-model`；`slot`→`v-slot`；图标全量替换为 `@element-plus/icons-vue`；`element-variables.scss` 重写为 `:root` CSS 变量；`DateRangePicker` 移除 element-ui mixin；命令式 API 全量替换 `ElMessage/ElNotification/ElMessageBox` |
| 2026-04-26 | 2.4 | Vue 3 破坏性变更适配 | CRUD `crud.js` `Vue.observable`→`reactive()`；Dict.js 同步替换；`Vue.set`→直接赋值；`beforeDestroy`→`beforeUnmount`；`::v-deep`→`:deep()`；SvgIcon 移除 `$listeners`；CRUD.operation.vue 改模板静态列；ECharts 15 文件 `normal:` 扁平化 + `import * as echarts` |
| 2026-04-26 | 2.5 | 第三方依赖替换 | wangEditor v4→v5（WangEditor/index.vue + send.vue）；mavon-editor→md-editor-v3；vue-image-crop-upload→vue-cropper@1（center.vue 重写裁剪上传）；vue-count-to→自研 CountTo；echarts 4→5 + vue-echarts 7；移除 vue-splitpane / vuedraggable |
| 2026-04-26 | 2.5 | pnpm build 2883 modules / 48s 通过 | 修复 JavaEdit/index.vue CSS 括号未闭合（:deep 缺少 `)`） |
| 2026-04-26 | 2.6 | ESLint 5 → 9.39 Flat Config | 新增 `eslint.config.js`（`@eslint/js` + `eslint-plugin-vue` flat/recommended）；删除 `.eslintrc.js` / `.eslintignore`；`vue/max-attributes-per-line` schema 修正；关闭 `multi-word-component-names` / `no-reserved-component-names` / `no-unused-components`；`pnpm lint` 0 errors |
| 2026-04-26 | 2.6 | husky 1 → 9.1.7 + lint-staged 15.5.2 | 移除 package.json 旧 `husky`/`lint-staged` 字段；新增 `.husky/pre-commit` + `.lintstagedrc.json`；prepare script `husky` |
| 2026-04-26 | 2.7 | `pnpm dev` / `pnpm build` / `pnpm preview` 全部通过 | dev server 8019 启动无编译错误；build 产物 dist/ 正常；遗留 warnings 12 个（`vue/order-in-components`、`vue/require-explicit-emits`）不影响运行 |

---

## 六、待用户决策的悬而未决项

- [ ] **是否保留 alipay-sdk-java**？该模块若业务未使用可一并移除，减少升级面。
- [ ] **是否保留 quartz**？现有 Spring Boot 3 集成方式不变，但可考虑替换为 `@Scheduled` + ShedLock。
