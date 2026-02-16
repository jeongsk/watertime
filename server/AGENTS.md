<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# server

## Purpose
Express.js 기반 백엔드 API 서버로 PostgreSQL 데이터베이스와 Redis 캐시를 사용합니다. Prisma ORM을 통해 데이터베이스를 관리하며 JWT 인증과 Firebase Cloud Messaging을 통한 푸시 알림을 지원합니다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 서버 의존성 및 스크립트 |
| `tsconfig.json` | TypeScript 설정 |
| `src/server.ts` | Express 서버 진입점 |
| `.env` | 환경 변수 (프로젝트 루트의 .env.local 사용) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 서버 소스 코드 (see `src/AGENTS.md`) |
| `prisma/` | 데이터베이스 스키마 및 마이그레이션 (see `prisma/AGENTS.md`) |
| `dist/` | TypeScript 컴파일 결과 |
| `scripts/` | 유틸리티 스크립트 |

## For AI Agents

### Working In This Directory
- **Node.js >= 22.11.0** 필요
- **TypeScript 5.9.3** 사용
- Prisma Client 자동 생성 필요: `npm run prisma:generate`

### Testing Requirements
```bash
# 개발 서버 실행
npm run dev          # Nodemon으로 핫 리로드

# 빌드 및 실행
npm run build        # TypeScript -> JavaScript
npm start           # 프로덕션 모드 실행

# 데이터베이스 관리
npm run prisma:generate   # Prisma Client 생성
npm run prisma:migrate    # 마이그레이션 실행
npm run prisma:studio     # Prisma Studio GUI
npm run prisma:seed       # 초기 데이터 시딩
```

### Common Patterns
- **API 라우트**: `/api/<resource>` 패턴
- **미들웨어**: 인증, 에러 처리, 로깅
- **서비스 레이어**: 비즈니스 로직 분리
- **환경 변수**: `dotenv`로 관리

## Dependencies

### Internal
- PostgreSQL 데이터베이스 (Docker 컨테이너)
- Redis 캐시 (Docker 컨테이너)

### External
- **Express 5.2.1** - 웹 프레임워크
- **Prisma 5.22.0** - ORM
- **JWT 9.0.3** - 인증 토큰
- **Bcrypt 6.0.0** - 비밀번호 해싱
- **Firebase Admin 13.6.1** - 푸시 알림
- **Node-cron 4.2.1** - 스케줄링 작업
- **Helmet 8.1.0** - 보안 헤더
- **CORS 2.8.6** - CORS 설정

## API Endpoints

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 수분 섭취
- `POST /api/intake` - 섭취 기록 생성
- `GET /api/intake/daily` - 일일 통계
- `GET /api/intake/history` - 히스토리 조회
- `DELETE /api/intake/:id` - 기록 삭제

### 사용자
- `GET /api/user/profile` - 프로필 조회
- `PUT /api/user/profile` - 프로필 수정
- `PUT /api/user/goal` - 목표 설정
- `GET /api/user/stats` - 통계 정보

<!-- MANUAL: 서버 개발 시 참고할 특별한 사항을 아래에 추가하세요 -->
