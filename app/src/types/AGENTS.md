<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# types

## Purpose
TypeScript 타입 정의가 포함된 디렉토리입니다. 앱 전체에서 사용되는 인터페이스와 타입을 관리합니다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 모든 타입을 export하는 진입점 |

## For AI Agents

### Working In This Directory
- **인터페이스**: `I` 접두사 없이 명사형
- **타입 별칭**: `T` 접두사 없이 명사형
- **열거형**: 대문자 스네이크 케이스

### Common Patterns
```typescript
// 엔티티 타입
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// API 요청/응답 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// 네비게이션 타입
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

// 상태 타입
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}
```

<!-- MANUAL: 타입 관련 특별한 사항을 아래에 추가하세요 -->
