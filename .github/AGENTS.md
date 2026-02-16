<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# .github

## Purpose
GitHub Actions 워크플로우와 기타 GitHub 관련 설정 파일을 포함하는 디렉토리입니다. CI/CD 파이프라인이 자동화되어 있습니다.

## Key Files

| File | Description |
|------|-------------|
| `.github/workflows/build-ios.yml` | iOS 빌드 워크플로우 |
| `.github/workflows/build-android.yml` | Android 빌드 워크플로우 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `workflows/` | GitHub Actions 워크플로우 파일 |

## For AI Agents

### Working In This Directory
- 워크플로우는 YAML 형식으로 작성됩니다
- GitHub Actions 문법을 따릅니다
- 비밀 정보는 Secrets를 사용해야 합니다

### Common Patterns
- **트리거**: push, pull_request, manual
- **작업**: checkout, setup Node.js, install, build, test
- **아티팩트**: 빌드 결과 저장

## Workflows

### iOS Build
- macOS 러너 사용
- Xcode 버전: 최신 안정版
- 출력: .ipa 파일

### Android Build
- Ubuntu 러너 사용
- Gradle 빌드
- 출력: .apk 파일

<!-- MANUAL: 워크플로우 관련 특별한 사항을 아래에 추가하세요 -->
