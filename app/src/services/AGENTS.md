<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# services

## Purpose
API 호출과 비즈니스 로직을 담당하는 서비스 레이어입니다. 백엔드 API와의 통신을 Axios를 통해 처리합니다.

## Key Files

| File | Description |
|------|-------------|
| `api.ts` | Axios 인스턴스 및 인터셉터 설정 |
| `authService.ts` | 인증 관련 API 호출 |
| `userService.ts` | 사용자 관련 API 호출 |
| `intakeService.ts` | 수분 섭취 관련 API 호출 |
| `notificationService.ts` | 알림 관련 API 호출 |

## For AI Agents

### Working In This Directory
- **API 기본 URL**: `api.ts`에서 설정
- **인증 토큰**: AsyncStorage에서 자동 주입
- **에러 처리**: try-catch와 통일된 에러 형식

### Common Patterns
```typescript
// api.ts - Axios 인스턴스
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// 인터셉터로 토큰 자동 주입
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 서비스 함수 예시
export const fetchData = async (params: Params) => {
  const response = await api.get('/endpoint', { params });
  return response.data;
};
```

## Dependencies

### Internal
- 백엔드 API (http://localhost:3000)

### External
- Axios 1.13.5
- AsyncStorage - 토큰 저장소

<!-- MANUAL: 서비스 관련 특별한 사항을 아래에 추가하세요 -->
