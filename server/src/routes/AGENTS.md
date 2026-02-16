<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# routes

## Purpose
Express 라우트 정의가 포함된 디렉토리입니다. 각 API 엔드포인트의 경로와 미들웨어 체인을 설정합니다.

## Key Files

| File | Description |
|------|-------------|
| `auth.routes.ts` | 인증 관련 라우트 (회원가입, 로그인) |
| `user.routes.ts` | 사용자 관련 라우트 |
| `intake.routes.ts` | 수분 섭취 관련 라우트 |
| `notification.routes.ts` | 알림 관련 라우트 |

## For AI Agents

### Working In This Directory
- 라우트는 `/api/<resource>` 패턴 따름
- 인증이 필요한 라우트는 `auth.middleware` 사용
- 요청 검증은 라우트 레벨에서 수행

### Common Patterns
```typescript
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as controller from '../controllers/resource.controller';

const router = express.Router();

// 공개 라우트
router.post('/', controller.create);

// 인증 필요 라우트
router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
```

## Dependencies

### Internal
- `../middleware/` - 인증 미들웨어
- `../services/` - 비즈니스 로직

### External
- Express Router

<!-- MANUAL: 라우트 관련 특별한 사항을 아래에 추가하세요 -->
