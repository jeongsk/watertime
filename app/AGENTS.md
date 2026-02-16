<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# app

## Purpose
React Native 기반 모바일 앱으로 iOS 및 Android 플랫폼을 지원하는 WaterTime의 프론트엔드 애플리케이션입니다. Redux Toolkit을 사용한 상태 관리와 React Navigation을 사용한 화면 전환을 구현했습니다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 앱 의존성 및 스크립트 |
| `tsconfig.json` | TypeScript 설정 |
| `.eslintrc.js` | ESLint 규칙 |
| `babel.config.js` | Babel 트랜스파일 설정 |
| `metro.config.js` | Metro 번들러 설정 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 애플리케이션 소스 코드 (see `src/AGENTS.md`) |
| `android/` | Android 네이티브 프로젝트 |
| `ios/` | iOS 네이티브 프로젝트 |
| `__tests__/` | 단위 테스트 파일 |
| `__mocks__/` | 테스트용 모의 데이터 |
| `assets/` | 이미지, 폰트 등 정적 리소스 |

## For AI Agents

### Working In This Directory
- **Node.js >= 22.11.0** 필요
- React Native 0.84.0 기반
- TypeScript 엄격 모드 사용
- iOS 개발은 macOS만 지원

### Testing Requirements
```bash
# 앱 실행
npm start              # Metro 번들러 시작
npm run android        # Android 에뮬레이터/기기 실행
npm run ios           # iOS 시뮬레이터/기기 실행 (macOS만)

# 테스트
npm test              # Jest 단위 테스트
npm run lint          # ESLint 검사
```

### Common Patterns
- **네비게이션**: React Navigation v7 사용
- **상태 관리**: Redux Toolkit + Redux Persist
- **API 호출**: Axios 인스턴스 사용
- **스타일링**: StyleSheet API 또는 Styled Components

## Dependencies

### Internal
- `server/` - 백엔드 API (http://localhost:3000)

### External
- **React Native 0.84.0** - 모바일 프레임워크
- **TypeScript 5.8.3** - 타입 안전성
- **Redux Toolkit 2.11.2** - 상태 관리
- **React Navigation 7.x** - 네비게이션
- **Axios 1.13.5** - HTTP 클라이언트
- **React Native Chart Kit** - 차트 라이브러리
- **React Native Push Notification** - 알림 시스템

## Platform-Specific Notes

### Android
- `android/app/build.gradle` - 앱 빌드 설정
- 최소 SDK: 24 (Android 7.0)
- 목표 SDK: 34 (Android 14)

### iOS
- `ios/WaterTimeApp.xcodeproj` - Xcode 프로젝트
- 배포 목표: iOS 13.0+

<!-- MANUAL: 앱 개발 시 참고할 특별한 사항을 아래에 추가하세요 -->
