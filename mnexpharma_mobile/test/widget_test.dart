import 'package:flutter_test/flutter_test.dart';
import 'package:mnexpharma_mobile/main.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  testWidgets('shows customer-first entry screen', (tester) async {
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const MnexPharmaApp());
    await tester.pumpAndSettle();

    expect(find.text('MNEX Pharma'), findsOneWidget);
    expect(find.text('Shop medicines'), findsOneWidget);
    expect(find.text('Staff access'), findsOneWidget);
  });
}
