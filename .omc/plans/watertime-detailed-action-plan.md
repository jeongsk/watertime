# WaterTime 상세 작업 계획 (Detailed Action Plan)

**작성일**: 2026-02-15
**프로젝트**: WaterTime - AI 기반 개인화 수분 관리 서비스
**계획 기간**: 2주 (단기 집중 실행)

---

## 📋 목차

1. [즉시 실행 가능한 작업](#즉시-실행-가능한-작업)
2. [Week 1 상세 계획](#week-1-상세-계획)
3. [Week 2 상세 계획](#week-2-상세-계획)
4. [우선순위 매트릭스](#우선순위-매트릭스)
5. [일일 체크리스트](#일일-체크리스트)
6. [차단 요소 관리](#차단-요소-관리)

---

## 🚀 즉시 실행 가능한 작업

### 오늘 (Day 0) 바로 시작할 수 있는 작업

#### 1. 개발 환경 초기화 (15분)
```bash
# Docker 서비스 시작
cd /home/ubuntu/workspace-for-happy/watertime
docker-compose up -d

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
```

**파일**: `scripts/setup-dev.sh`, `.env.local`
**완료 기준**: Docker 컨테이너 실행 중, npm install 완료

#### 2. 데이터베이스 초기화 (20분)
```bash
# Prisma 클라이언트 생성
npm install prisma @prisma/client -D
npx prisma generate

# PostgreSQL 연결 테스트
docker exec -it watertime-postgres psql -U watertime -d watertime_dev
```

**파일**: `server/prisma/schema.prisma`
**완료 기준**: Prisma Studio 접속 가능

#### 3. React Native 프로젝트 설정 (30분)
```bash
cd app
npm install
npx pod-install  # macOS only
```

**파일**: `app/package.json`
**완료 기준**: Metro 번들러 실행 가능

---

## 📅 Week 1 상세 계획

### Day 1: 프로젝트 기반 구축

#### 오전 (3시간)

**Task 1-1: 프로젝트 구조 확정** (1시간)
- [ ] app/ 폴더 구조 재구성
  ```
  app/src/
  ├── components/     # 재사용 컴포넌트
  ├── screens/        # 화면 컴포넌트
  ├── navigation/     # 네비게이션
  ├── services/       # API 호출
  ├── store/          # Redux store
  ├── hooks/          # 커스텀 훅
  ├── utils/          # 유틸리티
  ├── types/          # TypeScript 타입
  └── theme/          # 디자인 토큰
  ```
- [ ] server/ 폴더 구조 재구성
  ```
  server/src/
  ├── routes/         # API 라우트
  ├── controllers/    # 컨트롤러
  ├── services/       # 비즈니스 로직
  ├── middleware/     # 미들웨어
  ├── models/         # Prisma 모델
  ├── utils/          # 유틸리티
  └── config/         # 설정
  ```

**파일**: `app/src/`, `server/src/`
**완료 기준**: 모든 폴더 생성, README 작성

**Task 1-2: Prisma 스키마 작성** (2시간)
```prisma
// server/prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  weight    Float?   // kg
  height    Float?   // cm
  goal      Int      @default(2000) // ml
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  intakes   Intake[]
}

model Intake {
  id        String   @id @default(cuid())
  userId    String
  amount    Int      // ml
  timestamp DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId, timestamp])
}
```

**파일**: `server/prisma/schema.prisma`
**완료 기준**: 마이그레이션 생성 완료

#### 오후 (3시간)

**Task 1-3: 초기 마이그레이션** (1시간)
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

**파일**: `server/prisma/migrations/`, `server/prisma/seed.ts`
**완료 기준**: PostgreSQL 테이블 생성 확인

**Task 1-4: Express 서버 기본 구조** (2시간)
```typescript
// server/src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app
```

**파일**: `server/src/app.ts`, `server/src/server.ts`
**완료 기준**: localhost:3000/health 응답

---

### Day 2: 백엔드 API - 인증

#### 오전 (3시간)

**Task 2-1: JWT 인증 구현** (2시간)
```typescript
// server/src/middleware/auth.middleware.ts
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

**파일**: `server/src/middleware/auth.middleware.ts`
**완료 기준**: 토큰 검증 로직 작동

**Task 2-2: 회원가입 API** (1시간)
```typescript
// server/src/routes/auth.routes.ts
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const router = Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  })

  res.json({ user: { id: user.id, email: user.email, name: user.name } })
})
```

**파일**: `server/src/routes/auth.routes.ts`
**완료 기준**: POST /api/auth/register 작동

#### 오후 (3시간)

**Task 2-3: 로그인 API** (2시간)
```typescript
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.json({ token, user: { id: user.id, email: user.email } })
})
```

**파일**: `server/src/routes/auth.routes.ts`
**완료 기준**: POST /api/auth/login 토큰 발급

**Task 2-4: API 테스트** (1시간)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}'
```

**파일**: `server/src/tests/auth.test.ts`
**완료 기준**: 모든 인증 API 테스트 통과

---

### Day 3: 백엔드 API - 섭취량 관리

#### 종일 (6시간)

**Task 3-1: 섭취 기록 API** (3시간)
```typescript
// server/src/routes/intake.routes.ts
router.post('/', authMiddleware, async (req, res) => {
  const { amount } = req.body
  const userId = req.user.userId

  const intake = await prisma.intake.create({
    data: { userId, amount }
  })

  res.json(intake)
})
```

**파일**: `server/src/routes/intake.routes.ts`
**완료 기준**: POST /api/intake 작동

**Task 3-2: 일일 통계 API** (3시간)
```typescript
router.get('/daily', authMiddleware, async (req, res) => {
  const userId = req.user.userId
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const intakes = await prisma.intake.findMany({
    where: {
      userId,
      timestamp: { gte: today }
    }
  })

  const total = intakes.reduce((sum, i) => sum + i.amount, 0)

  res.json({ total, count: intakes.length })
})
```

**파일**: `server/src/routes/intake.routes.ts`
**완료 기준**: GET /api/intake/daily 작동

---

### Day 4: React Native 기본 구조

#### 오전 (3시간)

**Task 4-1: 네비게이션 설정** (2시간)
```typescript
// app/src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
```

**파일**: `app/src/navigation/AppNavigator.tsx`
**완료 기준**: 탭 네비게이션 작동

**Task 4-2: Redux Store 설정** (1시간)
```typescript
// app/src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import intakeReducer from './intakeSlice'

export const store = configureStore({
  reducer: {
    intake: intakeReducer
  }
})
```

**파일**: `app/src/store/index.ts`, `app/src/store/intakeSlice.ts`
**완료 기준**: Redux DevTools 연결

#### 오후 (3시간)

**Task 4-3: API 서비스** (2시간)
```typescript
// app/src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

**파일**: `app/src/services/api.ts`
**완료 기준**: axios 인스턴스 작동

**Task 4-4: 인증 서비스** (1시간)
```typescript
// app/src/services/auth.service.ts
import api from './api'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}
```

**파일**: `app/src/services/auth.service.ts`
**완료 기준**: 로그인/회원가입 호출 가능

---

### Day 5: 홈 화면 개발

#### 종일 (6시간)

**Task 5-1: 홈 화면 UI** (4시간)
```typescript
// app/src/screens/HomeScreen.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

export default function HomeScreen() {
  const { dailyAmount, goal } = useSelector((state) => state.intake)
  const progress = (dailyAmount / goal) * 100

  const handleRecord = async (amount: number) => {
    // 섭취 기록 로직
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 물 섭취</Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.amount}>{dailyAmount} / {goal}ml</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRecord(250)}
      >
        <Text style={styles.buttonText}>+250ml</Text>
      </TouchableOpacity>
    </View>
  )
}
```

**파일**: `app/src/screens/HomeScreen.tsx`
**완료 기준**: 화면 UI 구현 완료

**Task 5-2: 섭취 기록 기능** (2시간)
```typescript
const handleRecord = async (amount: number) => {
  try {
    await api.post('/intake', { amount })
    dispatch(addIntake({ amount, timestamp: new Date() }))
  } catch (error) {
    Alert.alert('오류', '섭취 기록에 실패했습니다')
  }
}
```

**파일**: `app/src/screens/HomeScreen.tsx`
**완료 기준**: 버튼 탭으로 섭취 기록

---

## 📅 Week 2 상세 계획

### Day 6: 통계 화면

**Task 6-1: 차트 라이브러리** (2시간)
```bash
npm install react-native-chart-kit react-native-svg
```

**Task 6-2: 통계 화면 UI** (4시간)
```typescript
// app/src/screens/StatsScreen.tsx
import { LineChart } from 'react-native-chart-kit'

export default function StatsScreen() {
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    // 주간 데이터 조회
  }, [])

  return (
    <LineChart
      data={{
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ data: weeklyData }]
      }}
      width={screenWidth - 32}
      height={220}
    />
  )
}
```

**파일**: `app/src/screens/StatsScreen.tsx`
**완료 기준**: 주간 차트 표시

### Day 7: 알림 시스템

**Task 7-1: 로컬 알림** (3시간)
```typescript
import PushNotification from 'react-native-push-notification'

PushNotification.configure({
  onNotification: (notification) => {
    // 알림 클릭 처리
  },
  requestPermissions: true
})

export const scheduleNotification = (time: string) => {
  PushNotification.localNotificationSchedule({
    message: '물 마실 시간이에요!',
    date: new Date(time)
  })
}
```

**파일**: `app/src/services/notification.service.ts`
**완료 기준**: 예약 알림 작동

**Task 7-2: 알림 설정 UI** (3시간)
**파일**: `app/src/screens/SettingsScreen.tsx`
**완료 기준**: 알림 시간 설정 가능

### Day 8-9: 통합 및 테스트

**Task 8-1: API 통합 테스트** (6시간)
**파일**: `server/src/tests/integration.test.ts`
**완료 기준**: 모든 API 통합 테스트 통과

**Task 9-1: E2E 테스트** (6시간)
**파일**: `app/e2e/intake.test.ts`
**완료 기준**: 주요 사용자 플로우 테스트 통과

### Day 10: 배포 준비

**Task 10-1: iOS 빌드** (3시간)
```bash
cd app/ios
pod install
xcodebuild -workspace WaterTimeApp.xcworkspace
```

**Task 10-2: Android 빌드** (3시간)
```bash
cd app/android
./gradlew assembleRelease
```

---

## 🎯 우선순위 매트릭스

### 긴급 & 중요 (즉시 실행)
1. 개발 환경 설정 ✅
2. 데이터베이스 초기화 ✅
3. Express 서버 기본 구조 ✅

### 중요 & 비긴급 (이번 주)
1. JWT 인증 구현
2. 섭취량 API 개발
3. React Native 네비게이션

### 긴급 & 중요하지 않음 (다음 주)
1. 통계 화면 개발
2. 알림 시스템
3. 테스트 작성

### 비긴급 & 중요하지 않음 (나중에)
1. UI 다듬기
2. 성능 최적화
3. 문서 작성

---

## ✅ 일일 체크리스트

### 매일 아침 확인
- [ ] Docker 컨테이너 실행 중
- [ ] 메일/슬랙 알림 확인
- [ ] 금일 작업 목표 설정

### 매일 저녁 확인
- [ ] Git 커밋 (작업 내용)
- [ ] 진행 상황 기록
- [ ] 내일 작업 계획

### 주간 확인 (금요일)
- [ ] 주간 성과 리뷰
- [ ] 차단 요소 점검
- [ ] 다음 주 계획 수립

---

## 🚧 차단 요소 관리

### 현재 차단 요소
- **OMC 플러그인 미설치**: 작업에 영향 없음
- **HealthKit/Google Fit**: MVP 이후 연동

### 예상 차단 요소
1. **iOS 개발 환경**: macOS 필요 → Android 우선 개발
2. **애플 개발자 계정**: TestFlight용 → 나중에 준비
3. **결제 시스템**: In-App Purchase → MVP 제외

### 완화 계획
- Android 먼저 개발, iOS는 나중에
- 에뮬레이터로 개발, 실기기 테스트는 나중에
- 무료 기능 위주 MVP 구현

---

## 📊 진행 상황 추적

### Week 1 목표
- [ ] 개발 환경 100% 구축
- [ ] 백엔드 API 50% 완료 (인증, 섭취량)
- [ ] 프론트엔드 30% 완료 (네비게이션, 홈 화면)

### Week 2 목표
- [ ] 백엔드 API 100% 완료
- [ ] 프론트엔드 80% 완료
- [ ] 통합 테스트 통과
- [ ] 첫 번째 빌드 생성

---

## 🎁 2주 후 달성 목표

### 기능적 목표
- ✅ 회원가입/로그인 가능
- ✅ 물 섭취 기록 가능
- ✅ 일일/주간 통계 확인
- ✅ 알림 설정 가능

### 기술적 목표
- ✅ iOS/Android 앱 실행 가능
- ✅ 백엔드 API 10개 이상 구현
- ✅ 테스트 커버리지 50% 이상
- ✅ 기본 보안 검토 통과

### 비즈니스 목표
- ✅ 베타 테스터 10명 모집
- ✅ 첫 번째 사용자 피드백 수집
- ✅ 앱스토어 제출 준비

---

**이 계획대로 시작하시겠습니까?**

- **"시작"** 또는 **"진행"**: 바로 Day 1 작업 시작
- **"수정 [날짜/작업]"**: 특정 부분 수정
- **"재계획"**: 새로운 계획 수립

💧 **WaterTime 프로젝트의 성공적인 시작을 응원합니다!**
