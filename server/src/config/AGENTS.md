<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# config

## Purpose
데이터베이스 연결, JWT 설정 등 서버 구성 파일이 포함된 디렉토리입니다.

## Key Files

| File | Description |
|------|-------------|
| `database.ts` | Prisma 클라이언트 설정 |
| `jwt.ts` | JWT 토큰 설정 |

## For AI Agents

### Working In This Directory
- **환경 변수**: `process.env` 사용
- **Prisma 단일 인스턴스**: 싱글톤 패턴
- **JWT 비밀키**: `.env`에서 관리

### Common Patterns
```typescript
// database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;

// jwt.ts
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
```

## Dependencies

### External
- Prisma Client
- JWT
- Dotenv

<!-- MANUAL: 설정 관련 특별한 사항을 아래에 추가하세요 -->
