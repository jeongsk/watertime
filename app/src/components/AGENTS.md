<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# components

## Purpose
재사용 가능한 UI 컴포넌트가 포함된 디렉토리입니다. 차트, 카드, 버튼 등 공통으로 사용되는 컴포넌트들을 관리합니다.

## Key Files

| File | Description |
|------|-------------|
| `StatCard.tsx` | 통계 카드 컴포넌트 |
| `WaterLineChart.tsx` | 꺾은선 그래프 컴포넌트 |
| `WaterBarChart.tsx` | 막대 그래프 컴포넌트 |

## For AI Agents

### Working In This Directory
- 모든 컴포넌트는 TypeScript로 작성
- Props 인터페이스 명시
- StyleSheet를 사용한 스타일링

### Common Patterns
```typescript
interface Props {
  // props 정의
}

export default function ComponentName({ ...props }: Props) {
  // 컴포넌트 로직
  const styles = useStyles();

  return (
    // JSX
  );
}
```

## Dependencies

### Internal
- `../types/` - 타입 정의
- `../theme/` - 테마 설정

### External
- React Native Chart Kit - 차트 라이브러리
- React Native SVG - 벡터 그래픽

<!-- MANUAL: 컴포넌트 관련 특별한 사항을 아래에 추가하세요 -->
