<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# hooks

## Purpose
커스텀 React Hooks가 포함된 디렉토리입니다. 재사용 가능한 상태 로직과 사이드 이팩트를 캡슐화합니다.

## For AI Agents

### Working In This Directory
- Hooks는 `use` 접두사 사용
- 타입 안전한 Hooks 작성
- 의존성 배열 명시

### Common Patterns
```typescript
import { useState, useEffect } from 'react';

export function useCustomHook(initialValue: Type) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // 사이드 이팩트
    return () => {
      // 정리
    };
  }, [dependencies]);

  return { state, setState };
}
```

<!-- MANUAL: Hooks 관련 특별한 사항을 아래에 추가하세요 -->
