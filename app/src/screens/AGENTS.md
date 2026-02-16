<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# screens

## Purpose
앱의 주요 화면들이 포함된 디렉토리입니다. 각 화면은 사용자 인터페이스와 상호작용을 담당합니다.

## Key Files

| File | Description |
|------|-------------|
| `HomeScreen.tsx` | 메인 화면 - 수분 섭취량 표시 |
| `ProfileScreen.tsx` | 사용자 프로필 관리 |
| `StatsScreen.tsx` | 통계 및 차트 화면 |
| `LoginScreen.tsx` | 로그인 화면 |
| `RegisterScreen.tsx` | 회원가입 화면 |
| `NotificationSettingsScreen.tsx` | 알림 설정 화면 |

## For AI Agents

### Working In This Directory
- 각 화면은 독립적인 컴포넌트
- Redux store와 연동하여 상태 관리
- 네비게이션 props 받음

### Common Patterns
```typescript
interface Props {
  navigation: StackNavigationProp<...>;
  route: RouteProp<...>;
}

export default function ScreenName({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  // ... 화면 로직

  return (
    <View>
      {/* 화면 내용 */}
    </View>
  );
}
```

## Dependencies

### Internal
- `../store/` - Redux 상태
- `../services/` - API 호출
- `../components/` - 재사용 컴포넌트

### External
- React Navigation
- Redux Toolkit

<!-- MANUAL: 화면 관련 특별한 사항을 아래에 추가하세요 -->
