<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# scripts

## Purpose
프로젝트 빌드, 배포, 개발 환경 설정 등의 자동화 스크립트를 포함하는 디렉토리입니다.

## Key Files

| File | Description |
|------|-------------|
| `setup-dev.sh` | 개발 환경 초기 설정 스크립트 |

## For AI Agents

### Working In This Directory
- 스크립트는 Bash shell로 작성됩니다
- 실행 권한이 필요합니다: `chmod +x <script>.sh`
- 오류 처리와 로깅을 포함해야 합니다

### Common Patterns
- **Shebang**: `#!/bin/bash` 또는 `#!/usr/bin/env bash`
- **오류 처리**: `set -e` (오류 시 종료)
- **로그**: echo 또는 logger 사용

## Scripts Usage

```bash
# 개발 환경 설정
./scripts/setup-dev.sh
```

<!-- MANUAL: 스크립트 관련 특별한 사항을 아래에 추가하세요 -->
