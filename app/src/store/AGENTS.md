<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# store

## Purpose
Redux Toolkit을 사용한 앱 상태 관리가 포함된 디렉토리입니다. 인증, 사용자, 수분 섭취 등의 상태를 관리합니다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | Redux store 설정 및 루트 리듀서 |
| `authSlice.ts` | 인증 상태 (로그인, 토큰) |
| `userSlice.ts` | 사용자 정보 상태 |
| `intakeSlice.ts` | 수분 섭취 상태 |

## For AI Agents

### Working In This Directory
- **Redux Toolkit** 사용 (createSlice, createAsyncThunk)
- **Redux Persist**로 영구 저장
- 비동기 작업은 createAsyncThunk 사용

### Common Patterns
```typescript
// Slice 생성
const sliceName = createSlice({
  name: 'sliceName',
  initialState,
  reducers: {
    // 동기 리듀서
  },
  extraReducers: (builder) => {
    // 비동기 리듀서
  },
});

// Async Thunk
export const asyncAction = createAsyncThunk(
  'sliceName/asyncAction',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiCall(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Dependencies

### Internal
- `../services/` - API 호출

### External
- Redux Toolkit 2.11.2
- Redux Persist 6.0.0

<!-- MANUAL: 상태 관리 관련 특별한 사항을 아래에 추가하세요 -->
