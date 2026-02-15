# WaterTime - 개발 환경 설정 가이드

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
# 전체 의존성 설치
npm install

# 또는 설정 스크립트 실행
./scripts/setup-dev.sh
```

### 2. 환경 변수 설정

```bash
# 환경 변수 템플릿 복사
cp .env.example .env.local

# .env.local 파일 편집 (필요한 경우)
nano .env.local
```

### 3. Docker 서비스 시작

```bash
# PostgreSQL 및 Redis 시작
npm run docker:up

# 상태 확인
docker-compose ps

# 로그 확인
npm run docker:logs
```

### 4. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:setup

# 마이그레이션 실행
npm run db:migrate

# 시드 데이터 추가 (선택)
npm run db:seed

# Prisma Studio 열기 (선택)
npm run db:studio
```

### 5. 개발 서버 시작

```bash
# 앱과 서버 동시 시작
npm run dev

# 또는 개별 시작
npm run dev:app     # React Native 앱 (포트 8081)
npm run dev:server  # Express 서버 (포트 3000)
```

## 📁 프로젝트 구조

```
watertime/
├── app/                    # React Native 모바일 앱
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── screens/       # 화면 컴포넌트
│   │   ├── navigation/    # 네비게이션 설정
│   │   ├── services/      # API 호출
│   │   ├── store/         # Redux 상태 관리
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── utils/         # 유틸리티 함수
│   │   └── types/         # TypeScript 타입
│   ├── android/           # Android 네이티브 코드
│   ├── ios/               # iOS 네이티브 코드
│   └── package.json
│
├── server/                 # Node.js 백엔드 서버
│   ├── src/
│   │   ├── routes/        # API 라우트
│   │   ├── controllers/   # 컨트롤러
│   │   ├── services/      # 비즈니스 로직
│   │   ├── models/        # 데이터 모델
│   │   ├── middleware/    # 미들웨어
│   │   ├── utils/         # 유틸리티
│   │   └── database/      # 데이터베이스 설정
│   └── package.json
│
├── docs/                   # 프로젝트 문서
├── scripts/               # 개발 스크립트
├── docker-compose.yml     # Docker 서비스 정의
├── package.json           # 루트 패키지 (모노레포)
└── README.md
```

## 🔧 개발 도구

### 데이터베이스 관리 도구

```bash
# pgAdmin (PostgreSQL 웹 관리 도구)
npm run docker:tools
# http://localhost:5050
# Email: admin@watertime.local
# Password: admin

# Redis Commander (Redis 웹 관리 도구)
# http://localhost:8081
```

### Android Studio 설정

1. Android Studio 설치
2. SDK 설치 (API 33+)
3. Android Emulator 생성

### Xcode 설정 (macOS only)

1. Xcode 설치
2. CocoaPods 설치: `sudo gem install cocoapods`
3. iOS Simulator 사용

## 📝 사용 가능한 명령어

### 개발
```bash
npm run dev          # 전체 개발 서버 시작
npm run dev:app      # 앱만 시작
npm run dev:server   # 서버만 시작
```

### 빌드
```bash
npm run build        # 전체 빌드
npm run build:app    # 앱 빌드
npm run build:server # 서버 빌드
```

### 테스트
```bash
npm run test         # 전체 테스트
npm run test:app     # 앱 테스트
npm run test:server  # 서버 테스트
```

### 린트 & 포맷
```bash
npm run lint         # 전체 린트
npm run format       # 코드 포맷팅
```

### 데이터베이스
```bash
npm run db:setup     # Prisma 설정
npm run db:migrate   # 마이그레이션
npm run db:seed      # 시드 데이터
npm run db:studio    # Prisma Studio
```

### Docker
```bash
npm run docker:up    # 서비스 시작
npm run docker:down  # 서비스 중지
npm run docker:logs  # 로그 확인
npm run docker:tools # 관리 도구 시작
```

## 🔌 API 엔드포인트

개발 서버는 `http://localhost:3000`에서 실행됩니다.

주요 엔드포인트:
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/oauth/google` - Google OAuth
- `GET /api/intake/daily` - 일일 섭취량
- `POST /api/intake` - 섭취 기록
- `GET /api/stats/weekly` - 주간 통계

## 🐛 트러블슈팅

### 포트 충돌
```bash
# 포트 3000 사용 중인 프로세스 찾기
lsof -i :3000
# 또는
netstat -ano | findstr :3000

# 프로세스 종료
kill -9 <PID>
```

### Docker 문제
```bash
# 컨테이너 재시작
docker-compose restart

# 컨테이너 삭제 후 재시작
docker-compose down -v
docker-compose up -d

# 로그 확인
docker-compose logs postgres
docker-compose logs redis
```

### 의존성 문제
```bash
# node_modules 삭제 후 재설치
npm run clean

# 캐시 삭제
npm cache clean --force
```

### React Native 문제
```bash
# Metro bundler 캐시 삭제
cd app
npm start -- --reset-cache

# Android 빌드 캐시 삭제
cd android
./gradlew clean

# iOS 빌드 캐시 삭제 (macOS)
cd ios
pod deintegrate
pod install
```

## 📊 모니터링

### 애플리케이션 상태
- React Native Metro: http://localhost:8081
- Express API: http://localhost:3000
- pgAdmin: http://localhost:5050
- Redis Commander: http://localhost:8081

### 로그
```bash
# 앱 로그
npm run dev:app

# 서버 로그
npm run dev:server

# Docker 로그
npm run docker:logs
```

## 🔐 보안 주의사항

1. `.env.local` 파일을 `.gitignore`에 추가
2. 민감 정보를 절대 커밋하지 않기
3. production 환경에서는 환경 변수를 안전하게 관리
4. API 키를 주기적으로 교체

## 📚 추가 리소스

- [React Native 공식 문서](https://reactnative.dev/)
- [Node.js 공식 문서](https://nodejs.org/)
- [Prisma 공식 문서](https://www.prisma.io/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [Redis 공식 문서](https://redis.io/documentation)

## 🆘 도움말

문제가 발생하면:
1. 위 트러블슈팅 섹션 확인
2. GitHub Issues 검색
3. 팀 슬랙 채널에 질문
