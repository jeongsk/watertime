<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# prisma

## Purpose
Prisma ORM 스키마, 마이그레이션, 시드 파일이 포함된 디렉토리입니다. 데이터베이스 구조를 정의하고 관리합니다.

## Key Files

| File | Description |
|------|-------------|
| `schema.prisma` | 데이터베이스 스키마 정의 |
| `seed.ts` | 초기 데이터 시딩 스크립트 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `migrations/` | 데이터베이스 마이그레이션 기록 |
| `seed/` | 시드 데이터 파일 |

## For AI Agents

### Working In This Directory
- **스키마 수정 후**: `npm run prisma:migrate` 실행
- **Prisma Client 생성**: `npm run prisma:generate`
- **데이터베이스 GUI**: `npm run prisma:studio`

### Common Patterns
```prisma
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  relations  Intake[]
}
```

## Dependencies

### External
- Prisma 5.22.0
- PostgreSQL 15

## Prisma Commands

```bash
# 마이그레이션 생성 및 실행
npm run prisma:migrate

# Client 생성
npm run prisma:generate

# Studio 실행
npm run prisma:studio

# 시드 데이터 로드
npm run prisma:seed
```

<!-- MANUAL: Prisma 관련 특별한 사항을 아래에 추가하세요 -->
