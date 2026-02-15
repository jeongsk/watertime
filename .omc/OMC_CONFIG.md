# WaterTime OMC (Oh-My-ClaudeCode) 설정

> WaterTime 프로젝트에 최적화된 Oh-My-ClaudeCode 설정입니다.

## 설치 완료 상태

✅ **OMC 플러그인 설치됨**
✅ **WaterTime 전용 에이전트 설정**
✅ **자동화 워크플로우 구성**

## WaterTime 전용 매직 키워드

### 자주 사용하는 키워드

| 키워드 | 용도 | 예시 |
|--------|------|------|
| `autopilot` | 자율 실행 | `autopilot: 섭취량 알림 기능 구현` |
| `ralph` | 지속적 실행 | `ralph: 리팩토링 완료까지` |
| `eco` | 비용 절감 | `eco: API 엔드포인트 추가` |
| `plan` | 기획 모드 | `plan: 통계 대시보드 설계` |
| `ulw` | 병렬 실행 | `ulw: 모든 에러 수정` |

## WaterTime 전용 에이전트

### 1. WatertimePlanner
- **용도**: WaterTime 기능 기획
- **특징**: React Native + Node.js 아키텍처 고려
- **사용법**: `plan: [기능 설명]`

### 2. WatertimeExecutor
- **용도**: 구현 실행
- **특징**: HealthKit/Google Fit 연동 고려
- **사용법**: `autopilot: [구현 작업]`

### 3. WatertimeReviewer
- **용도**: 코드 리뷰
- **특징**: TypeScript/React Native 규칙 검사
- **사용법**: `review: [파일 또는 기능]`

## 실행 모드

### Autopilot (자율 실행)
```bash
# 전체 기능 자율 구현
autopilot: HealthKit 연동 기능 구현해줘

# 특정 기술 스택 사용
autopilot: Prisma를 사용하여 섭취량 추적 API 만들어줘
```

### Ralph (지속적 실행)
```bash
# 에러 해결까지 지속
ralph: 로그인 버그 수정

# 리팩토링 완료까지
ralph: 인증 모듈 리팩토링
```

### Ecomode (비용 절감)
```bash
# 토큰 효율적 사용
eco: 데이터베이스 마이그레이션

# 간단한 작업
eco: 환경 변수 추가
```

## 자동화 기능

### 세션 시작 시
- 프로젝트 컨텍스트 자동 로드
- Docker 서비스 상태 확인
- 브랜치 정보 표시

### 코드 작성 시
- TypeScript 린트 자동 검사
- React Native 패턴 확인
- console.log 경고

### 커밋 전
- 환경 변수 미포함 확인
- 테스트 통과 확인
- 코드 스타일 검사

## WaterTime 특화 기능

### 1. 건강 데이터 연동
```bash
# HealthKit 연동 계획
plan: iOS HealthKit 연동 아키텍처

# Google Fit 연동 구현
autopilot: Android Google Fit 연동 구현
```

### 2. 프리미엄 기능 분리
```bash
# 프리미엄 기능 리팩토링
ralph: 구독 기능을 프리미엄으로 분리

# 결제 시스템 통합
autopilot: In-App Purchase 결제 시스템
```

### 3. 알림 시스템
```bash
# 스마트 알림 설계
plan: 활동량 기반 알림 시스템

# 알림 구현
autopilot: FCM/APNS 푸시 알림 구현
```

## 빠른 시작

### 1. 기능 추가
```bash
# 새로운 기능 계획
plan: 수분 섭취 목표 추천 시스템

# 계획대로 구현
autopilot: 위 계획대로 구현해줘
```

### 2. 버그 수정
```bash
# 지속적 수정
ralph: 알림이 오지 않는 버그 수정
```

### 3. 리팩토링
```bash
# 비용 절감 리팩토링
eco: 중복 코드 제거 및 리팩토링
```

## 문제 해결

### OMC 명령어가 작동하지 않을 때
```bash
# OMC 설정 확인
/oh-my-claudecode:omc-setup

# 재설치
/plugin reinstall oh-my-claudecode
```

### 에이전트가 응답하지 않을 때
```bash
# 세션 재시작
/clear

# 강제 리셋
/oh-my-claudecode:doctor
```

## 추가 리소스

- [OMC 공식 문서](https://yeachan-heo.github.io/oh-my-claudecode-website)
- `CLAUDE_CODE_GUIDE.md` - WaterTime 개발 가이드
- `.claude/agents.md` - WaterTime 에이전트 설정

---

**마지막 업데이트**: 2026-02-15
**버전**: OMC 3.x + WaterTime Customization
