export const webColors = [
  ["background", "#FAFAF9", "Page canvas"],
  ["primary", "#78716C", "Body text · secondary actions"],
  ["secondary", "#A8A29E", "Supporting text"],
  ["subtle", "#D6D3D1", "Quiet text · scrollbar"],
  ["divider", "#E7E5E4", "Borders · separators"],
  ["sage", "#A3B18A", "Brand · selection · primary actions"],
  ["sage.hover", "#8F9E77", "Primary action hover"],
  ["white", "#FFFFFF", "Cards · input surfaces"],
] as const;
export const mobileColors = [
  ["background", "#F6F0E8", "Page canvas"],
  ["surface", "#FFFCF7", "Cards · navigation"],
  ["ink", "#2B211B", "Primary text"],
  ["muted", "#6F635C", "Supporting text"],
  ["sage", "#4D7A68", "Primary action"],
  ["sageSoft", "#DDE8E2", "Selected navigation"],
  ["clay", "#CA7C5B", "Secondary accent"],
  ["gold", "#E8C98A", "Warm accent"],
  ["rose", "#B45D5B", "Error"],
] as const;
export const inventory = [
  [
    "MoodSelector",
    "Wellbeing",
    "components/MoodSelector.tsx",
    "Controlled 1–5 selection; animated selected dot and label.",
  ],
  [
    "JournalForm",
    "Wellbeing",
    "components/JournalForm.tsx",
    "Empty, focused, filled and submitting; exposes focus() through a ref.",
  ],
  [
    "EntryList",
    "Wellbeing",
    "components/EntryList.tsx",
    "Empty prompt and timestamped entries with animated insertion/removal.",
  ],
  [
    "PostComposer",
    "Community",
    "components/PostComposer.tsx",
    "Idle, expanded and 500-character limit; local submit callback.",
  ],
  [
    "PostCard",
    "Community",
    "components/PostCard.tsx",
    "Named/anonymous, circle badge, relate, reply and nested replies.",
  ],
  [
    "CircleDetailView",
    "Community",
    "components/CircleDetailView.tsx",
    "Join/leave, member-only composer and feed; saved on this device.",
  ],
  [
    "PathDetailView",
    "Journeys",
    "components/PathDetailView.tsx",
    "Enroll, progress, completed/current/locked steps. Step action is a TODO in source.",
  ],
  [
    "BottomNav",
    "Navigation",
    "components/BottomNav.tsx",
    "Five tabs; selected icon, dot and label; fixed to viewport.",
  ],
  [
    "AuthLayout",
    "Authentication",
    "components/auth/AuthLayout.tsx",
    "Back navigation, brand, optional heading and white form card.",
  ],
  [
    "PrivacyConsent",
    "Authentication",
    "components/auth/PrivacyConsent.tsx",
    "Controlled checkbox and expandable explanation. Policy URL is a placeholder.",
  ],
  [
    "SafetyPlanModal",
    "Safety",
    "components/SafetyPlanModal.tsx",
    "Closed, loading, editing and saving; on-device eight-section safety plan.",
  ],
  [
    "MarkdownText",
    "Content",
    "components/MarkdownText.tsx",
    "Bold, bullet lists, numbered lists and paragraphs; not a full Markdown renderer.",
  ],
  [
    "AdminLayout",
    "Administration",
    "components/admin/AdminLayout.tsx",
    "Eight navigation entries, desktop sidebar and mobile menu.",
  ],
  [
    "StatCard",
    "Administration",
    "components/admin/StatCard.tsx",
    "Sage/orange/red/blue icon tiles; optional positive/negative trend.",
  ],
  [
    "FlaggedContentCard",
    "Administration",
    "components/admin/FlaggedContentCard.tsx",
    "Low/medium/high severity, context expansion, approve/dismiss/escalate.",
  ],
] as const;
export const screens = [
  [
    "WelcomePage",
    "auth/WelcomePage.tsx",
    "Brand introduction, feature list and entry actions.",
  ],
  [
    "LoginPage",
    "auth/LoginPage.tsx",
    "Credentials, password visibility, remember checkbox, error and loading states.",
  ],
  [
    "SignupPage",
    "auth/SignupPage.tsx",
    "Registration fields, password visibility and privacy consent.",
  ],
  [
    "HomeTab",
    "HomeTab.tsx",
    "Greeting, mood check-in, daily verse, quick actions, journal and entry list.",
  ],
  [
    "CompanionTab",
    "CompanionTab.tsx",
    "Listen/Reflect/Ground modes, assistant/user bubbles, typing and composer.",
  ],
  [
    "PathsTab",
    "PathsTab.tsx",
    "Category filters, journey cards, enrollment progress and detail view.",
  ],
  [
    "CirclesTab",
    "CirclesTab.tsx",
    "Search, topic cards, membership indicator and community feed.",
  ],
  [
    "ProfileTab",
    "ProfileTab.tsx",
    "Avatar, membership, streak, milestones, safety panel and mood history.",
  ],
  [
    "AdminDashboard",
    "admin/AdminDashboard.tsx",
    "Summary stats, alerts and management entry points.",
  ],
  [
    "UserManagement",
    "admin/UserManagement.tsx",
    "Search, account table, role and suspension actions.",
  ],
  [
    "ContentModeration",
    "admin/ContentModeration.tsx",
    "Moderation queue, severity filters and review actions.",
  ],
  [
    "SystemMonitoring",
    "admin/SystemMonitoring.tsx",
    "Service status, metrics and logs.",
  ],
  [
    "CircleManagement",
    "admin/CircleManagement.tsx",
    "Community management list and creation form.",
  ],
  [
    "PathManagement",
    "admin/PathManagement.tsx",
    "Journey list and path/step authoring forms.",
  ],
  [
    "SafetyManagement",
    "admin/SafetyManagement.tsx",
    "Risk overview and safety/escalation management.",
  ],
  [
    "Analytics",
    "admin/Analytics.tsx",
    "Engagement, mood distribution and trend summaries.",
  ],
] as const;
export const sections = [
  ["overview", "Overview"],
  ["foundations", "Foundations"],
  ["controls", "Buttons & inputs"],
  ["navigation", "Navigation"],
  ["wellbeing", "Mood & journaling"],
  ["community", "Community"],
  ["journeys", "Paths & progress"],
  ["companion", "Companion & content"],
  ["safety", "Safety & feedback"],
  ["admin", "Administration"],
  ["inventory", "Source inventory"],
  ["guidelines", "Usage & gaps"],
] as const;
