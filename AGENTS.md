<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# WaterTime

## Purpose
개인화된 수분 섭취량과 스마트 알림을 제공하는 AI 기반 건강 관리 앱입니다. React Native로 구현된 모바일 앱과 Node.js/Express 백엔드로 구성된 크로스 플랫폼 프로젝트입니다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 프로젝트 메타데이터 및 워크스페이스 설정 |
| `README.md` | 프로젝트 개요, 빠른 시작, 기술 스택 |
| `docker-compose.yml` | PostgreSQL, Redis 컨테이너 구성 |
| `.env.example` | 환경 변수 템플릿 |
| `.gitignore` | Git 추적 제외 파일 설정 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | React Native 모바일 앱 (see `app/AGENTS.md`) |
| `server/` | Express.js 백엔드 API (see `server/AGENTS.md`) |
| `docs/` | 프로젝트 문서 (see `docs/AGENTS.md`) |
| `scripts/` | 빌드 및 배포 스크립트 (see `scripts/AGENTS.md`) |
| `.github/` | GitHub Actions 워크플로우 (see `.github/AGENTS.md`) |
| `.claude/` | Claude Code 설정 |

## For AI Agents

### Working In This Directory
- **Node.js >= 22.11.0** 와 **npm >= 10.0.0** 필요
- 워크스페이스 기반 모노레포 구조입니다 (`app`, `server`)
- 모든 명령어는 루트 `package.json` 스크립트 사용

### Testing Requirements
```bash
# 전체 테스트
npm run test

# 개별 워크스페이스 테스트
npm run test:app      # React Native 앱
npm run test:server   # 백엔드 API

# Lint 검사
npm run lint
```

### Common Patterns
- **워크스페이스 명령**: `npm run <script> --workspace=<workspace-name>`
- **Docker 서비스**: `docker-compose up -d postgres redis`
- **데이터베이스 설정**: `npm run db:setup && npm run db:seed`

## Dependencies

### External
- **Node.js 22.x** - 런타임
- **Docker Compose** - 컨테이너 오케스트레이션
- **PostgreSQL 15** - 기본 데이터베이스
- **Redis 7** - 캐시 및 세션 저장소

### Development Tools
- **Concurrently** - 병렬 프로세스 실행
- **Prettier** - 코드 포맷팅
- **ESLint** - 코드 린팅

## Project Status
- **MVP 완료**: 2026-02-15
- **API 엔드포인트**: 11개 구현 완료
- **프론트엔드 화면**: 5개 구현 완료
- **테스트 커버리지**: 75% (목표 80%)

<!-- MANUAL: 프로젝트 전체에 적용되는 중요한 참고 사항을 아래에 추가하세요 -->
