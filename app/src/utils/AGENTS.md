<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# utils

## Purpose
유틸리티 함수와 헬퍼들이 포함된 디렉토리입니다.

## Key Files

| File | Description |
|------|-------------|
| `WidgetDataManager.ts` | 위젯 데이터 관리 유틸리티 |

## For AI Agents

### Working In This Directory
- 순수 함수 작성
- 타입 안전성 유지
- 재사용성 고려

### Common Patterns
```typescript
// 유틸리티 함수 예시
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

<!-- MANUAL: 유틸리티 관련 특별한 사항을 아래에 추가하세요 -->
