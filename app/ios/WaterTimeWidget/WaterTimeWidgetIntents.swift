import WidgetKit
import Intents

struct WaterTimeIntent: AppIntent {
  static var title: LocalizedStringResource = "Quick Add Water"
  static var description = IntentDescription("Quickly add water intake")

  @Parameter(title: "Amount (ml)")
  var amount: Int?

  static var parameterSummary: some ParameterSummary {
    Summary("Add \(\.$amount)ml of water")
  }

  func perform() async throws -> some IntentResult {
    // Save to shared UserDefaults
    let sharedDefaults = UserDefaults(suiteName: "group.com.watertimeapp")
    let currentAmount = sharedDefaults?.integer(forKey: "totalAmount") ?? 0
    let amountToAdd = amount ?? 250
    sharedDefaults?.set(currentAmount + amountToAdd, forKey: "totalAmount")

    // Request widget update
    WidgetCenter.shared.reloadAllTimelines()

    return .result()
  }
}
