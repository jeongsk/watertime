# WaterTime MVP 구현 계획

**작성일**: 2026-02-15
**프로젝트**: WaterTime - AI 기반 개인화 수분 관리 서비스
**예상 기간**: 12주 (3개월)

---

## 📊 프로젝트 현황

### ✅ 완료된 작업
- 프로젝트 기획 문서 완료 (PRD, UI/UX, 기술 아키텍처 등)
- 개발 환경 설정 완료 (React Native, Node.js 프로젝트 구조)
- Docker 환경 구성 (PostgreSQL, Redis)
- Claude Code 및 OMC 설정 파일 준비

### 🔄 현재 상태
- **기획**: 100% 완료
- **디자인**: 0% (시작 전)
- **개발**: 10% (프로젝트 구조만 완료)
- **테스트**: 0% (시작 전)

---

## 🎯 MVP 범위 (Phase 1: 0-3개월)

### 핵심 기능
1. **스마트 알림** - 활동량/날씨 기반 맞춤 알림
2. **간편 기록** - 1탭으로 물 섭취 기록
3. **개인화 추천** - 체중/활동량 기반 일일 목표 계산
4. **기본 통계** - 일일/주간 섭취량 시각화

### 기술 요구사항
- **Frontend**: React Native 0.84, TypeScript, Redux Toolkit
- **Backend**: Node.js, Express, Prisma, PostgreSQL, Redis
- **Infrastructure**: AWS ECS, RDS, ElastiCache

---

## 📋 상세 구현 계획

## Phase 1: 기본 인프라 (Week 1-2)

### 목표
- 개발 환경 완전 구축
- 데이터베이스 스키마 설계
- 기본 프로젝트 구조 확정

### 작업 목록

#### 1.1 개발 환경 설정
1. **의존성 설치** (파일: `package.json`)
   - 액션: React Native 및 Node.js 의존성 설치
   - 이유: 프로젝트 실행 필수
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: React Native 0.84 호환성 확인

2. **Docker 서비스 시작** (파일: `docker-compose.yml`)
   - 액션: PostgreSQL, Redis 컨테이너 실행
   - 이유: 백엔드 개발 필수
   - 의존성: Docker 설치
   - 리스크: Low
   - WaterTime 노트: 포트 충돌 확인

3. **환경 변수 설정** (파일: `.env.local`)
   - 액션: 개발용 환경 변수 구성
   - 이유: API 키, DB 연결 정보
   - 의존성: 없음
   - 리스크: Medium (민감 정보 관리)
   - WaterTime 노트: .gitignore에 추가

#### 1.2 데이터베이스 설계
1. **Prisma 스키마 정의** (파일: `server/prisma/schema.prisma`)
   - 액션: User, Intake, Notification 모델 정의
   - 이유: 데이터 구조 기반
   - 의존성: PostgreSQL 실행
   - 리스크: Low
   - WaterTime 노트: 건강 데이터 프라이버시 고려

2. **마이그레이션 작성** (파일: `server/prisma/migrations/`)
   - 액션: 초기 마이그레이션 생성
   - 이유: DB 스키마 적용
   - 의존성: Prisma 스키마
   - 리스크: Low
   - WaterTime 노트: 롤백 계획 포함

3. **시드 데이터 생성** (파일: `server/prisma/seed.ts`)
   - 액션: 테스트용 데이터 생성
   - 이유: 개발初期 테스트 용이
   - 의존성: 마이그레이션 완료
   - 리스크: Low
   - WaterTime 노트: 개인정보 포함 금지

### Phase 1 성공 기준
- [ ] 개발 서버 정상 실행
- [ ] 데이터베이스 연결 성공
- [ ] Prisma Studio 접속 가능
- [ ] 환경 변수 로딩 확인

---

## Phase 2: 백엔드 API 개발 (Week 3-6)

### 목표
- RESTful API 구현
- 인증 시스템 구축
- 핵심 비즈니스 로직 구현

### 작업 목록

#### 2.1 인증 시스템
1. **JWT 미들웨어** (파일: `server/src/middleware/auth.middleware.ts`)
   - 액션: JWT 검증 미들웨어 구현
   - 이유: 인증된 요청만 허용
   - 의존성: 없음
   - 리스크: Medium (보안)
   - WaterTime 노트: 토큰 만료 처리

2. **회원가입 API** (파일: `server/src/routes/auth.routes.ts`)
   - 액션: POST /api/auth/register 구현
   - 이유: 사용자 등록
   - 의존성: User 모델
   - 리스크: Low
   - WaterTime 노트: 이메일 인증 고려

3. **로그인 API** (파일: `server/src/routes/auth.routes.ts`)
   - 액션: POST /api/auth/login 구현
   - 이유: 사용자 인증
   - 의존성: 회원가입 완료
   - 리스크: Medium (보안)
   - WaterTime 노트: 비밀번호 해싱

#### 2.2 섭취량 관리
1. **섭취 기록 API** (파일: `server/src/routes/intake.routes.ts`)
   - 액션: POST /api/intake 구현
   - 이유: 물 섭취 기록
   - 의존성: Intake 모델, 인증
   - 리스크: Low
   - WaterTime 노트: 중복 기록 방지

2. **일일 통계 API** (파일: `server/src/routes/intake.routes.ts`)
   - 액션: GET /api/intake/daily 구현
   - 이유: 일일 섭취량 조회
   - 의존성: 섭취 기록
   - 리스크: Low
   - WaterTime 노트: 캐싱 고려

3. **목표 설정 API** (파일: `server/src/routes/user.routes.ts`)
   - 액션: PUT /api/user/goal 구현
   - 이유: 개인 목표 설정
   - 의존성: User 모델
   - 리스크: Low
   - WaterTime 노트: 검증 로직 포함

#### 2.3 알림 시스템
1. **알림 스케줄러** (파일: `server/src/services/notification.service.ts`)
   - 액션: 활동량 기반 알림 로직
   - 이유: 스마트 알림 핵심
   - 의존성: 날씨 API
   - 리스크: Medium
   - WaterTime 노트: 배터리 소모 고려

2. **푸시 알림 발송** (파일: `server/src/services/push.service.ts`)
   - 액션: FCM/APNS 연동
   - 이유: 크로스 플랫폼 알림
   - 의존성: 알림 스케줄러
   - 리스크: High
   - WaterTime 노트: 실패 재시도 로직

### Phase 2 성공 기준
- [ ] 회원가입/로그인 가능
- [ ] 섭취량 기록 및 조회
- [ ] 알림 발송 테스트 성공
- [ ] API 문서 완료 (Swagger)

---

## Phase 3: 프론트엔드 개발 (Week 7-10)

### 목표
- React Native 앱 구현
- 핵심 화면 개발
- Redux 상태 관리

### 작업 목록

#### 3.1 네비게이션 및 구조
1. **네비게이션 설정** (파일: `app/src/navigation/AppNavigator.tsx`)
   - 액션: React Navigation 6 구성
   - 이유: 화면 이동 기반
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: 탭/스택 네비게이션

2. **Redux Store** (파일: `app/src/store/index.ts`)
   - 액션: Redux Toolkit 설정
   - 이유: 전역 상태 관리
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: 지속성 고려

#### 3.2 핵심 화면
1. **홈 화면** (파일: `app/src/screens/HomeScreen.tsx`)
   - 액션: 섭취량 프로그레스, 빠른 기록
   - 이유: 메인 화면
   - 의존성: Redux, API
   - 리스크: Low
   - WaterTime 노트: 1탭 기록 UX

2. **통계 화면** (파일: `app/src/screens/StatsScreen.tsx`)
   - 액션: 일일/주간 차트
   - 이유: 시각적 피드백
   - 의존성: 차트 라이브러리
   - 리스크: Medium
   - WaterTime 노트: 간단한 차트 사용

3. **설정 화면** (파일: `app/src/screens/SettingsScreen.tsx`)
   - 액션: 목표, 알림 설정
   - 이유: 개인화
   - 의존성: Redux
   - 리스크: Low
   - WaterTime 노트: 직관적인 UI

4. **온보딩 화면** (파일: `app/src/screens/OnboardingScreen.tsx`)
   - 액션: 초기 설정 가이드
   - 이유: 사용자 경험
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: 간결한 메시지

#### 3.3 UI 컴포넌트
1. **공통 컴포넌트** (파일: `app/src/components/`)
   - 액션: Button, Card, ProgressCircle
   - 이유: 재사용성
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: WaterTime 디자인 시스템

2. **폰트 및 색상** (파일: `app/src/theme/`)
   - 액션: 디자인 토큰 정의
   - 이유: 일관된 UI
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: 접근성 고려

### Phase 3 성공 기준
- [ ] 모든 핵심 화면 구현
- [ ] 네비게이션 원활
- [ ] Redux 상태 정상
- [ ] iOS/Android 기본 테스트 통과

---

## Phase 4: 통합 및 테스트 (Week 11)

### 목표
- 전체 기능 통합
- 테스트 케이스 작성
- 버그 수정

### 작업 목록

#### 4.1 통합 테스트
1. **API 통합** (파일: `app/src/services/api.ts`)
   - 액션: 프론트엔드-백엔드 연결
   - 이유: 엔드투엔드 플로우
   - 의존성: 모든 API 완료
   - 리스크: Medium
   - WaterTime 노트: 에러 처리

2. **데이터 동기화** (파일: `app/src/services/sync.ts`)
   - 액션: 오프라인 데이터 동기화
   - 이유: 연결 끊김 대응
   - 의존성: WatermelonDB
   - 리스크: High
   - WaterTime 노트: 충돌 해결

#### 4.2 테스트
1. **단위 테스트** (파일: `**/*.test.ts`)
   - 액션: 컴포넌트, 서비스 테스트
   - 이유: 코드 품질 보장
   - 의존성: 없음
   - 리스크: Low
   - WaterTime 노트: 80% 커버리지 목표

2. **E2E 테스트** (파일: `e2e/`)
   - 액션: Detox 테스트 작성
   - 이유: 사용자 시나리오 검증
   - 의존성: 앱 빌드
   - 리스크: High
   - WaterTime 노트: 핵심 플로우만

### Phase 4 성공 기준
- [ ] 모든 테스트 통과
- [ ] 주요 버그 수정
- [ ] 성능 기준 충족
- [ ] 보안 검토 완료

---

## Phase 5: 배포 (Week 12)

### 목표
- 앱스토어 제출
- 백엔드 배포
- 런칭 준비

### 작업 목록

#### 5.1 앱 배포
1. **iOS 빌드** (파일: `app/ios/`)
   - 액션: TestFlight 베타 빌드
   - 이유: iOS 테스트
   - 의존성: 앱 완료
   - 리스크: High
   - WaterTime 노트: 애플 심사 가이드

2. **Android 빌드** (파일: `app/android/`)
   - 액션: Google Play 내부 테스트
   - 이유: Android 테스트
   - 의존성: 앱 완료
   - 리스크: Medium
   - WaterTime 노트: 플레이 스토어 정책

#### 5.2 백엔드 배포
1. **AWS 배포** (파일: `server/deploy/`)
   - 액션: ECS에 서버 배포
   - 이유: 프로덕션 환경
   - 의존성: 서버 완료
   - 리스크: High
   - WaterTime 노트: 오토스케일링

2. **모니터링** (파일: `server/monitoring/`)
   - 액션: DataDog, CloudWatch
   - 이유: 운영 가시성
   - 의존성: AWS 배포
   - 리스크: Medium
   - WaterTime 노트: 알림 임계값

### Phase 5 성공 기준
- [ ] TestFlight 베타 배포
- [ ] Google Play 내부 테스트
- [ ] 백엔드 프로덕션 배포
- [ ] 모니터링 활성화

---

## 🎯 MVP 성공 지표

### Month 3 목표
- **다운로드**: 30,000
- **MAU**: 15,000
- **유료 전환율**: 5%
- **앱스토어 평점**: 4.5+
- **30일 리텐션**: 25%

### 기술적 성공 기준
- **API 응답 시간**: < 200ms (p95)
- **앱 실행 시간**: < 3초
- **크래시률**: < 1%
- **알림 도달률**: > 95%

---

## ⚠️ 리스크 및 완화

### 기술적 리스크

| 리스크 | 확률 | 영향 | 완화 방안 |
|--------|------|------|----------|
| HealthKit/Google Fit API 변경 | Medium | High | 정기적 업데이트 확인 |
| 배터리 소모 과다 | High | High | 백그라운드 작업 최소화 |
| 알림 차단 | Medium | Medium | 사용자 교육, 정책 준수 |
| 오프라인 동기화 충돌 | Medium | Medium | WatermelonDB 충돌 해결 |

### 비즈니스 리스크

| 리스크 | 확률 | 영향 | 완화 방안 |
|--------|------|------|----------|
| 낮은 유료 전환율 | Medium | High | 프리미엄 기능 강화 |
| 경쟁 앱 진입 | Low | High | 틈새시장 집중 |
| 앱스토어 거절 | Low | Medium | 가이드라인 사전 확인 |

---

## 📅 마일스톤

| 마일스톤 | 목표일 | 상태 | 완료일 |
|---------|--------|------|--------|
| 기획 완료 | Week 2 | ✅ 완료 | 2026-02-15 |
| 인프라 구축 | Week 2 | ⏳ 대기 | - |
| 백엔드 MVP | Week 6 | ⏳ 대기 | - |
| 프론트엔드 MVP | Week 10 | ⏳ 대기 | - |
| 통합 테스트 | Week 11 | ⏳ 대기 | - |
| 앱스토어 제출 | Week 12 | ⏳ 대기 | - |
| 베타 런칭 | Week 13 | ⏳ 대기 | - |
| 정식 런칭 | Week 16 | ⏳ 대기 | - |

---

## 🚀 다음 단계

### 즉시 실행 (오늘)
1. [ ] Docker 서비스 시작: `npm run docker:up`
2. [ ] 의존성 설치: `npm install`
3. [ ] 데이터베이스 설정: `npm run db:setup`

### 이번 주
1. [ ] Prisma 스키마 작성
2. [ ] 초기 마이그레이션 실행
3. [ ] 회원가입 API 구현 시작

### 다음 주
1. [ ] 로그인 및 JWT 구현
2. [ ] 섭취량 기록 API
3. [ ] React Navigation 설정

---

## 📞 연락처 및 리소스

### 프로젝트 정보
- **프로젝트 리더**: jeongsk
- **저장소**: github.com/jeongsk/watertime
- **문서**: `/home/ubuntu/workspace-for-happy/watertime/`

### 개발 가이드
- `HARNESS_SETUP.md` - 개발 환경 설정
- `CLAUDE_CODE_GUIDE.md` - Claude Code 개발 가이드
- `OMC_INTEGRATION_GUIDE.md` - OMC 사용 가이드

### 기술 문서
- `docs/PRD.md` - 상세 기획서
- `docs/TECH_ARCHITECTURE.md` - 기술 아키텍처
- `docs/DEV_GUIDE.md` - 개발 가이드

---

**이 계획이 WaterTime 프로젝트의 성공적인 MVP 개발을 위한 로드맵입니다.**

각 Phase는 명확한 목표와 성공 기준을 가지고 있으며, 단계별로 진행하여 리스크를 최소화합니다.

---

**계획 승인이 필요합니다.**
- 계획이 마음에 드시면 "시작" 또는 "진행"이라고 말씀해주세요.
- 수정이 필요하면 부분을 알려주세요.
- 새로운 계획이 필요하면 "재시작"이라고 말씀해주세요.
