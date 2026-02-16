<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# theme

## Purpose
앱의 테마, 색상, 타이포그래피, 스타일 정의가 포함된 디렉토리입니다.

## For AI Agents

### Working In This Directory
- **색상 시스템**: 기본 색상, 의미론적 색상 정의
- **타이포그래피**: 폰트 크기, lineHeight, fontWeight
- **스페이싱**: 간격 단위

### Common Patterns
```typescript
// colors.ts
export const Colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  text: '#000000',
};

// typography.ts
export const Typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
};

// spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

<!-- MANUAL: 테마 관련 특별한 사항을 아래에 추가하세요 -->
