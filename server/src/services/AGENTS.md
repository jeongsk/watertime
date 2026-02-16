<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# services

## Purpose
비즈니스 로직과 데이터 처리를 담당하는 서비스 레이어입니다. 데이터베이스 연산, 외부 API 호출, 푸시 알림 등의 핵심 기능을 구현합니다.

## Key Files

| File | Description |
|------|-------------|
| `notification.service.ts` | 알림 관련 비즈니스 로직 |
| `push.service.ts` | FCM/APNS 푸시 알림 발송 |

## For AI Agents

### Working In This Directory
- **Prisma Client**로 데이터베이스 접근
- 비동기 함수로 작성
- 에러 처리와 트랜잭션 관리

### Common Patterns
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const serviceName = {
  async create(data: CreateInput) {
    return await prisma.model.create({ data });
  },

  async findById(id: string) {
    return await prisma.model.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateInput) {
    return await prisma.model.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return await prisma.model.delete({ where: { id } });
  },
};
```

## Dependencies

### Internal
- Prisma Client
- Redis 캐시

### External
- Firebase Admin - 푸시 알림
- Node-cron - 스케줄링

<!-- MANUAL: 서비스 관련 특별한 사항을 아래에 추가하세요 -->
