<h1 style="text-align: center">ELADMIN 后台管理系统</h1>

#### 项目简介
一个基于 Spring Boot 3.3.13、JDK 17、MyBatis-Plus、JWT、Spring Security 6、Redis、Vue 3.5 的前后端分离后台管理系统

**开发文档：** [https://eladmin.vip](https://eladmin.vip)

**体验地址：** [https://eladmin.vip/demo](https://eladmin.vip/demo)

**账号密码：** `admin / 123456`

#### 项目源码

| github                                 | gitee                                  |
|----------------------------------------|----------------------------------------|
| https://github.com/elunez/eladmin-mp   | https://gitee.com/elunez/eladmin-mp    |

#### 主要特性
- 使用最新技术栈，社区资源丰富
- 高效率开发，代码生成器可一键生成前后端代码
- 支持数据字典，可方便地对一些状态进行管理
- 支持接口限流，避免恶意请求导致服务层压力过大
- 支持接口级别的功能权限与数据权限，可自定义操作
- 自定义权限注解与匿名接口注解，可快速对接口拦截与放行
- 对常用前端组件封装：表格数据请求、数据字典等
- 前后端统一异常拦截处理，统一输出异常，避免繁琐的判断
- 支持在线用户管理与服务器性能监控，支持限制单用户登录
- 支持运维管理，可方便地对远程服务器的应用进行部署与管理

#### 系统功能
- 用户管理：提供用户的相关配置，新增用户后，默认密码为 123456
- 角色管理：对权限与菜单进行分配，可根据部门设置角色的数据权限
- 菜单管理：已实现菜单动态路由，后端可配置化，支持多级菜单
- 部门管理：可配置系统组织架构，树形表格展示
- 岗位管理：配置各个部门的职位
- 字典管理：可维护常用一些固定的数据，如：状态、性别等
- 系统日志：记录用户操作日志与异常日志，方便开发人员定位排错
- SQL 监控：采用 Druid 监控数据库访问性能，默认用户名 admin，密码 123456
- 定时任务：整合 Quartz 做定时任务，加入任务日志，任务运行情况一目了然
- 代码生成：高灵活度生成前后端代码，减少大量重复的工作任务
- 邮件工具：配合富文本，发送 HTML 格式的邮件
- 对象存储：支持市面上大多数对象存储，兼容亚马逊 S3 协议，如七牛云、阿里云等
- 支付宝支付：整合了支付宝支付并且提供了测试账号，可自行测试
- 服务监控：监控服务器的负载情况
- 运维管理：一键部署你的应用

#### 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.3.13 | 后端框架 |
| JDK | 17+ | Java 运行环境 |
| MyBatis-Plus | 3.5+ | ORM 框架 |
| Spring Security | 6 | 安全框架 |
| JWT | - | 身份认证 |
| Redis | - | 缓存 / 会话 |
| Druid | - | 数据库连接池 |
| Vue | 3.5 | 前端框架 |
| Vite | 5 | 前端构建工具 |
| Element Plus | 2.8.8 | UI 组件库 |
| Pinia | 2 | 状态管理 |

#### 项目结构
项目采用按功能分模块的开发方式，结构如下

- `eladmin-common` 为系统的公共模块，各种工具类、公共配置存在该模块
- `eladmin-system` 为系统核心模块也是项目入口模块，也是最终需要打包部署的模块
- `eladmin-logging` 为系统的日志模块，其他模块如果需要记录日志需要引入该模块
- `eladmin-tools` 为第三方工具模块，包含：邮件、对象存储、本地存储、支付宝
- `eladmin-generator` 为系统的代码生成模块，支持生成前后端 CRUD 代码

#### 详细结构

```
├── eladmin-common         公共模块
│   ├── annotation         系统自定义注解
│   ├── aspect             自定义注解的切面
│   ├── base               Entity 基类
│   ├── config             项目通用配置
│   │   ├── MyBatis-Plus 配置
│   │   ├── Web 配置（跨域、静态资源映射）
│   │   ├── Redis / Redisson / 异步线程池配置
│   │   └── 权限拦截、Druid 配置
│   ├── exception          统一异常处理
│   └── utils              系统通用工具类
│       ├── SecurityUtils  安全工具类
│       ├── RedisUtils     Redis 工具类
│       ├── StringUtils    字符串工具类
│       └── FileUtil       文件工具类
├── eladmin-system         系统核心模块（启动入口）
│   ├── sysrunner          程序启动后处理数据
│   └── modules            业务模块（登录授权、系统监控、定时任务、运维模块）
├── eladmin-logging        日志模块
├── eladmin-tools          第三方工具模块
│   ├── email              邮件工具
│   ├── storage            对象存储 / 本地存储
│   └── alipay             支付宝支付
└── eladmin-generator      代码生成模块
```

#### 快速开始

```bash
# 编译打包（需要 JDK 17+）
mvn clean install

# 运行
# 在 eladmin-system 模块中运行 AppRun.java（默认端口 18000）
```

#### 特别鸣谢

- 感谢 [PanJiaChen](https://github.com/PanJiaChen/vue-element-admin) 大佬提供的前端模板
- 感谢 [Moxun](https://github.com/moxun1639) 大佬提供的前端 CRUD 通用组件
- 感谢 [zhy6599](https://gitee.com/zhy6599) 大佬提供的后端运维管理相关功能
- 感谢 [j.yao.SUSE](https://github.com/everhopingandwaiting) 大佬提供的匿名接口与 Redis 限流等功能

#### 反馈交流
- QQ 交流群：891137268、947578238、659622532
