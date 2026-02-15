# WaterTime - Claude Code 개발 가이드

> everything-claude-code를 WaterTime 프로젝트에 최적화한 개발 가이드입니다.

## 📋 목차

1. [설정 개요](#설정-개요)
2. [AI 에이전트](#ai-에이전트)
3. [개발 워크플로우](#개발-워크플로우)
4. [코딩 규칙](#코딩-규칙)
5. [자동화 훅](#자동화-훅)
6. [모범 사례](#모범-사례)

---

## 설정 개요

### 추가된 구성요소

```
watertime/
├── .claude/
│   ├── agents.md      # WaterTime 전용 AI 에이전트 설정
│   ├── rules.md       # 프로젝트 코딩 규칙
│   └── hooks.json     # 자동화 훅 설정
├── HARNESS_SETUP.md   # 개발 환경 설정 가이드
└── CLAUDE_CODE_GUIDE.md  # 이 문서
```

### 핵심 기능

✅ **WaterTime 도메인 전용 기획 에이전트**
- React Native + Node.js 아키텍처 고려
- HealthKit/Google Fit 연동 고려
- 프리미엄 구독 모델 반영

✅ **TypeScript/React Native 규칙**
- 함수형 컴포넌트 + Hooks
- Redux Toolkit 상태 관리
- 불변성 유지

✅ **백엔드 개발 규칙**
- Service layer 패턴
- Prisma ORM 사용법
- API 라우터 구조

✅ **자동화 훅**
- console.log 감지
- 플랫폼별 코드 검사
- 커밋 전 리마인더

---

## AI 에이전트

### Planner (기획 전문가)

**사용 시점:**
- 새로운 기능 구현 전
- 복잡한 리팩토링 시
- 아키텍처 변경 시

**특징:**
- WaterTime 도메인 컨텍스트 반영
- 모바일/백엔드 분리 계획
- HealthKit/Google Fit 고려
- 단계별 구현 계획

**사용법:**
```
"섭취량 알림 기능을 추가하는 구현 계획을 세워줘"
"프리미엄 구독 시스템을 리팩토링하는 계획을 세워줘"
```

### 기타 에이전트

자동으로 활성화되는 에이전트들:
- **Code Reviewer**: 코드 변경 시 자동 리뷰
- **Error Resolver**: 빌드/테스트 에러 해결
- **Database Reviewer**: 데이터베이스 변경 검토

---

## 개발 워크플로우

### 1. 기능 개발 플로우

```
사용자 요청
    ↓
[Planner 에이전트] 구현 계획 수립
    ↓
코드 구현 (규칙 준수)
    ↓
[Hooks] 자동 검사 및 알림
    ↓
테스트 및 검증
    ↓
커밋 및 푸시
```

### 2. Planner 활용 예시

**Step 1: 요청**
```
"HealthKit 연동을 위한 구현 계획을 세워줘"
```

**Step 2: Planner가 수행하는 작업**
1. 요구사항 분석
2. 기존 코드베이스 분석
3. 단계별 구현 계획 작성
4. 리스크 식별 및 완화 방안

**Step 3: 계획 예시**
```
# 구현 계획: HealthKit 연동

## Phase 1: 권한 설정
1. iOS 권한 설정 (Info.plist)
2. 권한 요청 UI 구현

## Phase 2: 데이터 읽기
1. 활동량 데이터 읽기
2. 수분 섭취 데이터 동기화

## Phase 3: UI 연동
1. HealthKit 데이터 표시
2. 자동 동기화 설정
```

---

## 코딩 규칙

### React Native

**컴포넌트 구조:**
```typescript
// ✅ 올바른 예
import React, { useState } from 'react'
import { View, Text } from 'react-native'

interface Props {
  amount: number
}

export const WaterIntake: React.FC<Props> = ({ amount }) => {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <View>
      <Text>{amount}ml</Text>
    </View>
  )
}
```

**상태 관리 (Redux Toolkit):**
```typescript
// ✅ 올바른 예
const intakeSlice = createSlice({
  name: 'intake',
  initialState,
  reducers: {
    addIntake: (state, action) => {
      state.dailyAmount += action.payload.amount
    }
  }
})
```

### Node.js Backend

**서비스 레이어:**
```typescript
// ✅ 올바른 예
export class IntakeService {
  constructor(
    private prisma: PrismaClient,
    private redis: RedisClient
  ) {}

  async recordIntake(userId: string, amount: number) {
    // 비즈니스 로직
  }
}
```

**API 라우터:**
```typescript
// ✅ 올바른 예
router.post('/intake', authMiddleware, controller.record)
```

### 공통 규칙

1. **불변성**: spread operator 사용
2. **에러 처리**: try-catch with user-friendly messages
3. **타입 정의**: 인터페이스/타입 명시
4. **주석**: 복잡한 로직에 "왜" 설명
5. **테스트**: 비즈니스 로직 테스트 필수

---

## 자동화 훅

### PreToolUse 훅

**작업 전 자동 검사:**

1. **Dev Server 시작 시**
   ```
   [Hook] Docker 서비스가 실행 중인지 확인
   ```

2. **Git Push 전**
   ```
   [Hook] console.log 제거 확인
   [Hook] 환경 변수 커밋 방지
   ```

3. **TypeScript 파일 수정 시**
   ```
   [Hook] 타입 정의 확인
   [Hook] Lint 실행 제안
   ```

### PostToolUse 훅

**작업 후 자동 알림:**

1. **console.log 감지**
   ```
   [Hook] WARNING: console.log found in app/src/components/WaterIntake.tsx
   [Hook] Remove before committing
   ```

2. **React Native 파일 수정**
   ```
   [Hook] iOS/Android 플랫폼 테스트 권장
   ```

3. **백엔드 API 수정**
   ```
   [Hook] API 문서 업데이트 고려
   [Hook] DB 마이그레이션 영향 확인
   ```

### SessionStart 훅

**세션 시작 시 환영 메시지:**
```
💧 Welcome to WaterTime Development!

Available commands:
  npm run dev          - Start all services
  npm run dev:app      - Start React Native app
  npm run dev:server   - Start backend server
  npm run docker:up    - Start Docker services

Documentation:
  HARNESS_SETUP.md     - Development setup guide
  .claude/rules.md    - Coding rules
  .claude/agents.md   - AI agents guide
```

---

## 모범 사례

### 1. 기능 개발

**❌ 피해야 할 패턴:**
```typescript
// 틀린 예: Mutation
user.name = newName
return user
```

**✅ 권장 패턴:**
```typescript
// 올바른 예: Immutability
return {
  ...user,
  name: newName
}
```

### 2. 에러 처리

**❌ 피해야 할 패턴:**
```typescript
// 틀린 예: 에러 무시
async function recordIntake(amount: number) {
  await api.record(amount)
}
```

**✅ 권장 패턴:**
```typescript
// 올바른 예: 적절한 에러 처리
async function recordIntake(amount: number) {
  try {
    return await api.record(amount)
  } catch (error) {
    console.error('섭취 기록 실패:', error)
    throw new Error('섭취 기록에 실패했습니다. 다시 시도해주세요.')
  }
}
```

### 3. 상태 관리

**❌ 피해야 할 패턴:**
```typescript
// 틀린 예: Context만 사용 (복잡한 상태)
const AppContext = createContext()
```

**✅ 권장 패턴:**
```typescript
// 올바른 예: Redux Toolkit 사용
const intakeSlice = createSlice({
  name: 'intake',
  initialState,
  reducers: { /* ... */ }
})
```

### 4. API 호출

**❌ 피해야 할 패턴:**
```typescript
// 틀린 예: 컴포넌트에서 직접 호출
const data = await fetch('/api/intake')
```

**✅ 권장 패턴:**
```typescript
// 올바른 예: Service layer 사용
class IntakeService {
  async recordIntake(amount: number) {
    return this.api.post('/intake', { amount })
  }
}
```

---

## WaterTime 특화 가이드

### HealthKit 연동

```typescript
// 권장 패턴: 권한 요청 후 사용
import HealthKit from 'react-native-health'

const initHealthKit = async () => {
  const permissions = {
    permissions: {
      read: [HealthKit.Constants.Permissions.ActiveEnergyBurned],
      write: [HealthKit.Constants.Permissions.Water]
    }
  }

  const isAuthorized = await HealthKit.initHealthKit(permissions)
  return isAuthorized
}
```

### Google Fit 연동

```typescript
// 권장 패턴: 권한 확인 후 사용
import { GoogleFit } from 'react-native-google-fit'

const checkPermissions = async () => {
  const authorized = await GoogleFit.checkAuth()
  if (!authorized) {
    await GoogleFit.authorize()
  }
}
```

### 프리미엄 기능 분리

```typescript
// 권장 패턴: Feature flag 사용
const isPremium = useAppSelector(state => state.user.isPremium)

{isPremium && (
  <PremiumFeature />
)}
```

---

## 문제 해결

### 일반적인 문제

**문제 1: TypeScript 에러**
```bash
# 해결 방법
npm run lint
npm run type-check
```

**문제 2: Docker 서비스 연결 실패**
```bash
# 해결 방법
npm run docker:down
npm run docker:up
```

**문제 3: console.log가 커밋됨**
```bash
# 해결 방법: Hook이 자동으로 감지
# 수동 검사: git diff | grep "console.log"
```

---

## 추가 리소스

### 프로젝트 문서
- `HARNESS_SETUP.md` - 개발 환경 설정
- `.claude/rules.md` - 상세 코딩 규칙
- `.claude/agents.md` - AI 에이전트 가이드

### 외부 리소스
- [React Native 공식 문서](https://reactnative.dev/)
- [Redux Toolkit 공식 문서](https://redux-toolkit.js.org/)
- [Prisma 공식 문서](https://www.prisma.io/docs)

---

## 기여 가이드

### Pull Request 전 체크리스트

- [ ] Planner 에이전트로 구현 계획 수립
- [ ] 코딩 규칙 준수 (.claude/rules.md)
- [ ] 모든 console.log 제거
- [ ] 테스트 통과
- [ ] Lint 통과
- [ ] 환경 변수 미포함 확인
- [ ] API 문서 업데이트 (백엔드 변경 시)

---

**마지막 업데이트**: 2026-02-15
**버전**: 1.0.0
**프로젝트**: WaterTime - AI 기반 개인화 수분 관리 서비스
