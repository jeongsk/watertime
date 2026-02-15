# WaterTime Widget Quick Reference

## Files Created

### iOS Widget Extension
```
app/ios/WaterTimeWidget/
├── WaterTimeWidget.swift           # Main widget provider with 3 sizes (Small/Medium/Large)
├── WaterTimeWidgetIntents.swift    # Quick add intent for iOS 16+
├── Info.plist                      # Widget configuration
└── WaterTimeWidget.entitlements    # App Group permissions

app/ios/WaterTimeApp/
├── WaterTimeApp.entitlements       # Main app App Group configuration
├── WaterTimeWidgetModule.swift     # Native module for widget updates
└── WaterTimeWidgetPackage.m        # React Native bridge
```

### Android Widget
```
app/android/app/src/main/
├── java/com/watertime/widget/
│   ├── WaterTimeWidgetProvider.java        # Main widget provider
│   ├── WaterTimeWidgetUpdateService.java   # Background update service
│   ├── WaterTimeWidgetModule.java          # Native module
│   └── WaterTimeWidgetPackage.java         # React Native package
├── res/layout/
│   ├── widget_water_small.xml              # 2x2 widget layout
│   └── widget_water_medium.xml             # 4x2 widget layout
├── res/drawable/
│   ├── widget_background.xml               # Gradient background
│   └── ic_widget_preview.xml               # Preview icon
└── res/xml/
    └── widget_info.xml                     # Widget metadata
```

### React Native Integration
```
app/src/
├── native/
│   └── WaterTimeWidgetModule.ts            # TypeScript native module interface
├── utils/
│   └── WidgetDataManager.ts                # Widget data synchronization
└── store/
    └── intakeSlice.ts                      # Redux integration (modified)
```

## Key Features Implemented

### iOS Widget
- Three sizes: Small, Medium, Large
- Real-time progress bar
- Water drop icon
- Gradient blue theme
- Goal percentage display
- 15-minute auto-refresh
- App Group data sharing

### Android Widget
- Resizable widget (2x2, 4x2)
- Quick add button (+250ml)
- Progress bar with color coding
- Water emoji icon
- SharedPreferences data sharing
- 15-minute update period
- PendingIntent for app launch

### Data Synchronization
- Native module for cross-platform communication
- Redux integration for automatic widget updates
- Shared storage (UserDefaults/App Groups for iOS, SharedPreferences for Android)
- Automatic refresh when adding water intake

## Next Steps for Development

### 1. Xcode Manual Setup Required
```bash
cd app/ios
pod install
open WaterTimeApp.xcodeproj
```

In Xcode:
1. File > New > Target > Widget Extension
2. Name: WaterTimeWidget
3. Add App Group capability to both targets
4. Add existing widget files to the project

### 2. Android Build
```bash
cd app/android
./gradlew clean
./gradlew assembleDebug
./gradlew installDebug
```

### 3. Testing
- Add widget to home screen (iOS & Android)
- Add water intake from app
- Verify widget updates
- Test quick add button (Android)

## Important Notes

### App Group Configuration
- iOS: `group.com.watertimeapp`
- Both app and widget must have same App Group
- Required for data sharing between app and widget

### Native Module Registration
- Android: Added to `MainApplication.kt`
- iOS: Added to `AppDelegate.swift` via `additionalModules()`

### Widget Update Triggers
1. User adds water in app (immediate)
2. User taps quick add button on widget (Android)
3. Periodic refresh (every 15 minutes)
4. Manual refresh (pull down on home screen)

### Data Storage
- **iOS**: UserDefaults with App Group suite
- **Android**: SharedPreferences with "WaterTimeWidget" name
- **Keys**: `totalAmount`, `goal`

## Troubleshooting

### Widget not showing on iOS
- Ensure widget extension is added in Xcode
- Verify App Group is enabled
- Clean build folder (Cmd+Shift+K)
- Rebuild and reinstall

### Widget not updating on Android
- Check AndroidManifest.xml for widget registration
- Verify SharedPreferences keys match
- Check native module is registered in MainApplication.kt
- Clear app data and reinstall

### Build errors
- iOS: Run `pod install` again
- Android: Run `./gradlew clean`
- Check bundle identifiers match entitlements

## Documentation
Full setup guide: `WIDGET_SETUP.md`
