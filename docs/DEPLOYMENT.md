# WaterTime - 배포 가이드

**버전**: 1.0
**작성일**: 2026-02-15
**작성자**: 자비스 (AI Assistant)

---

## 1. 배포 개요

### 1.1 배포 전략

**3단계 배포 프로세스**:
1. **Development** → 개발 및 테스트
2. **Staging** → 실제 환경 테스트
3. **Production** → 실서비스 운영

### 1.2 타임라인

```
Week 1-11: 개발
Week 12: 베타 테스트 (TestFlight / Play Console)
Week 13: 버그 수정
Week 14: 앱스토어 제출
Week 15: 리뷰 대기
Week 16: 정식 런칭
```

---

## 2. 앱스토어 준비

### 2.1 Apple App Store

#### 계정 설정
1. **Apple Developer Program 가입**
   - 비용: $99/년
   - URL: https://developer.apple.com/programs/

2. **필수 정보 준비**
   - 법인/개인 사업자 등록증
   - D-U-N-S 번호 (법인만)
   - 은행 계좌 정보 (수익 정산용)

#### 앱 정보 입력

**기본 정보**:
```
앱 이름: WaterTime - 물 마시기 알림
카테고리: 건강 및 피트니스
연령 등급: 4+
저작권: © 2026 Your Company
```

**스크린샷** (필수):
```
iPhone 6.7" (iPhone 14 Pro Max): 3장 이상
iPhone 6.5" (iPhone 11 Pro Max): 3장 이상
iPhone 5.5" (iPhone 8 Plus): 3장 이상

권장 크기: 1242 x 2688 px (세로)
파일 형식: PNG 또는 JPEG
```

**앱 미리보기** (선택):
```
최대 3개
길이: 15-30초
형식: MP4, MOV
```

**앱 설명**:
```
💧 WaterTime - 당신의 수분 코치

건강한 수분 섭취 습관을 만들어보세요!

✨ 주요 기능:
• 개인화된 일일 수분 섭취량 계산
• 스마트 알림으로 적절한 타이밍에 리마인드
• 직관적인 프로그레스 바로 달성 현황 확인
• 주간/월간 통계로 패턴 분석
• HealthKit 연동으로 건강 데이터 통합

🎯 이런 분들에게 추천해요:
• 물 마시는 걸 자주 깜빡하시는 분
• 건강한 습관을 만들고 싶은 분
• 운동 후 수분 섭취를 관리하고 싶은 분

📱 간편한 기록:
위젯, 애플워치, 음성 명령으로 1초만에 기록하세요!

프리미엄 기능:
• 무제한 히스토리
• AI 건강 인사이트
• 광고 제거

지금 시작하세요! 건강한 삶의 첫걸음 💪
```

**키워드**:
```
물,마시기,알림,수분,건강,습관,기록,다이어트,헬스,운동
```

**개인정보 처리방침 URL**:
```
https://watertime.com/privacy
```

#### 앱 리뷰 정보

**연락처**:
```
이름: 개발자 이름
이메일: support@watertime.com
전화: +82-10-1234-5678
```

**데모 계정** (필요 시):
```
이메일: demo@watertime.com
비밀번호: Demo123!
```

#### 심사 준비

**심사 노트**:
```
이 앱은 사용자의 수분 섭취를 기록하고 알림을 보내는 건강 관리 앱입니다.

테스트 방법:
1. 회원가입 후 로그인
2. 프로필 설정에서 체중/키 입력
3. 홈 화면에서 물 섭취 기록 (+ 버튼)
4. 설정에서 알림 활성화
5. 통계 탭에서 기록 확인

모든 기능이 정상 작동함을 확인했습니다.
```

### 2.2 Google Play Store

#### 계정 설정
1. **Google Play Developer 계정 생성**
   - 비용: $25 (일회성)
   - URL: https://play.google.com/console

2. **필수 정보**
   - 개발자 이름
   - 연락처 이메일
   - 웹사이트 (선택)

#### 앱 정보 입력

**기본 정보**:
```
앱 이름: WaterTime - 물 마시기 알림
패키지 이름: com.watertime.app
```

**스토어 등록정보**:

**앱 설명** (짧은 버전, 80자):
```
스마트한 수분 관리로 건강한 습관을 만드세요
```

**앱 설명** (긴 버전, 4000자):
```
💧 WaterTime - 당신의 수분 코치

건강한 수분 섭취 습관을 만들어보세요!

✨ 주요 기능:
• 개인화된 일일 수분 섭취량 계산
• 스마트 알림으로 적절한 타이밍에 리마인드
• 직관적인 프로그레스 바로 달성 현황 확인
• 주간/월간 통계로 패턴 분석
• Google Fit 연동으로 건강 데이터 통합

🎯 이런 분들에게 추천해요:
• 물 마시는 걸 자주 깜빡하시는 분
• 건강한 습관을 만들고 싶은 분
• 운동 후 수분 섭취를 관리하고 싶은 분

📱 간편한 기록:
위젯, 워치, 음성 명령으로 1초만에 기록하세요!

프리미엄 기능:
• 무제한 히스토리
• AI 건강 인사이트
• 광고 제거

지금 시작하세요! 건강한 삶의 첫걸음 💪
```

**스크린샷**:
```
휴대전화: 2-8장
7인치 태블릿: 2-8장
10인치 태블릿: 2-8장

권장 크기: 1080 x 1920 px (세로)
파일 형식: PNG 또는 JPEG
```

**기능 그래픽**:
```
크기: 1024 x 500 px
형식: PNG 또는 JPEG
```

**앱 아이콘**:
```
크기: 512 x 512 px
형식: PNG (32-bit)
```

**태그**:
```
건강, 피트니스, 라이프스타일, 생산성
```

**카테고리**:
```
주 카테고리: 건강 및 피트니스
보조 카테고리: 라이프스타일
```

**콘텐츠 등급**:
```
모든 연령대에 적합
```

**개인정보 처리방침 URL**:
```
https://watertime.com/privacy
```

---

## 3. iOS 배포

### 3.1 빌드 및 아카이브

#### 1. 인증서 및 프로비저닝 프로파일

**개발용**:
```bash
# Apple Developer 사이트에서 다운로드
Development Certificate
Development Provisioning Profile
```

**배포용**:
```bash
# App Store Distribution
Distribution Certificate
App Store Provisioning Profile
```

#### 2. Xcode 설정

**Bundle Identifier**:
```
com.watertime.app
```

**Version & Build**:
```
Version: 1.0.0
Build: 1
```

#### 3. 아카이브 생성

```bash
# 방법 1: Xcode GUI
# Product → Archive → Distribute App

# 방법 2: Command Line
xcodebuild -workspace WaterTime.xcworkspace \
  -scheme WaterTime \
  -archivePath build/WaterTime.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath build/WaterTime.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/
```

#### 4. App Store Connect 업로드

```bash
# Xcode Organizer
# 또는 Transporter 앱 사용

# Command Line
xcrun altool --upload-app \
  --type ios \
  --file "build/WaterTime.ipa" \
  --apiKey YOUR_API_KEY \
  --apiIssuer YOUR_ISSUER_ID
```

### 3.2 TestFlight 배포

#### 내부 테스터
```
최대 100명
즉시 배포 가능
```

#### 외부 테스터
```
최대 10,000명
Beta App Review 필요 (1-2일)
```

#### TestFlight 설정

**베타 앱 설명**:
```
WaterTime 베타 테스트에 참여해주셔서 감사합니다!

테스트 포인트:
1. 회원가입/로그인 프로세스
2. 물 섭취 기록 기능
3. 알림 시스템
4. 통계 정확성

문제 발견 시 watertime@testflight.com으로 제보해주세요.
```

**무엇이 새로운지**:
```
Version 1.0.0 (Build 1)
- 초기 베타 버전
- 기본 물 섭취 기록
- 알림 기능
- 일일 통계
```

---

## 4. Android 배포

### 4.1 서명된 APK/AAB 생성

#### 1. 키스토어 생성

```bash
keytool -genkeypair -v \
  -alias watertime \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -keystore watertime-release.keystore

# 비밀번호 안전하게 보관!
```

#### 2. gradle.properties 설정

```properties
WATERTIME_RELEASE_STORE_FILE=watertime-release.keystore
WATERTIME_RELEASE_KEY_ALIAS=watertime
WATERTIME_RELEASE_STORE_PASSWORD=********
WATERTIME_RELEASE_KEY_PASSWORD=********
```

#### 3. build.gradle 설정

```gradle
android {
    signingConfigs {
        release {
            storeFile file(WATERTIME_RELEASE_STORE_FILE)
            storePassword WATERTIME_RELEASE_STORE_PASSWORD
            keyAlias WATERTIME_RELEASE_KEY_ALIAS
            keyPassword WATERTIME_RELEASE_KEY_PASSWORD
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 4. AAB (Android App Bundle) 생성

```bash
cd android
./gradlew bundleRelease

# 생성된 파일 위치
# android/app/build/outputs/bundle/release/app-release.aab
```

#### 5. APK 생성 (테스트용)

```bash
./gradlew assembleRelease

# 생성된 파일 위치
# android/app/build/outputs/apk/release/app-release.apk
```

### 4.2 Google Play Console 업로드

#### 1. 앱 번들 업로드

```
Google Play Console → 앱 → 프로덕션 → 새 버전 만들기
→ 앱 번들 업로드 → app-release.aab 선택
```

#### 2. 출시 노트 작성

**한국어**:
```
버전 1.0.0 (2026-02-15)

🎉 첫 출시!

새로운 기능:
• 개인화된 수분 섭취량 계산
• 스마트 알림
• 직관적인 기록 시스템
• 주간/월간 통계

감사합니다! 💧
```

**영어**:
```
Version 1.0.0 (2026-02-15)

🎉 Initial Release!

New Features:
• Personalized daily water intake calculation
• Smart reminders
• Intuitive tracking system
• Weekly/Monthly statistics

Thank you! 💧
```

#### 3. 출시 준비

**검토 체크리스트**:
- [ ] 콘텐츠 등급 설문 완료
- [ ] 타겟 오디언스 설정
- [ ] 개인정보 처리방침 URL 추가
- [ ] 앱 액세스 권한 설명
- [ ] 광고 ID 선언

---

## 5. 백엔드 배포

### 5.1 AWS 배포 (권장)

#### 1. ECS Fargate 설정

**task-definition.json**:
```json
{
  "family": "watertime-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "watertime-api",
      "image": "your-ecr-repo/watertime-api:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/watertime-api",
          "awslogs-region": "ap-northeast-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 2. RDS PostgreSQL 설정

```bash
# PostgreSQL 인스턴스 생성
aws rds create-db-instance \
  --db-instance-identifier watertime-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15 \
  --master-username admin \
  --master-user-password yourpassword \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxx
```

#### 3. ElastiCache Redis 설정

```bash
# Redis 클러스터 생성
aws elasticache create-cache-cluster \
  --cache-cluster-id watertime-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

#### 4. 로드 밸런서 설정

```bash
# Application Load Balancer 생성
aws elbv2 create-load-balancer \
  --name watertime-alb \
  --subnets subnet-xxxx subnet-yyyy \
  --security-groups sg-xxxxxx

# 타겟 그룹 생성
aws elbv2 create-target-group \
  --name watertime-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxxx \
  --target-type ip
```

### 5.2 CI/CD 파이프라인

**GitHub Actions 워크플로우**:

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
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: watertime-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition.json
          service: watertime-api-service
          cluster: watertime-cluster
          wait-for-service-stability: true
```

---

## 6. 모니터링 설정

### 6.1 로깅

**CloudWatch Logs**:
```typescript
// Winston + CloudWatch
import winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new CloudWatchTransport({
      logGroupName: '/ecs/watertime-api',
      logStreamName: 'api-logs',
      awsRegion: 'ap-northeast-2'
    })
  ]
});
```

### 6.2 알림

**AWS SNS 알림**:
```typescript
import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export const sendAlert = async (message: string) => {
  await sns.publish({
    TopicArn: 'arn:aws:sns:region:account:watertime-alerts',
    Message: message,
    Subject: 'WaterTime Alert'
  }).promise();
};
```

### 6.3 성능 모니터링

**DataDog 설정**:
```bash
npm install dd-trace

# app.ts
import ddTrace from 'dd-trace';

ddTrace.init({
  service: 'watertime-api',
  env: 'production'
});
```

---

## 7. 배포 후 체크리스트

### 7.1 기능 검증

**필수 확인사항**:
- [ ] 회원가입/로그인 정상 작동
- [ ] 물 섭취 기록 저장됨
- [ ] 알림 정상 발송
- [ ] 통계 데이터 정확
- [ ] 결제 시스템 작동 (프리미엄)
- [ ] HealthKit/Google Fit 연동

### 7.2 성능 검증

**목표 지표**:
- [ ] API 응답 시간 < 500ms
- [ ] 앱 실행 시간 < 2초
- [ ] 에러율 < 1%
- [ ] 가용성 > 99.5%

### 7.3 보안 검증

**확인사항**:
- [ ] HTTPS 적용
- [ ] 인증 시스템 정상
- [ ] Rate limiting 작동
- [ ] 데이터 암호화 확인

---

## 8. 롤백 계획

### 8.1 앱 롤백

**iOS**:
```
App Store Connect → 앱 → 활동 → 이전 버전
→ 프로덕션에서 제거 → 이전 버전으로 롤백
```

**Android**:
```
Play Console → 출시 관리 → 프로덕션 → 롤백
```

### 8.2 백엔드 롤백

```bash
# ECS 서비스를 이전 태스크 정의로 업데이트
aws ecs update-service \
  --cluster watertime-cluster \
  --service watertime-api-service \
  --task-definition watertime-api:PREVIOUS_VERSION
```

---

## 9. 배포 일정

### 9.1 상세 일정

| 주차 | 작업 내용 | 담당자 | 상태 |
|------|----------|--------|------|
| Week 1-11 | 개발 완료 | 개발팀 | 진행중 |
| Week 12 | 베타 테스트 | QA팀 | 대기 |
| Week 13 | 버그 수정 | 개발팀 | 대기 |
| Week 14 | 앱스토어 제출 | PM | 대기 |
| Week 15 | 리뷰 대기 | - | 대기 |
| Week 16 | 정식 런칭 | 전체 | 대기 |

### 9.2 런칭 당일 체크리스트

**D-Day**:
- [ ] 오전 9시: 최종 기능 확인
- [ ] 오전 10시: 앱스토어 라이브 전환
- [ ] 오전 11시: 모니터링 시작
- [ ] 오후 2시: 1차 성능 체크
- [ ] 오후 5시: 사용자 피드백 확인
- [ ] 오후 8시: 일일 리포트 작성

---

## 10. 변경 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-02-15 | 자비스 | 초기 작성 |

---

**다음 단계**: 마케팅 플랜 작성 → 실행
