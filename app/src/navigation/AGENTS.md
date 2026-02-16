<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-16 | Updated: 2026-02-16 -->

# navigation

## Purpose
React Navigation 설정과 화면 전환 로직이 포함된 디렉토리입니다.

## Key Files

| File | Description |
|------|-------------|
| `AppNavigator.tsx` | 메인 네비게이터 설정 |

## For AI Agents

### Working In This Directory
- **React Navigation v7** 사용
- Stack Navigator와 Tab Navigator 조합
- 인증 상태에 따른 조건부 렌더링

### Common Patterns
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // 인증된 화면들
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // 인증되지 않은 화면들
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Dependencies

### External
- React Navigation 7.x
- React Native Screens
- React Native Safe Area Context

<!-- MANUAL: 네비게이션 관련 특별한 사항을 아래에 추가하세요 -->
