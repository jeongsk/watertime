<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# middleware

## Purpose
Express 미들웨어가 포함된 디렉토리입니다. 인증, 에러 처리, 로깅 등 요청/응답 처리를 위한 중간 계층을 구현합니다.

## Key Files

| File | Description |
|------|-------------|
| `auth.middleware.ts` | JWT 인증 미들웨어 |

## For AI Agents

### Working In This Directory
- **인증 순서**: 토큰 검증 → 사용자 조회 → req.user 할당
- 실패 시 401 응답
- req 객체에 사용자 정보 주입

### Common Patterns
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Dependencies

### External
- JWT 9.0.3
- Express types

<!-- MANUAL: 미들웨어 관련 특별한 사항을 아래에 추가하세요 -->
