# WaterTime - 실행 가이드

**Version**: 1.0
**Date**: 2026-02-15
**Status**: ✅ MVP 개발 완료

---

## 🚀 빠른 시작

### 사전 요구사항

#### 필수 소프트웨어
- **Node.js**: v22.11.0 이상
- **npm**: v10.0.0 이상 또는 yarn v1.22+
- **Git**: v2.30+
- **Docker**: v20.10+ (권장)

#### 플랫폼별 요구사항
- **iOS 개발**: macOS 11+, Xcode 15.0+ (선택사항)
- **Android 개발**: Android Studio 최신 버전, Android SDK API 33+

### 1단계: 프로젝트 클론

```bash
# 저장소 클론
git clone https://github.com/jeongsk/watertime.git
cd watertime

# 서브모듈 초기화 (있을 경우)
git submodule update --init --recursive
```

### 2단계: 의존성 설치

#### 백엔드 (Server)
```bash
cd server

# 패키지 설치
npm install

# Prisma 클라이언트 생성
npm run prisma:generate
```

#### 프론트엔드 (App)
```bash
cd ../app

# 패키지 설치
npm install

# iOS CocoaPods 설치 (macOS만)
cd ios
pod install
cd ..
```

### 3단계: 환경 변수 설정

#### 백엔드 환경 변수
```bash
cd server
cp .env.example .env
```

**.env 파일 설정**:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/watertime"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-123"
JWT_EXPIRES_IN="7d"

# Notification (선택사항)
FCM_SERVER_KEY="your-fcm-server-key"
APNS_KEY_ID="your-apns-key-id"
APNS_TEAM_ID="your-team-id"

# Weather API (선택사항)
OPENWEATHERMAP_API_KEY="your-api-key"
```

#### 프론트엔드 환경 변수
```bash
cd ../app
cp .env.example .env
```

**.env 파일 설정**:
```env
# API Base URL
API_URL=http://localhost:3000/api

# App Configuration
NODE_ENV=development

# Analytics (선택사항)
GOOGLE_ANALYTICS_ID="your-ga-id"
```

### 4단계: 데이터베이스 설정

#### PostgreSQL 실행 (Docker)
```bash
# 프로젝트 루트에서
cd watertime

# Docker로 PostgreSQL 실행
docker run --name watertime-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=watertime \
  -p 5432:5432 \
  -d postgres:15

# 또는 docker-compose 사용
npm run docker:up
```

#### 데이터베이스 마이그레이션
```bash
cd server

# 마이그레이션 실행
npm run prisma:migrate

# 시드 데이터 생성 (테스트용)
npm run prisma:seed

# Prisma Studio 실행 (DB 확인)
npm run prisma:studio
```

### 5단계: 개발 서버 실행

#### 백엔드 실행
```bash
cd server

# 개발 서버 실행 (Hot Reload)
npm run dev

# 서버 실행 확인
curl http://localhost:3000/health
```

#### 프론트엔드 실행
새 터미널을 열고:

```bash
cd app

# Metro bundler 시작
npm start
```

#### 모바일 앱 실행

**Android**:
```bash
cd app
npm run android
```

**iOS** (macOS만):
```bash
cd app
npm run ios
```

## 📱 개별 서비스 실행

### 백엔드만 실행
```bash
cd server
npm run dev
```

### 프론트엔드만 실행 (Metro)
```bash
cd app
npm start
```

### 백그라운드 서비스
```bash
# Redis 실행 (Docker)
docker run --name watertime-redis \
  -p 6379:6379 \
  -d redis:7

# PostgreSQL 실행 (위와 동일)
```

## 🔧 개발 모드

### TypeScript 컴파일 확인
```bash
# 백엔드
cd server
npm run build
# dist 폴더 생성 확인

# 프론트엔드
cd app
npx tsc --noEmit
# TypeScript 오류 없음 확인
```

### ESLint 및 Prettier
```bash
# 전체 프로젝트 Lint
npm run lint

# 자동 포맷팅
npm run format
```

### 테스트 실행
```bash
# 백엔드 테스트
cd server
npm test

# 프론트엔드 테스트
cd app
npm test

# E2E 테스트 (Detox)
npm run test:e2e
```

## 🐳 Docker 실행

### 개발 환경 (Docker Compose)
```bash
# 전체 서비스 실행
docker-compose up -d

# 서비스 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

### 개별 컨테이너
```bash
# PostgreSQL
docker run -d --name watertime-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=watertime \
  -p 5432:5432 \
  postgres:15

# Redis
docker run -d --name watertime-redis \
  -p 6379:6379 \
  redis:7
```

## 📊 모니터링

### 백엔드 모니터링
```bash
# 서버 로그 확인
cd server
npm run dev

# Prisma Studio (DB 확인)
npm run prisma:studio

# 프록시 설정 (개발용)
npm install -g http-proxy-middleware
```

### 프론트�드 모니터링
```bash
# React Native Debugger
npm install -g react-native-debugger

# Flipper 설치 (선택사항)
npm install -g flipper-cli

# 로그 확인
npx react-native log-android
npx react-native log-ios
```

## 🔍 디버깅

### 일반적인 문제 해결

#### Metro bundler 에러
```bash
# 캐시 삭제
cd app
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
npm install

# 재시작
npm start --reset-cache
```

#### iOS 빌드 에러
```bash
cd app/ios
pod deintegrate
pod install
cd ../..
npx react-native run-ios
```

#### Android 빌드 에러
```bash
cd app/android
./gradlew clean
cd ../..
npx react-native run-android
```

### 데이터베이스 문제
```bash
# Prisma 재설정
cd server
npm run prisma:migrate reset

# 새로운 마이그레이션
npx prisma migrate dev --name init
```

### 인증 문제
```bash
# JWT 토큰 테스트
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","name":"Test User"}'
```

## 🚀 배포 준비

### 프로덕션 빌드

#### 백엔드
```bash
cd server
npm run build
npm start
```

#### 프론트엔드
```bash
cd app
npm run build
# Android: android/app/build/outputs/apk/
# iOS: ios/build/Archive.xcarchive/
```

### 환경 변수 설정 (배포용)
```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/watertime
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=your-production-secret-key
```

### Docker 이미지 빌드
```bash
# 백엔드
cd server
docker build -t watertime-api:latest .

# 프론트엔드
cd app
docker build -t watertime-app:latest .
```

## 📚 추가 리소스

### 공식 문서
- [React Native](https://reactnative.dev/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

### 유용한 도구
- [Postman](https://www.postman.com/) - API 테스트
- [Prisma Studio](https://www.prisma.io/studio) - DB 관리
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger) - 디버깅
- [Flipper](https://fbflipper.com/) - 모니터링

---

## 💡 팁

1. **개발 팁**: 항상 `npm run dev`로 백엔드를 먼저 실행하세요
2. **데이터베이스**: 개발 시 Prisma Studio로 DB 상태를 확인하세요
3. **모바일 테스트**: 실제 기기에서 테스트하세요 (에뮬레이터와 다름)
4. **성능**: 개발 시 Redux DevTools로 상태 변화를 모니터링하세요
5. **보안**: 프로덕션 배포 전 환경 변수를 반드시 변경하세요

---

**문의 사항**: GitHub Issues 또는 Discord 채널을 통해 질문해주세요