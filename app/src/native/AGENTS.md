<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# native

## Purpose
네이티브 모듈 인터페이스가 포함된 디렉토리입니다. iOS/Android 네이티브 코드와의 브리지를 담당합니다.

## Key Files

| File | Description |
|------|-------------|
| `WaterTimeWidgetModule.ts` | 위젯 네이티브 모듈 인터페이스 |

## For AI Agents

### Working In This Directory
- **TurboModules** 패턴 사용
- TypeScript 인터페이스 정의
- 네이티브 메서드 선언

### Common Patterns
```typescript
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getConstants(): { [key: string]: any };
  nativeMethod(param: Type): Promise<ResultType>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('WaterTimeWidget');
```

## Dependencies

### External
- React Native Turbo Modules

<!-- MANUAL: 네이티브 모듈 관련 특별한 사항을 아래에 추가하세요 -->
