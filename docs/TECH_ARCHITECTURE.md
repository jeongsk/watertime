# WaterTime - 기술 아키텍처 문서

**버전**: 1.0
**작성일**: 2026-02-15
**작성자**: 자비스 (AI Assistant)

---

## 1. 시스템 아키텍처 개요

### 1.1 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────┐
│                  Client Layer                    │
│                                                  │
│  ┌──────────┐        ┌──────────┐               │
│  │ iOS App  │        │Android   │               │
│  │(React    │        │App(React │               │
│  │ Native)  │        │ Native)  │               │
│  └────┬─────┘        └─────┬────┘               │
│       │                    │                     │
│  ┌────▼────────────────────▼────┐               │
│  │   React Native Core          │               │
│  │  - Navigation                │               │
│  │  - State Management (Redux)  │               │
│  │  - Local DB (SQLite/Watermelon)│              │
│  └────────────┬──────────────────┘               │
└───────────────┼─────────────────────────────────┘
                │
                │ HTTPS (REST API)
                │
┌───────────────┼─────────────────────────────────┐
│               ▼     API Gateway                  │
│  ┌────────────────────────────┐                 │
│  │  Load Balancer (Nginx)     │                 │
│  │  Rate Limiting, SSL        │                 │
│  └────────────┬───────────────┘                 │
│               ▼                                   │
│  ┌────────────────────────────┐                 │
│  │  API Server (Node.js)      │                 │
│  │  - Express.js              │                 │
│  │  - Authentication          │                 │
│  │  - Business Logic          │                 │
│  └────┬───────┬───────┬────────┘                 │
│       │       │       │                          │
│  ┌────▼─┐ ┌──▼──┐ ┌──▼─────┐                    │
│  │Redis │ │ DB  │ │Storage │                    │
│  │Cache │ │     │ │  S3    │                    │
│  └──────┘ └─────┘ └────────┘                    │
│                                                  │
│              Backend Layer                       │
└─────────────────────────────────────────────────┘
                │
                │ External APIs
                │
┌───────────────┼─────────────────────────────────┐
│  ┌────────────▼────────────┐                    │
│  │  HealthKit (iOS)        │                    │
│  │  Google Fit (Android)   │                    │
│  │  OpenWeatherMap         │                    │
│  │  FCM/APNS               │                    │
│  └─────────────────────────┘                    │
│              External Services                   │
└─────────────────────────────────────────────────┘
```

### 1.2 기술 스택

#### Frontend (Mobile App)
- **Framework**: React Native 0.73+
- **Language**: TypeScript 5.0+
- **Navigation**: React Navigation 6.x
- **State Management**: Redux Toolkit + RTK Query
- **Local DB**: WatermelonDB (SQLite)
- **UI Library**: React Native Paper / NativeBase

#### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.0+
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Prisma 5.x
- **Storage**: AWS S3 / Google Cloud Storage

#### Authentication
- **Provider**: Firebase Auth / Auth0
- **OAuth**: Google, Apple, Kakao
- **JWT**: RS256 algorithm

#### Notifications
- **iOS**: Apple Push Notification Service (APNS)
- **Android**: Firebase Cloud Messaging (FCM)

#### External APIs
- **Health Data**: Apple HealthKit, Google Fit API
- **Weather**: OpenWeatherMap API
- **Analytics**: Google Analytics, Mixpanel

#### DevOps
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (ECS/Fargate) or Google Cloud Run
- **Monitoring**: DataDog / New Relic
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

---

## 2. 데이터베이스 설계

### 2.1 ERD (Entity Relationship Diagram)

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │───┐
│ email        │   │
│ password     │   │
│ name         │   │
│ weight       │   │
│ height       │   │
│ activityLevel│   │
│ dailyGoal    │   │
│ createdAt    │   │
└──────────────┘   │
                   │
                   │ 1:N
                   │
┌──────────────┐   │
│intake_records│   │
├──────────────┤   │
│ id (PK)      │   │
│ userId (FK)  │───┘
│ amount       │
│ source       │
│ note         │
│ timestamp    │
└──────────────┘

┌──────────────────┐
│notification_config│
├──────────────────┤
│ id (PK)          │
│ userId (FK)      │───┐
│ enabled          │   │
│ interval         │   │
│ startTime        │   │
│ endTime          │   │
│ sound            │   │
│ vibration        │   │
└──────────────────┘   │
                       │
                       │ 1:1
                       │
┌──────────────┐       │
│   users      │───────┘
└──────────────┘
```

### 2.2 테이블 상세

#### users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(100),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  age INTEGER,
  activity_level VARCHAR(20) CHECK (activity_level IN ('low', 'medium', 'high')),
  daily_goal INTEGER DEFAULT 2000,
  timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### intake_records 테이블
```sql
CREATE TABLE intake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source VARCHAR(20) CHECK (source IN ('manual', 'voice', 'widget', 'watch')),
  note TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_intake_records_user_id ON intake_records(user_id);
CREATE INDEX idx_intake_records_timestamp ON intake_records(timestamp);
CREATE INDEX idx_intake_records_user_timestamp ON intake_records(user_id, timestamp);
```

#### notification_config 테이블
```sql
CREATE TABLE notification_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  interval_minutes INTEGER DEFAULT 60,
  start_time TIME DEFAULT '08:00',
  end_time TIME DEFAULT '22:00',
  sound VARCHAR(50) DEFAULT 'default',
  vibration BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_config_user_id ON notification_config(user_id);
```

### 2.3 인덱스 전략

**Primary Indexes**:
- `users(id)` - Primary Key
- `intake_records(id)` - Primary Key

**Secondary Indexes**:
- `users(email)` - 로그인 시 사용
- `intake_records(user_id, timestamp)` - 사용자별 기록 조회
- `intake_records(timestamp)` - 일일 통계 계산

---

## 3. API 설계

### 3.1 API 엔드포인트 구조

**Base URL**: `https://api.watertime.com/v1`

#### 인증 (Authentication)
```
POST   /auth/register          회원가입
POST   /auth/login             로그인
POST   /auth/logout            로그아웃
POST   /auth/refresh           토큰 갱신
POST   /auth/social/:provider  소셜 로그인 (google, apple, kakao)
POST   /auth/password/reset    비밀번호 재설정
```

#### 사용자 (Users)
```
GET    /users/me               내 정보 조회
PUT    /users/me               내 정보 수정
DELETE /users/me               계정 삭제
GET    /users/me/stats         내 통계 요약
```

#### 섭취 기록 (Intake)
```
POST   /intake                 물 섭취 기록
GET    /intake/today           오늘 기록 조회
GET    /intake/history         히스토리 조회 (페이지네이션)
GET    /intake/:id             특정 기록 조회
PUT    /intake/:id             기록 수정
DELETE /intake/:id             기록 삭제
```

#### 통계 (Statistics)
```
GET    /stats/daily            일일 통계
GET    /stats/weekly           주간 통계
GET    /stats/monthly          월간 통계
GET    /stats/insights         AI 인사이트
```

#### 알림 (Notifications)
```
GET    /notifications/config   알림 설정 조회
PUT    /notifications/config   알림 설정 수정
POST   /notifications/test     테스트 알림
```

### 3.2 API 상세 명세

#### POST /auth/register
회원가입

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "김철수"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "name": "김철수"
    },
    "tokens": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 3600
    }
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "이미 등록된 이메일입니다."
  }
}
```

#### POST /intake
물 섭취 기록

**Request**:
```json
{
  "amount": 300,
  "source": "manual",
  "note": "아침에 마심",
  "timestamp": "2026-02-15T08:30:00Z"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "record": {
      "id": "uuid-here",
      "amount": 300,
      "source": "manual",
      "note": "아침에 마심",
      "timestamp": "2026-02-15T08:30:00Z",
      "createdAt": "2026-02-15T08:30:05Z"
    },
    "dailyProgress": {
      "current": 1500,
      "goal": 2000,
      "percentage": 75
    }
  }
}
```

#### GET /stats/weekly
주간 통계

**Query Parameters**:
```
?startDate=2026-02-12
&endDate=2026-02-18
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2026-02-12",
      "endDate": "2026-02-18"
    },
    "summary": {
      "totalIntake": 12600,
      "averageDaily": 1800,
      "goalAchievementRate": 0.75,
      "recordCount": 28
    },
    "dailyData": [
      {
        "date": "2026-02-12",
        "intake": 2100,
        "goalMet": true
      },
      {
        "date": "2026-02-13",
        "intake": 1500,
        "goalMet": false
      },
      // ... more days
    ],
    "insights": [
      {
        "type": "trend",
        "message": "지난주보다 15% 증가했습니다"
      },
      {
        "type": "pattern",
        "message": "오후 3시에 가장 많이 마십니다"
      }
    ]
  }
}
```

### 3.3 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|----------|------|
| `VALIDATION_ERROR` | 400 | 요청 데이터 검증 실패 |
| `UNAUTHORIZED` | 401 | 인증 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `CONFLICT` | 409 | 충돌 (예: 중복 이메일) |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 한도 초과 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

### 3.4 인증

**JWT Token Structure**:
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

**Authorization Header**:
```
Authorization: Bearer <access_token>
```

---

## 4. 보안 아키텍처

### 4.1 인증/인가

**Multi-layer Authentication**:
1. **Device Authentication**: Device ID 검증
2. **User Authentication**: JWT + OAuth
3. **Session Management**: Refresh Token Rotation

**Password Security**:
- bcrypt 해싱 (cost factor 12)
- 비밀번호 강도 검증
- 계정 잠금 (5회 실패 시)

### 4.2 데이터 보호

**Encryption**:
- **At Rest**: AES-256 (PostgreSQL)
- **In Transit**: TLS 1.3
- **Sensitive Fields**: 추가 암호화 (주민번호 등)

**Data Masking**:
```javascript
// 이메일 마스킹
user@example.com → u***@example.com

// 전화번호 마스킹
010-1234-5678 → 010-****-5678
```

### 4.3 API 보안

**Rate Limiting**:
```
- 일반 API: 100 requests/minute
- 인증 API: 10 requests/minute
- 민감한 API: 5 requests/minute
```

**Input Validation**:
- 모든 입력 데이터 검증
- SQL Injection 방지 (Prisma ORM)
- XSS 방지 (입력 sanitization)

### 4.4 컴플라이언스

**GDPR 준수**:
- 사용자 데이터 삭제권
- 데이터 이식성
- 동의 관리

**개인정보보호법 준수**:
- 수집 목적 명시
- 제3자 제공 동의
- 보관 기한 준수

---

## 5. 성능 최적화

### 5.1 캐싱 전략

**Redis Cache Layers**:

**Layer 1: 사용자 세션**
```
Key: session:{userId}
TTL: 24 hours
Data: { accessToken, refreshToken, lastActivity }
```

**Layer 2: 자주 조회되는 데이터**
```
Key: user:stats:{userId}:{date}
TTL: 1 hour
Data: { dailyIntake, goalProgress }
```

**Layer 3: 정적 데이터**
```
Key: config:notification_sounds
TTL: 24 hours
Data: [ { id, name, url } ]
```

### 5.2 데이터베이스 최적화

**Connection Pooling**:
```javascript
const pool = new Pool({
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

**Query Optimization**:
```sql
-- 일일 통계 계산 (최적화)
SELECT
  SUM(amount) as total,
  COUNT(*) as count
FROM intake_records
WHERE user_id = $1
  AND DATE(timestamp) = CURRENT_DATE;

-- 인덱스 활용
CREATE INDEX CONCURRENTLY idx_optimized
ON intake_records(user_id, DATE(timestamp));
```

### 5.3 API 성능

**Pagination**:
```javascript
// Cursor-based pagination
GET /intake/history?cursor=abc123&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "nextCursor": "def456",
    "hasMore": true
  }
}
```

**Response Compression**:
- Gzip 압축 (6 레벨)
- JSON minification
- 불필요한 필드 제외

---

## 6. 확장성

### 6.1 수평 확장 (Horizontal Scaling)

**로드 밸런싱**:
```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
┌──────▼──────┐
│Load Balancer│
└──────┬──────┘
       │
   ┌───┴───┬───────┐
   │       │       │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│ API │ │ API │ │ API │
│  1  │ │  2  │ │  3  │
└─────┘ └─────┘ └─────┘
```

**Auto-scaling**:
- CPU 사용률 > 70% → 인스턴스 추가
- CPU 사용률 < 30% → 인스턴스 제거
- 최소 2개, 최대 10개

### 6.2 마이크로서비스 전환 준비

**현재**: 모놀리식 아키텍처
**향후**: 마이크로서비스

```
┌──────────────┐
│  API Gateway │
└──────┬───────┘
       │
   ┌───┴────┬───────┬────────┐
   │        │       │        │
┌──▼───┐ ┌──▼───┐ ┌─▼────┐ ┌─▼────┐
│ Auth │ │Intake│ │ Stats│ │ Notif│
│Service│ │Service│ │Service│ │Service│
└──────┘ └──────┘ └──────┘ └──────┘
```

---

## 7. 모니터링 및 로깅

### 7.1 모니터링 메트릭

**시스템 메트릭**:
- CPU, 메모리, 디스크 사용률
- 네트워크 트래픽
- API 응답 시간
- 에러율

**비즈니스 메트릭**:
- DAU/MAU
- API 요청 수
- 기록 생성 수
- 알림 발송 수

### 7.2 로깅 전략

**Log Levels**:
```
ERROR: 시스템 오류, 예외
WARN: 경고, 비정상 상황
INFO: 중요 이벤트 (로그인, 결제)
DEBUG: 개발용 디버그 정보
```

**Log Format** (JSON):
```json
{
  "timestamp": "2026-02-15T08:30:05Z",
  "level": "INFO",
  "userId": "uuid",
  "action": "INTAKE_RECORD_CREATED",
  "metadata": {
    "amount": 300,
    "source": "manual"
  },
  "requestId": "req-abc123"
}
```

---

## 8. 배포 아키텍처

### 8.1 환경 구성

**Development**:
```
- 로컬 개발 환경
- Docker Compose
- Hot reload
```

**Staging**:
```
- AWS ECS (Fargate)
- RDS PostgreSQL
- ElastiCache Redis
- 테스트 데이터
```

**Production**:
```
- AWS ECS (Fargate) + Auto Scaling
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis (Cluster)
- S3 + CloudFront
- Route 53
```

### 8.2 CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t watertime-api .

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS
        run: |
          aws ecs update-service --cluster prod --service watertime-api
```

---

## 9. 기술 부채 관리

### 9.1 현재 제약사항

1. **모놀리식 구조**: 추후 마이크로서비스 전환 필요
2. **단일 DB**: 샤딩 필요 시점 파악
3. **동기 처리**: 일부 작업 비동기 전환

### 9.2 향후 개선 계획

**Phase 1 (6개월)**:
- [ ] 코드 커버리지 80% 달성
- [ ] ESLint/Prettier 강제
- [ ] API 문서 자동화 (Swagger)

**Phase 2 (12개월)**:
- [ ] 마이크로서비스 분리 (알림 서비스)
- [ ] GraphQL 도입 검토
- [ ] CDN 도입

---

## 10. 기술 스택 선정 이유

### 10.1 React Native

**장점**:
- 크로스 플랫폼 (iOS + Android)
- 넓은 커뮤니티
- 핫 리로드
- JavaScript/TypeScript

**대안 고려**:
- Flutter: 성능 좋으나 학습 곡선 높음
- Native: 비용 2배 증가

### 10.2 Node.js + Express

**장점**:
- JavaScript 풀스택
- 빠른 개발
- 풍부한 미들웨어

**대안 고려**:
- Python (FastAPI): 성능 좋으나 생태계 작음
- Go: 성능 최고이나 개발 속도 느림

### 10.3 PostgreSQL

**장점**:
- ACID 준수
- JSON 지원
- 확장성

**대안 고려**:
- MySQL: 성능 비슷, JSON 지원 약함
- MongoDB: NoSQL, 트랜잭션 약함

---

## 11. 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-02-15 | 자비스 | 초기 작성 |

---

**다음 단계**: 개발 가이드 작성 → 개발 환경 설정
