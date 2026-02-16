<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# src

## Purpose
React Native 앱의 핵심 소스 코드가 포함된 디렉토리입니다. 컴포넌트, 화면, 서비스, 상태 관리, 네비게이션, 타입 정의 등으로 구조화되어 있습니다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 앱 진입점 (없을 경우 생성 필요) |
| `types/index.ts` | TypeScript 타입 정의 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | 재사용 가능한 UI 컴포넌트 |
| `screens/` | 앱 화면 (홈, 프로필, 통계 등) |
| `services/` | API 호출 및 비즈니스 로직 |
| `store/` | Redux 상태 관리 |
| `navigation/` | 화면 전환 네비게이션 |
| `hooks/` | 커스텀 React Hooks |
| `utils/` | 유틸리티 함수 |
| `native/` | 네이티브 모듈 인터페이스 |
| `theme/` | 테마 및 스타일 정의 |

## For AI Agents

### Working In This Directory
- **TypeScript strict mode** 사용
- 컴포넌트는 함수형 + Hooks 패턴
- 상태 관리는 Redux Toolkit 사용
- API 호출은 서비스 레이어로 분리

### Common Patterns
- **컴포넌트**: `export default function ComponentName()`
- **스타일**: `StyleSheet.create()` 또는 `styled-components`
- **타입**: `types/index.ts`에 중앙 집중화
- **네비게이션**: React Navigation v7

## Dependencies

### Internal
- `server/` - 백엔드 API

### External
- React Native 0.84.0
- Redux Toolkit 2.11.2
- React Navigation 7.x
- Axios 1.13.5

<!-- MANUAL: 앱 소스 코드 관련 특별한 사항을 아래에 추가하세요 -->
