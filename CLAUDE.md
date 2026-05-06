# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ELADMIN-MP is a full-stack admin dashboard with separate backend and frontend:
- **Backend**: Spring Boot 3.3.13 + JDK 17 + MyBatis-Plus + Spring Security + JWT + Redis/Druid
- **Frontend**: Vue 3.5 + Vite 5 + Element Plus + Pinia + JavaScript (no TypeScript)

**Important context**: This repo is mid-upgrade from Spring Boot 2.7 + Vue 2 to the current stack. The backend (phase 1) and frontend framework migration (phase 2) are complete, but phase 3 (end-to-end integration testing) is pending. See `UPGRADE.md` for the full migration log and version对照表.

## Repository Structure

```
├── eladmin/                 # Backend (Maven multi-module)
│   ├── eladmin-common/      # Shared utilities, annotations, config, exceptions
│   ├── eladmin-system/      # Core module: AppRun.java entry point, business modules
│   ├── eladmin-logging/     # Logging module
│   ├── eladmin-tools/       # Email, S3-compatible storage, Alipay, local storage
│   └── eladmin-generator/   # Code generator (front + back CRUD templates)
├── eladmin-web/             # Frontend (Vite + Vue 3)
├── sql/                     # Database init scripts
└── UPGRADE.md               # Detailed upgrade tracking doc
```

## Common Commands

### Backend

```bash
# Full build (requires JDK 17+)
cd eladmin && mvn clean install

# Note: The local machine's JAVA_HOME may still point to JDK 1.8.
# If so, temporarily override: JAVA_HOME=E:\codeapp\jdk21 mvn clean install

# Run the application
# In eladmin-system, run AppRun.java (port 18000)
```

The parent `pom.xml` sets `maven-surefire-plugin` to skip tests by default (`<skip>true</skip>`). There are only a handful of unit tests in `eladmin-common/src/test/java`.

### Frontend

```bash
cd eladmin-web

# Dev server (port 18013, proxies /api /auth /avatar /file to localhost:18000)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# ESLint check (Flat Config, 0 errors currently, 12 warnings)
pnpm lint

# Code generator (plop)
pnpm new
```

## Backend Architecture

### Module Boundaries
- `eladmin-common`: Cross-cutting concerns — custom annotations (`@AnonymousAccess`, `@Query`), AOP aspects, base entities, Redis utils, exception handlers, MyBatis-Plus config.
- `eladmin-system`: Entry point `AppRun.java`. Business modules under `modules/`:
  - `security/` — JWT token provider, authentication filters
  - `system/` — User, role, menu, dept, dict, job, timing
  - `maint/` — App deploy, database exec, server monitoring
  - `quartz/` — Scheduled jobs
- `eladmin-logging`: Operation and error logging, consumed by other modules.
- `eladmin-tools`: Third-party integrations (email, S3/Aliyun/OSS, Alipay, local file storage).
- `eladmin-generator`: FreeMarker templates under `src/main/resources/template/admin/` generate controller/service/mapper/frontend Vue files. Templates were updated during the SB3 migration for `jakarta.*` imports and OpenAPI 3 annotations.

### Security Model
- JWT-based stateless auth with RSA encryption for login passwords (public key frontend, private key backend).
- Spring Security 6 lambda DSL configuration in `eladmin-system`.
- `@AnonymousAccess` marks endpoints that bypass auth; `@AnonymousGetMapping` is a convenience variant.
- `AnonTagUtils` scans controllers at startup to collect anonymous URL patterns — it was rewritten for Spring Boot 3's `PathPatternsRequestCondition`.

### Key Config Files
- `eladmin-system/src/main/resources/config/application.yml` — Active profile `dev`, Redis (`spring.data.redis.*`), JWT, task pool.
- `eladmin-system/src/main/resources/config/application-dev.yml` — MySQL/Druid datasource, login captcha, file storage paths, S3 config.
- Knife4j (OpenAPI 3) at `/doc.html`, Druid monitor at `/druid/index.html`.

## Frontend Architecture

### Build & Tooling
- Vite 5 with `@vitejs/plugin-vue` and `@vitejs/plugin-vue-jsx`.
- Sass with modern-compiler API; several deprecation silences configured in `vite.config.js`.
- SVG icon sprite via `vite-plugin-svg-icons` (icons in `src/assets/icons/svg/`).

### State Management (Pinia)
Six stores in `src/store/modules/`:
- `user` — login/logout, user info, roles
- `permission` — dynamic route generation and sidebar routers
- `app` — sidebar collapse, device detection
- `settings` — theme, tagsView, fixedHeader
- `tagsView` — visited views, cached views
- `api` — API base URL from env

### Routing & Permissions
- `src/permission.js` is the global navigation guard.
- On first login, it fetches user info then calls `buildMenus()` to get menu tree from backend.
- `filterAsyncRouter` transforms the menu tree into Vue Router 4 routes and adds them dynamically with `router.addRoute()`.
- `loadView` uses `import.meta.glob` for lazy-loaded page components.

### CRUD Framework
- `src/components/Crud/` provides a reusable CRUD abstraction:
  - `crud.js` — core reactive state and hooks (was migrated from `Vue.observable` to `reactive()`)
  - `CRUD.operation.vue` — table toolbar buttons
  - `RR.operation.vue` / `UD.operation.vue` — row-level refresh/update/delete buttons
- `src/components/Dict/` provides dictionary data binding.
- `@crud` alias points to `src/components/Crud` for convenient imports.

### Notable Migration Artifacts
- `vue-treeselect` was replaced by Element Plus native `el-tree-select`.
- `mavon-editor` replaced by `md-editor-v3`.
- `wangeditor` upgraded to v5 (`@wangeditor/editor`).
- ECharts 5 with `vue-echarts` 7; chart options use flattened `normal:` style (no longer nested).
- `vue-cropper` 1.x for avatar cropping.

## Development Notes

- **JDK requirement**: Backend compiles with JDK 17+. If `java -version` shows 1.8, set `JAVA_HOME` to a JDK 17+ path before Maven commands.
- **Node requirement**: Frontend requires Node >= 18. Package manager is `pnpm`.
- **Database**: MySQL with `gxw` schema (configurable in `application-dev.yml`). The project uses `p6spy` for SQL logging (driver `com.p6spy.engine.spy.P6SpyDriver`).
- **Redis**: Required for session/captcha/online user caching. Configured via `spring.data.redis.*` (Spring Boot 3 path).
- **Proxy during dev**: Frontend dev server proxies API calls to `localhost:18000`. If backend port changes, update `VITE_APP_BASE_API` in `.env.development` or the `vite.config.js` proxy targets.
