import Foundation
import WidgetKit
#if canImport(React)
import React
#endif

@objc(WaterTimeWidgetModule)
class WaterTimeWidgetModule: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func updateWidget(_ totalAmount: NSInteger, goal: NSInteger, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      // Save to shared UserDefaults (App Group)
      if let sharedDefaults = UserDefaults(suiteName: "group.com.watertimeapp") {
        sharedDefaults.set(totalAmount, forKey: "totalAmount")
        sharedDefaults.set(goal, forKey: "goal")

        // Request widget update
        WidgetCenter.shared.reloadAllTimelines()

        resolver(["success": true])
      } else {
        rejecter("WIDGET_ERROR", "Failed to access shared defaults", nil)
      }
    }
  }

  @objc
  func clearWidgetData(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let sharedDefaults = UserDefaults(suiteName: "group.com.watertimeapp") {
        sharedDefaults.set(0, forKey: "totalAmount")
        sharedDefaults.set(2000, forKey: "goal")

        // Request widget update
        WidgetCenter.shared.reloadAllTimelines()

        resolver(["success": true])
      } else {
        rejecter("WIDGET_ERROR", "Failed to access shared defaults", nil)
      }
    }
  }
}
