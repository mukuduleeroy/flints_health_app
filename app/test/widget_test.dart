import 'package:flutter_test/flutter_test.dart';

import 'package:app/src/app.dart';
import 'package:app/src/app_controller.dart';

void main() {
  testWidgets('shows the Flints welcome flow', (WidgetTester tester) async {
    await tester.pumpWidget(FlintsApp(controller: FlintsAppController()));

    expect(find.text('Welcome to Flints'), findsOneWidget);
    expect(find.text('Continue anonymously'), findsOneWidget);
  });
}
