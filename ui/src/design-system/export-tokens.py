"""Regenerate the reference export: python3 ui/src/design-system/export-tokens.py."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[3]
web_source = (root / 'ui/tailwind.config.js').read_text()
mobile_source = (root / 'app/lib/src/theme/app_theme.dart').read_text()
web = {name: {'$type': 'color', '$value': value.upper()} for name, value in re.findall(r"(background|primary|secondary|subtle|divider):\s*'(#[0-9A-Fa-f]{6})'", web_source)}
for name, pattern in [('sage', r"DEFAULT:\s*'(#[0-9A-Fa-f]{6})'"), ('sage-hover', r"hover:\s*'(#[0-9A-Fa-f]{6})'")]:
    web[name] = {'$type': 'color', '$value': re.search(pattern, web_source).group(1).upper()}
mobile = {name: {'$type': 'color', '$value': '#' + value.upper()} for name, value in re.findall(r'static const Color (\w+) = Color\(0xFF([0-9A-Fa-f]{6})\)', mobile_source)}
result = {
    '$description': 'Flints source reference. Separate platform themes; not consumed by production. No dark theme exists.',
    'web': {'$description': 'ui/tailwind.config.js + ui/src/index.css; standard Tailwind values marked separately.',
            'color': web,
            'typography': {'family': {'$type': 'fontFamily', '$value': ['Inter', 'sans-serif']}, 'bodyWeight': {'$type': 'fontWeight', '$value': 300}, 'relaxedLineHeight': {'$type': 'number', '$value': 1.8}},
            'customSpacing': {str(n): {'$type': 'dimension', '$value': {'value': value, 'unit': 'rem'}} for n, value in [(18,4.5),(22,5.5)]},
            'usedTailwindSpacing': {'$description': 'Common standard Tailwind values observed in source, not custom theme overrides.', **{str(n): {'$type':'dimension','$value':{'value':n,'unit':'px'}} for n in [4,8,12,16,24,32,48,64]}},
            'usedTailwindRadius': {name: {'$type':'dimension','$value':{'value':value,'unit':'px'}} for name,value in [('lg',8),('xl',12),('2xl',16),('3xl',24),('full',9999)]}},
    'flutter': {'$description': 'app/lib/src/theme/app_theme.dart. Material 3 may derive additional ColorScheme values from sage.', 'color':mobile,
                'radius': {name:{'$type':'dimension','$value':{'value':n,'unit':'px'}} for name,n in [('card',28),('button',18),('input',20),('chip',999)]}},
}
(root / 'ui/public/design-system/tokens.json').write_text(json.dumps(result, indent=2) + '\n')
print('Exported web and Flutter reference tokens.')
