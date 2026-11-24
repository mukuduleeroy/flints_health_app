// Run from ui/: swift scripts/generate-ios-brand.swift
import AppKit
let size = NSSize(width: 1024, height: 1024)
let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1024,
    pixelsHigh: 1024, bitsPerSample: 8, samplesPerPixel: 3, hasAlpha: false,
    isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
NSColor(srgbRed: 250/255, green: 250/255, blue: 249/255, alpha: 1).setFill()
NSBezierPath(rect: NSRect(origin: .zero, size: size)).fill()
let attributes: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: 235, weight: .light),
    .foregroundColor: NSColor(srgbRed: 120/255, green: 113/255, blue: 108/255, alpha: 1),
]
let wordmark = NSAttributedString(string: "Flints", attributes: attributes)
let bounds = wordmark.size()
wordmark.draw(at: NSPoint(x: (1024 - bounds.width)/2, y: (1024 - bounds.height)/2))
NSGraphicsContext.restoreGraphicsState()
let png = bitmap.representation(using: .png, properties: [:])!
try png.write(to: URL(fileURLWithPath: "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png"))
