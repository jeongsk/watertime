# WaterTime 코딩 규칙

> 이 파일은 everything-claude-code의 규칙을 WaterTime 프로젝트에 맞게 커스터마이징한 것입니다.

## 일반 원칙

1. **사용자 경험 우선**: 모든 코드는 사용자 경험을 최우선으로 고려해야 합니다
2. **1탭 완료**: 핵심 기능은 최대한 간단하게 (1탭으로 완료)
3. **과학적 정확성**: 수분 섭취 계산은 의학적 근거에 기반
4. **프라이버시 존중**: 건강 데이터는 최소 수집 및 안전 저장
5. **플랫폼 차이 고려**: iOS/Android 특성을 반영한 조건부 처리

## TypeScript/React Native

### 컴포넌트 구조

```typescript
// 올바른 예: 함수형 컴포넌트 + Hooks
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

interface WaterIntakeProps {
  amount: number
  onRecord: (amount: number) => void
}

export const WaterIntake: React.FC<WaterIntakeProps> = ({ amount, onRecord }) => {
  const [isRecording, setIsRecording] = useState(false)

  const handleRecord = async () => {
    setIsRecording(true)
    try {
      await onRecord(amount)
    } finally {
      setIsRecording(false)
    }
  }

  return (
    <TouchableOpacity onPress={handleRecord} disabled={isRecording}>
      <Text>{amount}ml 기록</Text>
    </TouchableOpacity>
  )
}
```

### 상태 관리 (Redux Toolkit)

```typescript
// 올바른 예: Redux Toolkit 슬라이스
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IntakeState {
  dailyAmount: number
  goal: number
  history: IntakeRecord[]
}

const intakeSlice = createSlice({
  name: 'intake',
  initialState,
  reducers: {
    addIntake: (state, action: PayloadAction<IntakeRecord>) => {
      state.dailyAmount += action.payload.amount
      state.history.push(action.payload)
    },
    setGoal: (state, action: PayloadAction<number>) => {
      state.goal = action.payload
    }
  }
})

export const { addIntake, setGoal } = intakeSlice.actions
```

### 불변성 유지

```typescript
// 틀린 예: Mutation
function updateUser(user: User, data: Partial<User>) {
  user.name = data.name  // MUTATION!
  return user
}

// 올바른 예: Spread operator
function updateUser(user: User, data: Partial<User>) {
  return {
    ...user,
    ...data
  }
}
```

### 에러 처리

```typescript
// 올바른 예: async/await with try-catch
async function recordIntake(amount: number): Promise<void> {
  try {
    const result = await api.recordIntake(amount)
    return result
  } catch (error) {
    console.error('섭취 기록 실패:', error)
    // 사용자에게 친화적인 에러 메시지
    throw new Error('섭취 기록에 실패했습니다. 다시 시도해주세요.')
  }
}
```

### 네이밍 컨벤션

- **컴포넌트**: PascalCase (예: `WaterIntakeCard`)
- **함수/변수**: camelCase (예: `recordIntake`, `dailyGoal`)
- **타입/인터페이스**: PascalCase (예: `User`, `IntakeRecord`)
- **상수**: UPPER_SNAKE_CASE (예: `DEFAULT_GOAL`, `MAX_DAILY_INTAKE`)

## Node.js/Express Backend

### 프로젝트 구조

```
server/src/
├── routes/          # API 라우트
├── controllers/     # 요청 처리
├── services/        # 비즈니스 로직
├── models/          # Prisma 모델
├── middleware/      # 미들웨어
├── utils/           # 유틸리티
└── database/        # 데이터베이스 설정
```

### API 라우터

```typescript
// 올바른 예: Express Router with TypeScript
import { Router } from 'express'
import { IntakeController } from '../controllers/intake.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
const controller = new IntakeController()

router.post('/intake', authMiddleware, controller.record)
router.get('/intake/daily', authMiddleware, controller.getDaily)

export default router
```

### 서비스 레이어

```typescript
// 올바른 예: Service class with dependency injection
export class IntakeService {
  constructor(
    private prisma: PrismaClient,
    private redis: RedisClient
  ) {}

  async recordIntake(userId: string, amount: number): Promise<Intake> {
    // 비즈니스 로직
    const dailyTotal = await this.getDailyTotal(userId)

    if (dailyTotal + amount > MAX_DAILY_INTAKE) {
      throw new Error('일일 최대 섭취량을 초과했습니다')
    }

    // 데이터베이스 저장
    const intake = await this.prisma.intake.create({
      data: { userId, amount, timestamp: new Date() }
    })

    // 캐시 업데이트
    await this.redis.setex(
      `intake:${userId}:daily`,
      3600,
      dailyTotal + amount
    )

    return intake
  }
}
```

### 환경 변수 사용

```typescript
// 틀린 예: 하드코딩된 값
const apiUrl = 'https://api.example.com'

// 올바른 예: 환경 변수
const apiUrl = process.env.API_URL || 'http://localhost:3000'
```

### 입력 검증

```typescript
// 올바른 예: Zod를 사용한 스키마 검증
import { z } from 'zod'

const recordIntakeSchema = z.object({
  amount: z.number().min(50).max(1000),
  timestamp: z.date().optional()
})

export async function POST(req: Request) {
  const body = await req.json()
  const validated = recordIntakeSchema.parse(body)
  // ... 처리
}
```

## 데이터베이스 (Prisma)

### 스키마 정의

```prisma
// 올바른 예: 명확한 관계와 인덱스
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  intakes   Intake[]
  settings  Settings?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Intake {
  id        String   @id @default(cuid())
  userId    String
  amount    Int
  timestamp DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId, timestamp])
}
```

## 공통 규칙

### console.log 금지

- 프로덕션 코드에서 `console.log` 사용 금지
- 대신 적절한 로깅 라이브러리 사용 (예: Winston, pino)

### 주석

- 복잡한 비즈니스 로직에는 주석 필수
- "무엇을"이 아니라 "왜"를 설명
- 한국어 주석 권장

```typescript
// 틀린 예
// user의 name을 설정함
user.name = name

// 올바른 예
// HealthKit 동기화를 위해 임시로 이름을 업데이트
// 나중에 원래 값으로 복원됨
user.name = name
```

### 성능 고려사항

- 불필요한 리렌더링 방지 (React.memo, useMemo)
- API 콜 최적화 (배치 처리, 캐싱)
- 이미지 최적화 (react-native-fast-image)
- 데이터베이스 쿼리 최적화 (인덱스, select 필드)

### 보안

- 사용자 입력은 항상 검증
- 민감 정보는 절대 로그에 남기지 않음
- 인증된 요청만 허용 (authMiddleware)
- API 키와 시크릿은 환경 변수로 관리

### 테스트

- 단위 테스트: 비즈니스 로직 검증
- 통합 테스트: API 엔드포인트 검증
- E2E 테스트: 주요 사용자 시나리오 검증

```typescript
describe('IntakeService', () => {
  it('일일 최대 섭취량을 초과하면 에러를 반환함', async () => {
    const service = new IntakeService(mockPrisma, mockRedis)
    await expect(
      service.recordIntake(userId, 5000)
    ).rejects.toThrow('일일 최대 섭취량을 초과했습니다')
  })
})
```

## HealthKit/Google Fit 연동

### iOS (HealthKit)

```typescript
// 올바른 예: 권한 요청 후 데이터 접근
import HealthKit from 'react-native-health'

const requestPermissions = async () => {
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

### Android (Google Fit)

```typescript
// 올바른 예: Google Fit History API
import { GoogleFit } from 'react-native-google-fit'

const recordWaterIntake = async (amount: number) => {
  const options = {
    value: amount,
    unit: 'mL',
    startTime: Date.now(),
    endTime: Date.now()
  }

  await GoogleFit.recordWater(options, 'water')
}
```

## 리팩토링 가이드

### 코드 냄새 체크리스트

- [ ] 함수가 50줄을 넘는가?
- [ ] 중첩 레벨이 4단계 이상인가?
- [ ] 중복 코드가 있는가?
- [ ] 에러 처리가 누락되었는가?
- [ ] 하드코딩된 값이 있는가?
- [ ] 테스트가 부족한가?
- [ ] 성능 병목이 있는가?

### 리팩토링 단계

1. 문제 영역 식별
2. 테스트 추가 (리그레션 방지)
3. 작은 단계로 리팩토링
4. 각 단계 후 테스트 실행
5. 커밋

이 규칙들은 WaterTime 프로젝트의 품질과 일관성을 유지하기 위한 것입니다. 의문 사항이 있으면 팀에 문의하세요.
