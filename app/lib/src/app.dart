import 'package:flutter/material.dart';

import 'app_controller.dart';
import 'screens/shell_page.dart';
import 'screens/welcome_page.dart';
import 'theme/app_theme.dart';

class FlintsApp extends StatelessWidget {
  const FlintsApp({
    super.key,
    required this.controller,
  });

  final FlintsAppController controller;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        return MaterialApp(
          title: 'Flints',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.light(),
          home: controller.hasSession
              ? FlintsShellPage(controller: controller)
              : WelcomePage(controller: controller),
        );
      },
    );
  }
}
