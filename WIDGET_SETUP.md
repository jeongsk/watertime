# WaterTime Widget Setup Guide

This guide explains how to set up and use WaterTime widgets on iOS and Android platforms.

## Overview

WaterTime widgets allow users to:
- View their daily water intake at a glance
- See progress towards their daily goal
- Quickly add water intake (+250ml) from the home screen
- Track goal completion with visual progress bars

## Features

### iOS Widget (iOS 14+)
- Three sizes: Small, Medium, Large
- Real-time data sync via App Groups
- Auto-refresh every 15 minutes
- Beautiful gradient backgrounds
- Progress visualization

### Android Widget (Android 5+)
- Resizable widget (2x2, 4x2)
- Quick add button (+250ml)
- Progress bar with color changes
- Data sync via SharedPreferences
- 15-minute auto-refresh interval

## Setup Instructions

### iOS Setup

#### 1. Add Widget Extension in Xcode

The widget extension has been created at:
```
app/ios/WaterTimeWidget/
```

**Manual Setup Required:**

1. Open `app/ios/WaterTimeApp.xcodeproj` in Xcode
2. Go to **File > New > Target**
3. Select **Widget Extension**
4. Name it `WaterTimeWidget`
5. Make sure **"Include Configuration Intent"** is **unchecked**
6. Click **Finish**

#### 2. Configure App Group

1. Select the main app target (WaterTimeApp)
2. Go to **Signing & Capabilities**
3. Click **+ Capability** and add **App Groups**
4. Create a new App Group: `group.com.watertimeapp`
5. Repeat for the widget extension target

#### 3. Update Entitlements

Both the app and widget should have the same App Group in their entitlements:
- `app/ios/WaterTimeApp/WaterTimeApp.entitlements`
- `app/ios/WaterTimeWidget/WaterTimeWidget.entitlements`

#### 4. Add Widget Files to Xcode Project

In Xcode:
1. Right-click on the `WaterTimeWidget` folder in the project navigator
2. Select **Add Files to "WaterTimeApp"**
3. Add the following files:
   - `WaterTimeWidget.swift`
   - `WaterTimeWidgetIntents.swift`
   - `Info.plist`
   - `WaterTimeWidget.entitlements`

#### 5. Build and Run

```bash
cd app/ios
pod install
```

Then build and run the app from Xcode.

### Android Setup

The Android widget is already configured in:
```
app/android/app/src/main/java/com/watertime/widget/
```

#### 1. Build the App

```bash
cd app/android
./gradlew clean
./gradlew assembleDebug
```

#### 2. Install the APK

```bash
./gradlew installDebug
```

#### 3. Add Widget to Home Screen

1. Long-press on an empty space on your home screen
2. Select **Widgets**
3. Find and tap **WaterTime**
4. Drag the widget to your desired location
5. Resize as needed (Android 12+)

## Widget Files Structure

### iOS Files
```
app/ios/
├── WaterTimeApp/
│   ├── WaterTimeApp.entitlements    # App Group configuration
│   ├── WaterTimeWidgetModule.swift  # Native module for widget updates
│   └── WaterTimeWidgetPackage.m     # React Native bridge
└── WaterTimeWidget/
    ├── WaterTimeWidget.swift         # Widget provider and UI
    ├── WaterTimeWidgetIntents.swift  # Quick add intent
    ├── Info.plist                    # Widget configuration
    └── WaterTimeWidget.entitlements  # App Group configuration
```

### Android Files
```
app/android/app/src/main/
├── java/com/watertime/
│   └── widget/
│       ├── WaterTimeWidgetProvider.java    # Widget provider
│       ├── WaterTimeWidgetUpdateService.java # Update service
│       ├── WaterTimeWidgetModule.java      # Native module
│       └── WaterTimeWidgetPackage.java     # React Native package
├── res/
│   ├── layout/
│   │   ├── widget_water_small.xml   # Small widget layout
│   │   └── widget_water_medium.xml  # Medium widget layout
│   ├── drawable/
│   │   ├── widget_background.xml    # Gradient background
│   │   └── ic_widget_preview.xml    # Widget preview icon
│   ├── xml/
│   │   └── widget_info.xml          # Widget metadata
│   └── values/
│       └── strings.xml              # Widget description
└── AndroidManifest.xml              # Widget registration
```

## Usage

### Adding Water Intake

#### From the App
1. Open WaterTime app
2. Tap the + button to add water
3. The widget updates automatically

#### From the Widget (Quick Add)
- **Android**: Tap the +250ml button on the widget
- **iOS**: Long-press the widget and select "Quick Add" (iOS 16+)

### Data Sync

The widget automatically syncs with the app:
- **Immediate**: When you add water in the app
- **Periodic**: Every 15 minutes
- **Manual**: Pull down on home screen to refresh

### Customization

#### Change Goal Amount
The widget reads the goal from the app settings. Update your daily goal in:
```
app > Profile Screen > Set Daily Goal
```

#### Widget Refresh Rate
- **iOS**: Set in `WaterTimeWidget.swift` (line 100)
  ```swift
  let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
  ```

- **Android**: Set in `widget_info.xml`
  ```xml
  android:updatePeriodMillis="900000"  <!-- 15 minutes -->
  ```

## Native Module Integration

The widget uses a native module to communicate with React Native:

### TypeScript Interface
```typescript
// app/src/native/WaterTimeWidgetModule.ts
interface WaterTimeWidgetInterface {
  updateWidget(totalAmount: number, goal: number): Promise<void>;
  clearWidgetData(): Promise<void>;
}
```

### Usage in Redux
```typescript
// app/src/store/intakeSlice.ts
import WidgetDataManager from '../utils/WidgetDataManager';

// When adding intake
WidgetDataManager.updateWidgetData(summary);
```

## Troubleshooting

### Widget Not Updating

#### iOS
1. Verify App Group is enabled in both targets
2. Check Bundle Identifier matches entitlements
3. Reinstall the app from Xcode (clean build)

#### Android
1. Check SharedPreferences permissions
2. Verify widget is registered in AndroidManifest.xml
3. Clear app data and reinstall

### Widget Shows "0"

1. Add water intake from the app first
2. Wait 15 minutes for auto-refresh
3. Force refresh by pulling down on home screen
4. Check React Native logs for native module errors

### Build Errors

#### iOS
```bash
cd app/ios
pod deintegrate
pod install
```

#### Android
```bash
cd app/android
./gradlew clean
./gradlew assembleDebug
```

### Xcode Widget Target Issues

If the widget target doesn't appear:
1. Close Xcode
2. Delete `app/ios/Pods` folder
3. Run `pod install` again
4. Reopen Xcode project

## Testing

### iOS Simulator
1. Long-press on home screen
2. Tap the + button in top-left
3. Search for "WaterTime"
4. Add desired widget size

### Android Emulator
1. Long-press on home screen
2. Select "Widgets"
3. Find "WaterTime" in the list
4. Drag to home screen

## Future Enhancements

Potential improvements:
- [ ] Multiple quick-add options (125ml, 250ml, 500ml)
- [ ] Weekly stats widget
- [ ] Streak counter
- [ ] Hydration reminders
- [ ] Dark mode support
- [ ] Customizable colors
- [ ] Widget configuration (amount presets)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Xcode/Android Studio logs
3. Verify App Groups/SharedPreferences configuration
4. Ensure native module is properly registered

## Technical Details

### Data Flow

```
React Native App
    ↓
Redux Action (addIntake)
    ↓
WidgetDataManager.updateWidgetData()
    ↓
Native Module (WaterTimeWidgetModule)
    ↓
Shared Storage (UserDefaults/SharedPreferences)
    ↓
Widget Provider reads data
    ↓
Widget UI updates
```

### Storage Keys

#### iOS (App Group UserDefaults)
- `totalAmount`: Current water intake
- `goal`: Daily goal amount

#### Android (SharedPreferences)
- `totalAmount`: Current water intake
- `goal`: Daily goal amount

## Version History

- **v1.0** (2025-02-15): Initial widget implementation
  - iOS Widget Extension
  - Android AppWidgetProvider
  - Native module integration
  - Data synchronization
