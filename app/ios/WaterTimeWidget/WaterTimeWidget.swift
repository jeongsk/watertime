import WidgetKit
import SwiftUI

struct WaterTimeEntry: TimelineEntry {
  let date: Date
  let totalAmount: Int
  let goal: Int
  let percentage: Int
  let remaining: Int

  static let placeholder = WaterTimeEntry(
    date: Date(),
    totalAmount: 1250,
    goal: 2000,
    percentage: 62,
    remaining: 750
  )
}

struct WaterTimeProvider: TimelineProvider {
  func placeholder(in context: Context) -> WaterTimeEntry {
    WaterTimeEntry.placeholder
  }

  func getSnapshot(in context: Context, completion: @escaping (WaterTimeEntry) -> Void) {
    let entry = loadEntry()
    completion(entry)
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
    let entry = loadEntry()

    // Update every 15 minutes
    let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
    let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))

    completion(timeline)
  }

  private func loadEntry() -> WaterTimeEntry {
    let sharedDefaults = UserDefaults(suiteName: "group.com.watertimeapp")
    let totalAmount = sharedDefaults?.integer(forKey: "totalAmount") ?? 0
    let goal = sharedDefaults?.integer(forKey: "goal") ?? 2000
    let percentage = goal > 0 ? Int((Double(totalAmount) / Double(goal)) * 100) : 0
    let remaining = max(0, goal - totalAmount)

    return WaterTimeEntry(
      date: Date(),
      totalAmount: totalAmount,
      goal: goal,
      percentage: percentage,
      remaining: remaining
    )
  }
}

struct SmallWidgetView: View {
  let entry: WaterTimeEntry

  var body: some View {
    VStack(spacing: 4) {
      Image(systemName: "drop.fill")
        .font(.system(size: 24))
        .foregroundColor(.blue)

      Text("\(entry.totalAmount)")
        .font(.system(size: 32, weight: .bold))
        .foregroundColor(.primary)

      Text("/ \(entry.goal)ml")
        .font(.caption2)
        .foregroundColor(.secondary)

      ProgressView(value: Double(entry.percentage) / 100.0)
        .progressViewStyle(LinearProgressViewStyle(tint: .blue))
        .frame(height: 4)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(
      LinearGradient(
        gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.blue.opacity(0.05)]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
  }
}

struct MediumWidgetView: View {
  let entry: WaterTimeEntry

  var body: some View {
    HStack(spacing: 16) {
      VStack(alignment: .leading, spacing: 8) {
        Image(systemName: "drop.fill")
          .font(.system(size: 28))
          .foregroundColor(.blue)

        Text("Water Time")
          .font(.headline)
          .foregroundColor(.primary)

        Text("\(entry.remaining)ml left")
          .font(.subheadline)
          .foregroundColor(.secondary)
      }

      Spacer()

      VStack(alignment: .trailing, spacing: 8) {
        Text("\(entry.totalAmount)ml")
          .font(.system(size: 36, weight: .bold))
          .foregroundColor(.primary)

        Text("\(entry.percentage)%")
          .font(.title3)
          .fontWeight(.semibold)
          .foregroundColor(entry.percentage >= 100 ? .green : .blue)

        ZStack(alignment: .leading) {
          RoundedRectangle(cornerRadius: 8)
            .fill(Color.gray.opacity(0.2))
            .frame(height: 12)

          RoundedRectangle(cornerRadius: 8)
            .fill(
              LinearGradient(
                gradient: Gradient(colors: [.blue, .cyan]),
                startPoint: .leading,
                endPoint: .trailing
              )
            )
            .frame(width: CGFloat(entry.percentage) / 100.0 * 100, height: 12)
        }
        .frame(width: 120)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .padding()
    .background(
      LinearGradient(
        gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.blue.opacity(0.05)]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
  }
}

struct LargeWidgetView: View {
  let entry: WaterTimeEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack {
        Image(systemName: "drop.fill")
          .font(.system(size: 32))
          .foregroundColor(.blue)

        Text("Water Time")
          .font(.title2)
          .fontWeight(.bold)
          .foregroundColor(.primary)

        Spacer()
      }

      HStack(spacing: 32) {
        VStack(alignment: .leading, spacing: 8) {
          Text("Today's Intake")
            .font(.caption)
            .foregroundColor(.secondary)

          Text("\(entry.totalAmount)ml")
            .font(.system(size: 48, weight: .bold))
            .foregroundColor(.primary)
        }

        VStack(alignment: .leading, spacing: 8) {
          Text("Daily Goal")
            .font(.caption)
            .foregroundColor(.secondary)

          Text("\(entry.goal)ml")
            .font(.system(size: 48, weight: .bold))
            .foregroundColor(.secondary)
        }

        Spacer()

        VStack(alignment: .trailing, spacing: 8) {
          Text("Progress")
            .font(.caption)
            .foregroundColor(.secondary)

          Text("\(entry.percentage)%")
            .font(.system(size: 48, weight: .bold))
            .foregroundColor(entry.percentage >= 100 ? .green : .blue)
        }
      }

      VStack(alignment: .leading, spacing: 8) {
        HStack {
          Text("Goal Progress")
            .font(.subheadline)
            .foregroundColor(.secondary)

          Spacer()

          Text("\(entry.remaining)ml remaining")
            .font(.subheadline)
            .foregroundColor(.secondary)
        }

        ZStack(alignment: .leading) {
          RoundedRectangle(cornerRadius: 10)
            .fill(Color.gray.opacity(0.2))
            .frame(height: 16)

          RoundedRectangle(cornerRadius: 10)
            .fill(
              LinearGradient(
                gradient: Gradient(colors: [.blue, .cyan]),
                startPoint: .leading,
                endPoint: .trailing
              )
            )
            .frame(width: CGFloat(entry.percentage) / 100.0 * (UIScreen.main.bounds.width - 64), height: 16)
        }
      }

      if entry.percentage < 100 {
        HStack {
          Image(systemName: "lightbulb.fill")
            .foregroundColor(.orange)
          Text("Keep drinking! You're doing great!")
            .font(.caption)
            .foregroundColor(.secondary)
          Spacer()
        }
      } else {
        HStack {
          Image(systemName: "star.fill")
            .foregroundColor(.yellow)
          Text("Goal achieved! Excellent work!")
            .font(.caption)
            .foregroundColor(.green)
          Spacer()
        }
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .padding()
    .background(
      LinearGradient(
        gradient: Gradient(colors: [Color.blue.opacity(0.1), Color.blue.opacity(0.05)]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
      )
    )
  }
}

struct WaterTimeWidget: Widget {
  let kind: String = "WaterTimeWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WaterTimeProvider()) { entry in
      if #available(iOS 16.0, *) {
        VStack(spacing: 0) {
          switch entry.family {
          case .systemSmall:
            SmallWidgetView(entry: entry)
          case .systemMedium:
            MediumWidgetView(entry: entry)
          case .systemLarge:
            LargeWidgetView(entry: entry)
          default:
            MediumWidgetView(entry: entry)
          }
        }
      } else {
        MediumWidgetView(entry: entry)
      }
    }
    .configurationDisplayName("Water Time")
    .description("Track your daily water intake")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
  }
}

@main
struct WaterTimeWidgetBundle: WidgetBundle {
  var body: some Widget {
    WaterTimeWidget()
  }
}
