import ExpoModulesCore
import MapKit

private final class AddressAutocompleteException: Exception {
  init() {
    super.init(
      name: "AddressAutocompleteException",
      description: "Failed to fetch address suggestions.",
      code: "E_ADDRESS_AUTOCOMPLETE"
    )
  }
}

private final class AddressAutocompleteDelegate: NSObject, MKLocalSearchCompleterDelegate {
  var onResults: (([MKLocalSearchCompletion]) -> Void)?
  var onError: ((Error) -> Void)?
  private var hasCompleted = false

  func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
    guard !hasCompleted else {
      return
    }

    hasCompleted = true
    onResults?(completer.results)
  }

  func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
    guard !hasCompleted else {
      return
    }

    hasCompleted = true
    onError?(error)
  }
}

private final class AddressAutocompleteSession {
  let completer = MKLocalSearchCompleter()
  let delegate = AddressAutocompleteDelegate()
}

public final class CanilendarAddressAutocompleteModule: Module {
  private var sessions: [UUID: AddressAutocompleteSession] = [:]

  public func definition() -> ModuleDefinition {
    Name("CanilendarAddressAutocomplete")

    AsyncFunction("getSuggestions") { (query: String, promise: Promise) in
      let trimmedQuery = query.trimmingCharacters(in: .whitespacesAndNewlines)

      guard !trimmedQuery.isEmpty else {
        promise.resolve([])
        return
      }

      let sessionId = UUID()
      let session = AddressAutocompleteSession()

      session.completer.resultTypes = .address

      session.delegate.onResults = { [weak self] results in
        let mappedResults = self?.mapResults(results) ?? []
        self?.sessions.removeValue(forKey: sessionId)
        promise.resolve(mappedResults)
      }

      session.delegate.onError = { [weak self] error in
        self?.sessions.removeValue(forKey: sessionId)
        promise.reject(AddressAutocompleteException().causedBy(error))
      }

      session.completer.delegate = session.delegate
      sessions[sessionId] = session
      session.completer.queryFragment = trimmedQuery
    }
    .runOnQueue(.main)
  }

  private func mapResults(_ results: [MKLocalSearchCompletion]) -> [[String: String]] {
    var seenAddresses = Set<String>()

    return results.compactMap { completion in
      let title = completion.title.trimmingCharacters(in: .whitespacesAndNewlines)
      let subtitle = completion.subtitle.trimmingCharacters(in: .whitespacesAndNewlines)
      let address = [title, subtitle]
        .filter { !$0.isEmpty }
        .joined(separator: ", ")

      guard !address.isEmpty else {
        return nil
      }

      guard seenAddresses.insert(address).inserted else {
        return nil
      }

      return [
        "id": "\(title)|\(subtitle)",
        "title": title,
        "subtitle": subtitle,
        "address": address
      ]
    }
  }
}
