# WaterTime - Oh-My-ClaudeCode (OMC) 통합 가이드

> WaterTime 프로젝트에 Oh-My-ClaudeCode를 통합한 완전한 개발 가이드입니다.

## 📋 목차

1. [OMC 개요](#omc-개요)
2. [설치 및 설정](#설치-및-설정)
3. [매직 키워드](#매직-키워드)
4. [실행 모드](#실행-모드)
5. [WaterTime 전용 기능](#watertime-전용-기능)
6. [실전 사용법](#실전-사용법)
7. [문제 해결](#문제-해결)

---

## OMC 개요

### Oh-My-ClaudeCode란?

**멀티 에이전트 오케스트레이션 시스템**으로, 복잡한 작업을 전문화된 AI 에이전트들이 자동으로 분담하여 수행합니다.

### WaterTime + OMC 조합의 장점

✅ **도메인 전문화**: WaterTime(건강/피트니스) 특화 에이전트
✅ **자동 병렬화**: 복잡한 기능을 여러 에이전트가 동시에 처리
✅ **지속적 실행**: 에러가 발생해도 자동으로 재시도
✅ **비용 최적화**: 작업 난이도에 따라 모델 자동 선택
✅ **학습 기능**: 해결 패턴을 자동으로 추출 및 재사용

---

## 설치 및 설정

### 1. OMC 설치 (이미 완료됨)

```bash
# 이미 설치됨
✓ /plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
✓ /plugin install oh-my-claudecode
✓ /oh-my-claudecode:omc-setup
```

### 2. WaterTime 전용 설정

```
.watertime/
├── .omc/
│   ├── OMC_CONFIG.md           # OMC 설정 가이드
│   └── agents/
│       └── watertime-planner.md # WaterTime 기획 에이전트
├── .claude/
│   ├── agents.md               # Claude Code 에이전트
│   ├── rules.md                # 코딩 규칙
│   └── hooks.json              # 자동화 훅
└── OMC_INTEGRATION_GUIDE.md    # 이 문서
```

---

## 매직 키워드

### 자주 사용하는 키워드

| 키워드 | 용도 | 속도 | 비용 | 예시 |
|--------|------|------|------|------|
| **autopilot** | 자율 전체 실행 | 빠름 | 보통 | `autopilot: 알림 기능 구현` |
| **ralph** | 지속적 실행 (재시도 포함) | 보통 | 높음 | `ralph: 버그 수정 완료까지` |
| **eco** | 비용 절감 실행 | 빠름 | 낮음 | `eco: 간단한 수정` |
| **plan** | 기획 모드 | - | 낮음 | `plan: 새 기능 설계` |
| **ulw** | 최대 병렬 실행 | 매빠름 | 높음 | `ulw: 모든 버그 수정` |

### WaterTime 전용 확장 키워드

| 키워드 | 용도 | 예시 |
|--------|------|------|
| **wt-plan** | WaterTime 기획 | `wt-plan: HealthKit 연동` |
| **wt-build** | WaterTime 구현 | `wt-build: 알림 시스템` |
| **wt-fix** | WaterTime 버그 수정 | `wt-fix: 동기화 문제` |

---

## 실행 모드

### 1. Autopilot (자율 실행)

**사용 시점:**
- 새로운 기능 구현
- 전체 시스템 구축
- 여러 컴포넌트 동시 개발

**사용법:**
```bash
# 기본 사용
autopilot: 섭취량 알림 기능을 구현해줘

# 기술 스택 지정
autopilot: React Navigation을 사용하여
           설정 화면을 만들어줘

# 여러 기능 동시에
autopilot: HealthKit 연동과
           Google Fit 연동을
           동시에 구현해줘
```

**자동 수행 과정:**
1. 요구사항 분석 (Planner 에이전트)
2. 아키텍처 설계 (Architect 에이전트)
3. 코드 구현 (Executor 에이전트)
4. 테스트 (QA Tester 에이전트)
5. 코드 리뷰 (Code Reviewer 에이전트)

### 2. Ralph (지속적 실행)

**사용 시점:**
- 복잡한 버그 수정
- 재시도가 필요한 작업
- 완료까지 지속이 필요한 작업

**사용법:**
```bash
# 버그 수정
ralph: 로그인이 작동하지 않는 문제를
       원인을 찾아서 수정해줘

# 리팩토링
ralph: 인증 모듈을 더 안전하게
       리팩토링해줘

# 복잡한 기능
ralph: 결제 시스템이
       안정적으로 작동할 때까지
       다듬어줘
```

**특징:**
- 에러 발생 시 자동 재시도
- 완료 확인까지 지속
- 상세한 진행 상황 보고

### 3. Ecomode (비용 절감)

**사용 시점:**
- 간단한 수정
- 대규모 리팩토링
- 토큰 비용 최적화 필요

**사용법:**
```bash
# 간단한 수정
eco: 환경 변수를 .env.example에 추가해줘

# 리팩토링
eco: 중복 코드를 제거하고
     리팩토링해줘

# 문서 작성
eco: README.md를 업데이트해줘
```

**특징:**
- 30-50% 토큰 절약
- 작은 모델 (Haiku) 우선 사용
- 간단한 작업에 적합

### 4. Plan (기획)

**사용 시점:**
- 새로운 기능 설계
- 복잡한 리팩토링 계획
- 아키텍처 검토

**사용법:**
```bash
# 기능 기획
plan: 주간 통계 대시보드를
      어떻게 구현할까요?

# 리팩토링 계획
plan: 상태 관리를 Redux에서
      Zustand로 마이그레이션

# 아키텍처 설계
plan: 프리미엄 구독 시스템을
      어떻게 설계할까요?
```

**출력물:**
- 상세한 구현 계획 (`.omc/plans/*.md`)
- 단계별 작업 목록
- 리스크 및 완화 방안

---

## WaterTime 전용 기능

### 1. 건강 데이터 연동

```bash
# HealthKit 연동 계획
wt-plan: iOS HealthKit을 통하여
         활동량 데이터를 가져오는
         기능을 설계해줘

# Google Fit 연동 구현
autopilot: Android Google Fit API를
           사용하여 활동량 데이터를
           가져오는 기능을 구현해줘

# 양쪽 동시 구현
ulw: HealthKit과 Google Fit 연동을
    동시에 구현해줘
```

### 2. 알림 시스템

```bash
# 알림 시스템 설계
plan: 활동량, 날씨, 시간을 고려한
     스마트 알림 시스템을 설계해줘

# 알림 구현
autopilot: FCM과 APNS를 사용하여
           푸시 알림을 구현해줘

# 알림 버그 수정
ralph: 알림이 일정하지 않은 문제를
       수정해줘
```

### 3. 프리미엄 기능

```bash
# 프리미엄 기능 분리
eco: 구독 상태에 따라
     기능을 분리하는
     Feature Flag를 추가해줘

# 결제 시스템
autopilot: In-App Purchase를
           구현하여
           구독 결제를 가능하게 해줘

# 결제 버그 수정
ralph: 결제 영수증 검증이
       실패하는 문제를
       수정해줘
```

### 4. 데이터 동기화

```bash
# 오프라인 지원
plan: WatermelonDB를 사용하여
     오프라인 데이터 저장과
     동기화를 설계해줘

# 동기화 구현
autopilot: 백그라운드에서
           서버와 데이터를
           동기화하는 기능을 구현해줘

# 동기화 버그 수정
ralph: 데이터 충돌이
       발생하는 문제를
       수정해줘
```

---

## 실전 사용법

### 시나리오 1: 새 기능 개발

```bash
# 1단계: 기획
plan: 수분 섭취 목표를 추천하는
     AI 기반 시스템을 설계해줘

# 2단계: 구현
autopilot: 위 계획대로 구현해줘

# 3단계: 테스트
ralph: 테스트를 통과할 때까지
       버그를 수정해줘
```

### 시나리오 2: 버그 수정

```bash
# 즉시 지속적 수정
ralph: iOS에서 알림이 오지 않는 문제를
       원인을 찾아서 수정해줘
```

### 시나리오 3: 리팩토링

```bash
# 비용 절감 리팩토링
eco: 인증 로직을 더 안전하고
     효율적으로 리팩토링해줘
```

### 시나리오 4: 전체 시스템 구축

```bash
# 최대 병렬 실행
ulw: 다음을 동시에 구현해줘
    - 사용자 인증
    - 섭취량 추적
    - 통계 대시보드
    - 알림 시스템
```

---

## 문제 해결

### OMC 명령어가 작동하지 않을 때

```bash
# 1. OMC 상태 확인
/oh-my-claudecode:doctor

# 2. 재설치
/plugin reinstall oh-my-claudecode

# 3. 설정 초기화
/oh-my-claudecode:omc-setup
```

### 에이전트가 응답하지 않을 때

```bash
# 세션 재시작
/clear

# 강제 리셋
/oh-my-claudecode:cancel
```

### 비용이 너무 높을 때

```bash
# Ecomode 사용
eco: [작업]

# 또는 작업 분할
eco: 부분1 구현
eco: 부분2 구현
```

---

## 추가 리소스

### 프로젝트 문서
- `OMC_CONFIG.md` - OMC 설정 가이드
- `CLAUDE_CODE_GUIDE.md` - Claude Code 개발 가이드
- `HARNESS_SETUP.md` - 개발 환경 설정

### 외부 리소스
- [OMC 공식 문서](https://yeachan-heo.github.io/oh-my-claudecode-website)
- [OMC GitHub](https://github.com/Yeachan-Heo/oh-my-claudecode)

---

## 모범 사례

### 1. 작업 시작 전

```bash
# 항상 명확하게
autopilot: [구체적 작업 설명]

# ❌ 피해야 할 방식
"좀 만들어봐"

# ✅ 권장 방식
"React Native와 TypeScript를 사용하여
 섭취량 추적 화면을 만들어줘"
```

### 2. 복잡한 작업

```bash
# 단계별 접근
plan: 복잡한 기능 설계
autopilot: 구현
ralph: 버그 수정
```

### 3. 비용 최적화

```bash
# 간단한 작업은 eco
eco: 주석 추가
eco: 변수명 변경

# 복잡한 작업은 autopilot
autopilot: 새 기능 구현
```

---

**마지막 업데이트**: 2026-02-15
**버전**: OMC 3.x + WaterTime Customization
**프로젝트**: WaterTime - AI 기반 개인화 수분 관리 서비스

---

## 빠른 참조

### 자주 쓰는 명령어

| 명령어 | 설명 |
|--------|------|
| `autopilot: [작업]` | 자율 실행 |
| `ralph: [작업]` | 지속적 실행 |
| `eco: [작업]` | 비용 절감 |
| `plan: [작업]` | 기획 |
| `ulw: [작업]` | 최대 병렬 |

### WaterTime 전용

| 명령어 | 설명 |
|--------|------|
| `wt-plan: [기능]` | WaterTime 기획 |
| `wt-build: [기능]` | WaterTime 구현 |
| `wt-fix: [문제]` | WaterTime 버그 수정 |

### 도움말

| 명령어 | 설명 |
|--------|------|
| `/oh-my-claudecode:help` | OMC 도움말 |
| `/oh-my-claudecode:doctor` | 상태 확인 |
| `/oh-my-claudecode:omc-setup` | 설정 초기화 |

즐겁게 개발하세요! 💧
