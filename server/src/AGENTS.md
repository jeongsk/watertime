<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# src

## Purpose
Express.js 백엔드 서버의 핵심 소스 코드가 포함된 디렉토리입니다. 라우트, 컨트롤러, 서비스, 미들웨어, 설정 등으로 구조화되어 있습니다.

## Key Files

| File | Description |
|------|-------------|
| `server.ts` | 서버 진입점 |
| `app.ts` | Express 앱 설정 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `routes/` | API 라우트 정의 |
| `services/` | 비즈니스 로직 |
| `middleware/` | 인증, 에러 처리 미들웨어 |
| `config/` | 데이터베이스, JWT 설정 |
| `database/` | 데이터베이스 초기화 |
| `utils/` | 유틸리티 함수 |

## For AI Agents

### Working In This Directory
- **TypeScript strict mode** 사용
- **계층형 아키텍처**: Routes → Services → Database
- **에러 처리**: 통일된 에러 미들웨어

### Common Patterns
- **라우트**: `routes/*.routes.ts`
- **서비스**: `services/*.service.ts`
- **미들웨어**: `middleware/*.middleware.ts`

## Dependencies

### Internal
- Prisma Client - ORM
- PostgreSQL - 데이터베이스
- Redis - 캐시

### External
- Express 5.2.1
- JWT 9.0.3
- Bcrypt 6.0.0

<!-- MANUAL: 서버 소스 코드 관련 특별한 사항을 아래에 추가하세요 -->
