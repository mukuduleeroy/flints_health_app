import 'package:flutter/material.dart';

class FlintsScaffold extends StatelessWidget {
  const FlintsScaffold({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFFFFBF6),
            Color(0xFFF7F1E9),
            Color(0xFFF2E8DE),
          ],
        ),
      ),
      child: SafeArea(child: child),
    );
  }
}
