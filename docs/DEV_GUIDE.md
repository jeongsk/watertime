# WaterTime - 개발 가이드

**버전**: 1.0
**작성일**: 2026-02-15
**작성자**: 자비스 (AI Assistant)

---

## 1. 개발 환경 설정

### 1.1 사전 요구사항

#### 필수 소프트웨어
- **Node.js**: v20 LTS 이상
- **npm**: v10 이상 또는 yarn v1.22+
- **React Native CLI**: 최신 버전
- **Xcode**: 15.0+ (iOS 개발용, macOS만)
- **Android Studio**: 최신 버전 (Android 개발용)
- **Git**: v2.30+

#### 권장 도구
- **VS Code**: 주요 에디터
- **Postman**: API 테스트
- **TablePlus**: DB 관리
- **Docker**: 로컬 개발 환경

### 1.2 프로젝트 초기화

#### 1. 저장소 클론
```bash
git clone https://github.com/your-org/watertime.git
cd watertime
```

#### 2. 의존성 설치
```bash
# Frontend (React Native)
cd mobile
npm install

# iOS (macOS만)
cd ios
pod install
cd ..

# Backend (Node.js)
cd ../backend
npm install
```

#### 3. 환경 변수 설정
```bash
# Backend
cp .env.example .env

# .env 파일 수정
nano .env
```

**.env 파일 예시**:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/watertime

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=3600

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
APPLE_CLIENT_ID=your-apple-client-id
KAKAO_CLIENT_ID=your-kakao-client-id

# External APIs
OPENWEATHERMAP_API_KEY=your-api-key

# Notifications
FCM_SERVER_KEY=your-fcm-key
APNS_KEY_ID=your-key-id
APNS_TEAM_ID=your-team-id

# Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=watertime-uploads
```

#### 4. 데이터베이스 설정
```bash
# PostgreSQL 실행 (Docker)
docker run --name watertime-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=watertime \
  -p 5432:5432 \
  -d postgres:15

# 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 생성
npx prisma db seed
```

#### 5. 개발 서버 실행
```bash
# Backend
cd backend
npm run dev

# 새 터미널에서 Frontend
cd mobile
npm start

# iOS 시뮬레이터 (macOS만)
npm run ios

# Android 에뮬레이터
npm run android
```

---

## 2. 프로젝트 구조

### 2.1 전체 디렉토리 구조

```
watertime/
├── mobile/                    # React Native App
│   ├── src/
│   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   │   ├── common/        # 공통 컴포넌트
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Input.tsx
│   │   │   └── features/      # 기능별 컴포넌트
│   │   │       ├── IntakeRecord/
│   │   │       └── ProgressCircle/
│   │   ├── screens/           # 화면 컴포넌트
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── StatsScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── Auth/
│   │   ├── navigation/        # 네비게이션 설정
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── MainNavigator.tsx
│   │   ├── store/             # Redux store
│   │   │   ├── index.ts
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── intakeSlice.ts
│   │   │   │   └── settingsSlice.ts
│   │   │   └── middleware/
│   │   ├── services/          # API 호출
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   └── intakeService.ts
│   │   ├── hooks/             # 커스텀 훅
│   │   │   ├── useAuth.ts
│   │   │   ├── useIntake.ts
│   │   │   └── useNotifications.ts
│   │   ├── utils/             # 유틸리티 함수
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── storage.ts
│   │   ├── constants/         # 상수
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── spacing.ts
│   │   ├── types/             # TypeScript 타입
│   │   │   ├── user.ts
│   │   │   ├── intake.ts
│   │   │   └── api.ts
│   │   └── database/          # 로컬 DB
│   │       ├── schema.ts
│   │       └── migrations/
│   ├── assets/                # 정적 리소스
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── android/               # Android 네이티브
│   ├── ios/                   # iOS 네이티브
│   ├── App.tsx                # 진입점
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── controllers/       # 컨트롤러
│   │   │   ├── authController.ts
│   │   │   ├── intakeController.ts
│   │   │   └── statsController.ts
│   │   ├── models/            # 데이터 모델
│   │   │   ├── User.ts
│   │   │   ├── IntakeRecord.ts
│   │   │   └── NotificationConfig.ts
│   │   ├── routes/            # 라우트 정의
│   │   │   ├── authRoutes.ts
│   │   │   ├── intakeRoutes.ts
│   │   │   └── statsRoutes.ts
│   │   ├── middleware/        # 미들웨어
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── authService.ts
│   │   │   ├── intakeService.ts
│   │   │   ├── notificationService.ts
│   │   │   └── statsService.ts
│   │   ├── utils/             # 유틸리티
│   │   │   ├── logger.ts
│   │   │   ├── crypto.ts
│   │   │   └── validators.ts
│   │   ├── config/            # 설정
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── oauth.ts
│   │   └── app.ts             # Express 앱
│   ├── prisma/                # Prisma ORM
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/                 # 테스트
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                      # 문서
│   ├── PRD.md
│   ├── UI_UX_SPEC.md
│   ├── TECH_ARCHITECTURE.md
│   ├── DEV_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── MARKETING_PLAN.md
│
├── .github/                   # GitHub Actions
│   └── workflows/
│       ├── test.yml
│       └── deploy.yml
│
├── docker-compose.yml         # 로컬 개발용
├── .gitignore
└── README.md
```

### 2.2 파일 명명 규칙

#### Components
```
PascalCase: Button.tsx, UserProfile.tsx
폴더 구조: FeatureName/ComponentName.tsx
```

#### Screens
```
PascalCase + Screen: HomeScreen.tsx, SettingsScreen.tsx
```

#### Services
```
camelCase + Service: authService.ts, intakeService.ts
```

#### Utils
```
camelCase: formatters.ts, validators.ts
```

#### Tests
```
*.test.ts: Button.test.ts, authService.test.ts
```

---

## 3. 코딩 컨벤션

### 3.1 TypeScript

#### 타입 정의
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
  dailyGoal: number;
}

// ❌ Bad
type User = {
  id: string,
  email: string,
  name: string,
  dailyGoal: number
}
```

#### 함수 정의
```typescript
// ✅ Good
const calculateDailyGoal = (weight: number, activityLevel: string): number => {
  const baseAmount = weight * 30; // 30ml per kg
  const activityMultiplier = {
    low: 1.0,
    medium: 1.2,
    high: 1.5
  };
  return Math.round(baseAmount * activityMultiplier[activityLevel]);
};

// ❌ Bad
function calculateDailyGoal(weight, activityLevel) {
  return weight * 30;
}
```

#### 비동기 처리
```typescript
// ✅ Good
try {
  const response = await api.post('/intake', { amount: 300 });
  return response.data;
} catch (error) {
  if (error instanceof NetworkError) {
    // 오프라인 모드로 전환
    await saveLocally({ amount: 300 });
  }
  throw error;
}

// ❌ Bad
api.post('/intake', { amount: 300 })
  .then(response => response.data)
  .catch(error => console.error(error));
```

### 3.2 React Native

#### 컴포넌트 구조
```typescript
// ✅ Good
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={onPress}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2196F3',
    borderRadius: 24
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500'
  }
});

export default CustomButton;
```

#### Hooks 사용
```typescript
// ✅ Good
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { dailyIntake, goal } = useIntake();

  const handleIntake = useCallback((amount: number) => {
    dispatch(addIntake({ amount, source: 'manual' }));
  }, [dispatch]);

  return (
    <View>
      <ProgressCircle current={dailyIntake} goal={goal} />
      <IntakeButton onIntake={handleIntake} />
    </View>
  );
};

// ❌ Bad
class HomeScreen extends Component {
  state = {
    dailyIntake: 0,
    goal: 2000
  };

  handleIntake = (amount) => {
    this.setState({ dailyIntake: this.state.dailyIntake + amount });
  };

  render() {
    // ...
  }
}
```

### 3.3 백엔드 (Node.js)

#### Express 라우트
```typescript
// ✅ Good
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middleware/auth';
import intakeController from '../controllers/intakeController';

const router = Router();

router.post('/',
  authMiddleware,
  [
    body('amount').isInt({ min: 1, max: 5000 }),
    body('source').isIn(['manual', 'voice', 'widget', 'watch'])
  ],
  intakeController.createIntake
);

export default router;

// ❌ Bad
router.post('/', (req, res) => {
  // 직접 비즈니스 로직 구현
  const { amount } = req.body;
  // ...
});
```

#### 에러 처리
```typescript
// ✅ Good
class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.constructor.name,
        message: err.message
      }
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.'
    }
  });
};

// ❌ Bad
try {
  // ...
} catch (error) {
  res.status(500).send('Error');
}
```

---

## 4. 테스트 가이드

### 4.1 테스트 전략

**테스트 피라미드**:
```
      /\
     /  \    E2E Tests (10%)
    /----\
   /      \  Integration Tests (20%)
  /--------\
 /          \ Unit Tests (70%)
/____________\
```

### 4.2 단위 테스트

#### React Native 컴포넌트
```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click me" onPress={() => {}} />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Click me" onPress={mockOnPress} />);

    fireEvent.press(getByText('Click me'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

#### 백엔드 서비스
```typescript
// __tests__/services/intakeService.test.ts
import intakeService from '../../src/services/intakeService';
import prisma from '../../src/config/database';

jest.mock('../../src/config/database');

describe('IntakeService', () => {
  describe('createIntake', () => {
    it('should create intake record', async () => {
      const mockData = {
        userId: 'user-123',
        amount: 300,
        source: 'manual'
      };

      prisma.intakeRecord.create.mockResolvedValue({
        id: 'record-123',
        ...mockData,
        timestamp: new Date()
      });

      const result = await intakeService.createIntake(mockData);

      expect(result.amount).toBe(300);
      expect(prisma.intakeRecord.create).toHaveBeenCalledWith({
        data: mockData
      });
    });
  });
});
```

### 4.3 통합 테스트

```typescript
// __tests__/integration/intake.test.ts
import request from 'supertest';
import app from '../../src/app';
import { setupTestDB, teardownTestDB } from '../utils/database';

describe('Intake API', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('POST /api/v1/intake', () => {
    it('should create intake record', async () => {
      const token = 'valid-jwt-token';

      const response = await request(app)
        .post('/api/v1/intake')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 300,
          source: 'manual'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.record.amount).toBe(300);
    });
  });
});
```

### 4.4 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 감시 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage

# 특정 파일만 테스트
npm test Button.test.tsx
```

---

## 5. Git 워크플로우

### 5.1 브랜치 전략

**Git Flow**:
```
main (production)
  ├── develop
  │   ├── feature/user-auth
  │   ├── feature/intake-tracking
  │   └── feature/statistics
  ├── release/v1.0.0
  └── hotfix/critical-bug
```

### 5.2 커밋 컨벤션

**Commit Message Format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 패키지 등

**Examples**:
```bash
feat(auth): add social login with Google

- Implement OAuth 2.0 flow
- Add Google sign-in button
- Store user profile in database

Closes #123

fix(intake): correct daily goal calculation

The formula was using weight in pounds instead of kilograms.

Fixes #456
```

### 5.3 Pull Request 프로세스

1. **브랜치 생성**
```bash
git checkout -b feature/user-auth
```

2. **개발 및 커밋**
```bash
git add .
git commit -m "feat(auth): implement JWT authentication"
```

3. **푸시 및 PR 생성**
```bash
git push origin feature/user-auth
# GitHub에서 PR 생성
```

4. **코드 리뷰**
- 최소 1명 이상의 리뷰어 승인 필요
- 모든 테스트 통과 필수
- 코드 커버리지 80% 이상 유지

5. **머지**
```bash
# Squash and merge
git checkout develop
git merge --squash feature/user-auth
git commit -m "feat(auth): add user authentication (#123)"
git push origin develop
```

---

## 6. 디버깅

### 6.1 React Native 디버깅

#### React DevTools
```bash
# 설치
npm install -g react-devtools

# 실행
react-devtools
```

#### Flipper
- 네트워크 요청 확인
- Redux 상태 검사
- 성능 모니터링

#### 로그 확인
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### 6.2 백엔드 디버깅

#### 로그 레벨
```typescript
// 개발 환경
logger.debug('User logged in', { userId: user.id });

// 운영 환경
logger.info('Payment processed', { orderId, amount });
logger.error('Database connection failed', { error: err.message });
```

#### PostgreSQL 쿼리 로그
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 개발 시 쿼리 로깅 활성화
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## 7. 성능 최적화

### 7.1 React Native 최적화

#### 리스트 최적화
```typescript
// ✅ Good - FlatList with virtualization
<FlatList
  data={intakeRecords}
  renderItem={({ item }) => <IntakeItem item={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
/>

// ❌ Bad - ScrollView with map
<ScrollView>
  {intakeRecords.map(item => (
    <IntakeItem key={item.id} item={item} />
  ))}
</ScrollView>
```

#### 이미지 최적화
```typescript
// ✅ Good
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  style={styles.image}
  resizeMode={FastImage.resizeMode.contain}
/>

// ❌ Bad
<Image source={{ uri: imageUrl }} style={styles.image} />
```

### 7.2 백엔드 최적화

#### 쿼리 최적화
```typescript
// ✅ Good - Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  },
  where: {
    createdAt: {
      gte: startDate
    }
  }
});

// ❌ Bad - Select all fields
const users = await prisma.user.findMany();
```

#### 캐싱
```typescript
// Redis 캐싱
const getCachedUser = async (userId: string) => {
  const cacheKey = `user:${userId}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
};
```

---

## 8. 보안 체크리스트

### 8.1 개발 시 확인사항

- [ ] 환경 변수에 민감 정보 저장
- [ ] SQL Injection 방지 (Prisma ORM 사용)
- [ ] XSS 방지 (입력 sanitization)
- [ ] CSRF 토큰 사용
- [ ] HTTPS만 허용
- [ ] JWT 토큰 만료 시간 설정
- [ ] Rate limiting 적용
- [ ] 입력 데이터 검증

### 8.2 코드 리뷰 시 확인사항

- [ ] 하드코딩된 시크릿 없음
- [ ] 에러 메시지에 민감 정보 노출 안 함
- [ ] 적절한 권한 검사
- [ ] 로그에 민감 정보 없음
- [ ] 의존성 취약점 검사

---

## 9. 유용한 스크립트

### 9.1 개발용 스크립트

```json
// package.json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "clean": "react-native start --reset-cache",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset"
  }
}
```

### 9.2 배포용 스크립트

```bash
# build.sh
#!/bin/bash

# Backend
cd backend
npm run build
docker build -t watertime-api:latest .

# Mobile
cd ../mobile
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```

---

## 10. 트러블슈팅

### 10.1 자주 발생하는 문제

#### Metro Bundler 에러
```bash
# 캐시 삭제
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
npm install

# 재시작
npx react-native start --reset-cache
```

#### iOS 빌드 에러
```bash
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

#### Android 빌드 에러
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 10.2 성능 문제

#### 메모리 누수
```typescript
// 컴포넌트 언마운트 시 정리
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);

  return () => {
    subscription.remove();
  };
}, []);
```

#### 느린 앱 실행
```bash
# 프로덕션 빌드로 테스트
npx react-native run-ios --configuration Release
npx react-native run-android --variant release
```

---

## 11. 추가 리소스

### 11.1 공식 문서
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)

### 11.2 추천 도구
- [Reactotron](https://github.com/infinitered/reactotron) - 디버깅
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - 상태 관리
- [Postman](https://www.postman.com/) - API 테스트

### 11.3 커뮤니티
- [React Native GitHub](https://github.com/facebook/react-native)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Discord](https://discord.gg/reactnative)

---

## 12. 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-02-15 | 자비스 | 초기 작성 |

---

**다음 단계**: 배포 가이드 작성 → 마케팅 플랜 수립
