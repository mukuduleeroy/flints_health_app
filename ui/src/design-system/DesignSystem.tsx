import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  Layers,
  Leaf,
  Map,
  Menu,
  MessageCircle,
  PenLine,
  Search,
  Send,
  Shield,
  Sparkles,
  Users,
  User,
  X,
} from "lucide-react";
import { MoodSelector } from "../components/MoodSelector";
import { JournalForm } from "../components/JournalForm";
import { EntryList, type Entry } from "../components/EntryList";
import { PostComposer } from "../components/PostComposer";
import { PostCard } from "../components/PostCard";
import { BottomNav, type TabId } from "../components/BottomNav";
import { PrivacyConsent } from "../components/auth/PrivacyConsent";
import { AuthLayout } from "../components/auth/AuthLayout";
import { MarkdownText } from "../components/MarkdownText";
import { StatCard } from "../components/admin/StatCard";
import { FlaggedContentCard } from "../components/admin/FlaggedContentCard";
import { PathDetailView } from "../components/PathDetailView";
import type { Path, Post } from "../api/client";
import {
  inventory,
  mobileColors,
  screens,
  sections,
  webColors,
} from "./catalog";
import "./design-system.css";

function Specimen({
  title,
  source,
  note,
  children,
  wide = false,
}: {
  title: string;
  source: string;
  note: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <article className={`ds-specimen ${wide ? "ds-wide" : ""}`}>
      <div className="ds-specimen-head">
        <h3>{title}</h3>
        <code>{source}</code>
      </div>
      <div className="ds-preview">{children}</div>
      <p className="ds-note">{note}</p>
    </article>
  );
}
function Section({
  id,
  index,
  title,
  description,
  children,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="ds-section">
      <header className="ds-section-head">
        <span className="ds-eyebrow">{index} / THE LIBRARY</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}
const makePost = (id: number, content: string): Post => ({
  id,
  circle_id: 1,
  content,
  is_anonymous: false,
  reaction_count: 4,
  reply_count: 0,
  is_flagged: false,
  is_hidden: false,
  created_at: new Date().toISOString(),
  author_name: "Grace",
  circle_name: "Small steps",
});
const initialPath: Path = {
  id: 1,
  name: "Finding calm",
  category: "anxiety",
  difficulty: "beginner",
  step_count: 3,
  estimated_duration: 7,
  enrollment_count: 24,
  created_at: "2026-11-16",
  steps: [
    {
      id: 1,
      path_id: 1,
      title: "Pause and notice",
      content: "Make a little room for how you feel today.",
      order_index: 0,
      step_type: "reading",
      estimated_minutes: 3,
    },
    {
      id: 2,
      path_id: 1,
      title: "A moment of grounding",
      content: "Take time to notice the world around you.",
      order_index: 1,
      step_type: "exercise",
      estimated_minutes: 5,
    },
    {
      id: 3,
      path_id: 1,
      title: "Write a reflection",
      content: "Reflect on one small thing you are grateful for.",
      order_index: 2,
      step_type: "journal",
      estimated_minutes: 5,
    },
  ],
};

export function DesignSystem() {
  const [active, setActive] = useState("overview");
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [palette, setPalette] = useState<"web" | "mobile">("web");
  const [mood, setMood] = useState(3);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [consent, setConsent] = useState(false);
  const [tab, setTab] = useState<TabId>("home");
  const [posts, setPosts] = useState<Post[]>([
    makePost(
      1,
      "Today I made time for a quiet walk. A small step, but it helped.",
    ),
  ]);
  const [path, setPath] = useState(initialPath);
  const [category, setCategory] = useState("All Paths");
  const [mode, setMode] = useState("Listen");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [dialog, setDialog] = useState(false);
  const [coping, setCoping] = useState(["Take a quiet walk"]);
  const [newCoping, setNewCoping] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [adminPage, setAdminPage] = useState("Dashboard");
  const [input, setInput] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.title = "Flints — UI System";
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items
          .filter((item) => item.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: [0, 0.1] },
    );
    document
      .querySelectorAll(".ds-section, #overview")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (dialog) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [dialog]);
  const announce = (text: string) => setNotice(text);
  const filteredInventory = inventory.filter((row) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  const filteredScreens = screens.filter((row) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="ds-shell">
      <a className="ds-skip" href="#ds-content">
        Skip to library
      </a>
      <aside className={`ds-sidebar ${menu ? "is-open" : ""}`}>
        <a href="#overview" className="ds-brand" onClick={() => setMenu(false)}>
          <span className="ds-brand-icon">
            <Leaf size={23} />
          </span>
          <span>
            flints<span className="ds-brand-sub">DESIGN SYSTEM</span>
          </span>
        </a>
        <div className="ds-sidebar-label">
          LIBRARY <span>01</span>
        </div>
        <nav aria-label="Design system sections">
          {sections.map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={active === id ? "is-active" : ""}
              onClick={() => {
                setActive(id);
                setMenu(false);
              }}
            >
              <span>{String(i).padStart(2, "0")}</span>
              {label}
              {active === id && <span className="ds-nav-dot" />}
            </a>
          ))}
        </nav>
        <div className="ds-sidebar-bottom">
          <span className="ds-status-dot" /> Derived from the product
          <p>React + TypeScript · Flutter</p>
          <a href="/">
            Open Flints <ArrowRight size={14} />
          </a>
        </div>
      </aside>
      <div className="ds-main">
        <header className="ds-topbar">
          <div>
            <button
              className="ds-mobile-menu"
              aria-label="Toggle library navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span>Flints</span>
            <ChevronRight size={13} />
            <strong>UI system</strong>
          </div>
          <a href="/design-system/tokens.json" download className="ds-download">
            <ArrowDownToLine size={14} /> <span>Export tokens</span>
          </a>
        </header>
        <main id="ds-content">
          <section id="overview" className="ds-hero">
            <div className="ds-hero-copy">
              <span className="ds-eyebrow">
                <span className="ds-status-dot" /> THE FLINTS UI SYSTEM
              </span>
              <h1>
                A little space.
                <br />A lot of care.
              </h1>
              <p>
                The foundations, components, and patterns behind Flints. A shared
                language for a calmer, more thoughtful experience.
              </p>
              <div className="ds-hero-actions">
                <a href="#foundations" className="ds-solid">
                  Explore the foundations <ArrowRight size={16} />
                </a>
                <span>Source-based · v1.0</span>
              </div>
            </div>
            <div className="ds-hero-art" aria-hidden="true">
              <div className="ds-orbit ds-orbit-one" />
              <div className="ds-orbit ds-orbit-two" />
              <div className="ds-art-card">
                <span className="ds-art-leaf">
                  <Leaf size={28} strokeWidth={1} />
                </span>
                <span>A MOMENT FOR YOU</span>
                <p>
                  Grow at your
                  <br />
                  own pace.
                </p>
                <div className="ds-art-dots">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <i key={i} className={i === 3 ? "selected" : ""} />
                  ))}
                </div>
              </div>
              <span className="ds-art-caption">Gentle by design.</span>
            </div>
          </section>
          <div className="ds-summary">
            {[
              [String(inventory.length), "Reusable components"],
              [String(screens.length), "Product screens"],
              ["02", "Platform palettes"],
              ["01", "Shared purpose"],
            ].map(([num, label]) => (
              <div key={label}>
                <strong>{num.padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="ds-intro-note">
            <Layers size={18} />
            <p>
              <strong>A library of what exists.</strong> Live specimens reuse
              the app’s React components. Pattern previews reproduce
              screen-level UI. All sample interactions stay in this page’s
              memory.
            </p>
            <span className="ds-tag">NO SIGN-IN NEEDED</span>
          </div>
          <Section
            id="foundations"
            index="01"
            title="Rooted in simplicity."
            description="Warm neutrals, a quiet sage accent, and room to breathe. Values below come from the project’s theme files."
          >
            <div className="ds-panel">
              <div className="ds-panel-heading">
                <div>
                  <h3>Color language</h3>
                  <code>
                    {palette === "web"
                      ? "ui/tailwind.config.js"
                      : "app/lib/src/theme/app_theme.dart"}
                  </code>
                </div>
                <div className="ds-segment" aria-label="Palette">
                  {(["web", "mobile"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPalette(p)}
                      aria-pressed={palette === p}
                    >
                      {p === "web" ? "React web" : "Flutter mobile"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ds-swatches">
                {(palette === "web" ? webColors : mobileColors).map(
                  ([name, hex, role]) => (
                    <button
                      key={name}
                      className="ds-swatch"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(hex);
                          announce(`Copied ${hex}`);
                        } catch {
                          announce(`${name}: ${hex}`);
                        }
                      }}
                      aria-label={`Copy ${name} ${hex}`}
                    >
                      <span className="ds-color" style={{ background: hex }} />
                      <strong>{name}</strong>
                      <code>{hex}</code>
                      <small>{role}</small>
                    </button>
                  ),
                )}
              </div>
              <p className="ds-note">
                These are separate existing themes. Switching palettes changes
                this reference sheet, not the product’s theme. Click a swatch to
                copy.
              </p>
            </div>
            <div className="ds-grid">
              <div className="ds-panel">
                <h3>Type with a softer voice</h3>
                <p className="ds-note">
                  Inter · web / Material Typography.blackMountainView · Flutter
                </p>
                <div
                  className="ds-type-sample"
                  style={{ fontSize: 36, fontWeight: 300 }}
                >
                  Room to breathe.
                </div>
                {[
                  [24, "Page heading", "300"],
                  [20, "Section heading", "500"],
                  [16, "Body & journal", "300"],
                  [14, "Body small", "300"],
                  [12, "Label", "500"],
                  [10, "Metadata", "500"],
                ].map(([size, label, weight]) => (
                  <div className="ds-type-row" key={label}>
                    <span
                      style={{
                        fontSize: Number(size),
                        fontWeight: Number(weight),
                      }}
                    >
                      {label}
                    </span>
                    <code>
                      {size}px / {weight}
                    </code>
                  </div>
                ))}
                <p className="ds-note">
                  Web body weight 300; relaxed line height 1.8. Auth brand
                  heading uses 36px. Font import currently includes weights
                  300–700, bundled locally.
                </p>
              </div>
              <div className="ds-panel">
                <h3>Space, shape & elevation</h3>
                <p className="ds-note">
                  Tailwind scale, plus 18 = 72px and 22 = 88px.
                </p>
                <div className="ds-space-list">
                  {[4, 8, 12, 16, 24, 32, 48, 72, 88].map((n) => (
                    <div key={n}>
                      <code>{n}px</code>
                      <span style={{ width: `${n * 2}px` }} />
                    </div>
                  ))}
                </div>
                <div className="ds-radius-list">
                  {[8, 12, 16, 24].map((n) => (
                    <div key={n}>
                      <span style={{ borderRadius: n }} />
                      <code>{n}px</code>
                    </div>
                  ))}
                  <div>
                    <span style={{ borderRadius: 999 }} />
                    <code>full</code>
                  </div>
                </div>
                <p className="ds-note">
                  Web: shadow-sm, 1px divider/50 borders. Flutter: zero card
                  elevation, 28px cards, 18px buttons, 20px inputs.
                </p>
              </div>
            </div>
            <div className="ds-panel">
              <h3>Icons & motion</h3>
              <div className="ds-icon-row">
                {[
                  Home,
                  MessageCircle,
                  Map,
                  Users,
                  User,
                  PenLine,
                  Shield,
                  Heart,
                  BookOpen,
                  Sparkles,
                  Activity,
                  Search,
                ].map((Icon, i) => (
                  <span key={i}>
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                ))}
              </div>
              <p className="ds-note">
                Lucide React · usually 12–24px. Navigation uses 1.5px inactive /
                2.5px active strokes. Framer Motion: 300ms color transitions,
                400ms mood selection, 800ms journal entry reveal, spring
                navigation indicator (500 stiffness / 30 damping).
              </p>
            </div>
          </Section>
          <Section
            id="controls"
            index="02"
            title="Small actions. Clear intentions."
            description="Buttons and form patterns as implemented across authentication, community, and journaling."
          >
            <div className="ds-grid">
              <Specimen
                title="Action hierarchy"
                source="LoginPage · JournalForm · PathsTab"
                note="Screen patterns. Pill actions for journaling; rounded-xl full-width actions for auth and paths. Hover, focus and disabled styles are interactive."
              >
                <div className="ds-control-stack">
                  <button
                    className="bg-sage hover:bg-sage-hover text-white py-3 px-6 rounded-xl text-sm font-medium"
                    onClick={() => announce("Primary action selected")}
                  >
                    Continue your journey
                  </button>
                  <button
                    className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl text-sm"
                    onClick={() => announce("Secondary action selected")}
                  >
                    Start Journey
                  </button>
                  <div className="ds-row">
                    <button
                      className="bg-sage hover:bg-sage-hover text-white py-3 px-8 rounded-full text-sm"
                      onClick={() => announce("Demo entry saved")}
                    >
                      Save Entry
                    </button>
                    <button
                      className="text-secondary hover:text-primary text-sm"
                      onClick={() => announce("Demo action cancelled")}
                    >
                      Cancel
                    </button>
                  </div>
                  <button
                    disabled
                    className="bg-sage text-white py-3 px-6 rounded-xl text-sm opacity-50 cursor-not-allowed"
                  >
                    Saving…
                  </button>
                </div>
              </Specimen>
              <Specimen
                title="Fields & selection"
                source="LoginPage · CirclesTab · PrivacyConsent"
                note="Input patterns plus the real PrivacyConsent component. Expand the explanation or select the checkbox."
              >
                <div className="ds-control-stack">
                  <label className="text-sm font-medium">
                    Email or nickname
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Your nickname"
                      className="mt-2 w-full bg-background border border-divider rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sage"
                    />
                  </label>
                  <label className="text-sm">
                    Search circles
                    <span className="relative block mt-2">
                      <Search
                        size={16}
                        className="absolute left-4 top-4 text-secondary"
                      />
                      <input
                        aria-label="Search circles example"
                        placeholder="Find a topic or conversation…"
                        className="w-full bg-white border border-divider/50 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-sage"
                      />
                    </span>
                  </label>
                  <PrivacyConsent checked={consent} onChange={setConsent} />
                  <label className="text-sm">
                    Validation example
                    <input
                      aria-invalid="true"
                      aria-describedby="ds-field-error"
                      defaultValue="invalid address"
                      className="mt-2 w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm"
                    />
                    <span
                      id="ds-field-error"
                      className="block text-xs text-red-800 mt-2"
                    >
                      Please check your email address.
                    </span>
                  </label>
                </div>
              </Specimen>
            </div>
            <details className="ds-details">
              <summary>Authentication layout · live component</summary>
              <div className="ds-contained-auth">
                <AuthLayout
                  title="Welcome Back"
                  subtitle="Log in to continue your journey."
                  onBack={() => announce("Back navigation preview")}
                >
                  <div className="text-sm text-secondary">
                    Form content is placed here. See the input specimens above.
                  </div>
                </AuthLayout>
              </div>
            </details>
          </Section>
          <Section
            id="navigation"
            index="03"
            title="Always a familiar way back."
            description="Five destinations anchor the member experience. Administration has its own responsive navigation."
          >
            <Specimen
              title="Member bottom navigation"
              source="components/BottomNav.tsx"
              note={`Live component in a contained viewport. Selected destination: ${tab}. In the product this navigation is fixed to the viewport.`}
              wide
            >
              <div className="ds-contained-nav">
                <BottomNav activeTab={tab} onTabChange={setTab} />
              </div>
            </Specimen>
            <div className="ds-panel">
              <h3>Layout rules</h3>
              <div className="ds-rule-grid">
                <p>
                  <strong>Member screens</strong>max-w-2xl (672px), 24px side
                  padding, 80–96px bottom clearance.
                </p>
                <p>
                  <strong>Authentication</strong>max-w-md (448px), centered
                  layout and 32px card padding.
                </p>
                <p>
                  <strong>Administration</strong>256px sidebar at lg (1024px);
                  mobile header and menu below it.
                </p>
              </div>
            </div>
          </Section>
          <Section
            id="wellbeing"
            index="04"
            title="Meet people where they are."
            description="A gentle check-in and an open space to reflect. These are the actual mood, journal, and entry components."
          >
            <Specimen
              title="Daily mood check-in"
              source="components/MoodSelector.tsx"
              note={`Live controlled component. Current value: ${mood}/5. Select any mood; no mood is added to your device profile.`}
              wide
            >
              <div className="ds-mood-scroll">
                <MoodSelector selectedMood={mood} onSelectMood={setMood} />
              </div>
            </Specimen>
            <Specimen
              title="Journal & history"
              source="JournalForm.tsx · EntryList.tsx"
              note="Write a reflection to reveal Save Entry. Submissions append to the local preview. Reloading clears demo entries."
              wide
            >
              <div className="ds-journal">
                <JournalForm
                  onSubmit={(text) => {
                    setEntries((prev) => [
                      {
                        id: String(Date.now()),
                        text,
                        mood,
                        timestamp: new Date(),
                      },
                      ...prev,
                    ]);
                    announce("Entry added to this preview");
                  }}
                />
                <EntryList entries={entries} />
              </div>
            </Specimen>
          </Section>
          <Section
            id="community"
            index="05"
            title="Connection, with care."
            description="Quiet cards, familiar reactions, and conversations that leave room for everyone."
          >
            <div className="ds-grid">
              <Specimen
                title="Post composer"
                source="components/PostComposer.tsx"
                note="Live component. Focus to reveal the character count and send action. Publishing inserts a sample post beside this composer."
              >
                <PostComposer
                  onSubmit={(content) => {
                    setPosts((prev) => [
                      makePost(Date.now(), content),
                      ...prev,
                    ]);
                    announce("Post added to this preview");
                  }}
                />
              </Specimen>
              <Specimen
                title="Community post"
                source="components/PostCard.tsx"
                note="Live component. Relate toggles locally; replies are appended in this preview. The overflow icon has no handler in the source."
              >
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      showCircleBadge
                      onReact={() => {}}
                      onReply={(id, content, anonymous) =>
                        setPosts((prev) =>
                          prev.map((p) =>
                            p.id === id
                              ? {
                                  ...p,
                                  reply_count: p.reply_count + 1,
                                  replies: [
                                    ...(p.replies || []),
                                    {
                                      ...makePost(Date.now(), content),
                                      author_name: anonymous
                                        ? "Anonymous"
                                        : "You",
                                      is_anonymous: anonymous,
                                    },
                                  ],
                                }
                              : p,
                          ),
                        )
                      }
                    />
                  ))}
                </div>
              </Specimen>
            </div>
            <div className="ds-panel">
              <h3>Circle topic cards · screen pattern</h3>
              <div className="ds-row">
                {["Small steps", "Faith & hope", "Rest & renewal"].map(
                  (name, i) => (
                    <button
                      key={name}
                      onClick={() =>
                        announce(`${name} circle selected — preview only`)
                      }
                      className="bg-white border border-divider/50 rounded-xl px-4 py-3 min-w-[140px] text-left hover:border-sage"
                    >
                      <span className="block text-sm font-medium mb-2">
                        {name}
                      </span>
                      <span className="flex items-center text-xs text-secondary">
                        <Users size={12} className="mr-1" />
                        {[24, 38, 16][i]} members
                      </span>
                    </button>
                  ),
                )}
              </div>
              <p className="ds-note">
                Source: pages/CirclesTab.tsx. CircleDetailView composes the
                member feed, join/leave button and safe-space banner.
              </p>
            </div>
          </Section>
          <Section
            id="journeys"
            index="06"
            title="Progress at a human pace."
            description="Category filters, measured progress, and a clear distinction between completed, current, and locked steps."
          >
            <div className="ds-panel">
              <h3>Category filters · screen pattern</h3>
              <div className="ds-row">
                {[
                  "All Paths",
                  "Anxiety",
                  "Grief",
                  "Burnout",
                  "Depression",
                  "Relationships",
                  "Growth",
                ].map((c) => (
                  <button
                    key={c}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-full text-xs font-medium ${category === c ? "bg-sage text-white" : "bg-secondary/10 text-secondary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="ds-note">
                Source: pages/PathsTab.tsx. Selected filter: {category}. This
                specimen demonstrates selection; it does not request paths.
              </p>
            </div>
            <Specimen
              title="Path detail & step states"
              source="components/PathDetailView.tsx"
              note="Live component with local enrollment. Choose Enrolled to compare completed, current and locked steps. Step content navigation is not implemented in the project."
              wide
            >
              <div className="ds-row mb-4">
                <button
                  className="ds-outline"
                  onClick={() => setPath(initialPath)}
                >
                  Not enrolled
                </button>
                <button
                  className="ds-outline"
                  onClick={() =>
                    setPath({
                      ...initialPath,
                      user_progress: {
                        id: 1,
                        path_id: 1,
                        current_step_index: 1,
                        progress_percentage: 33,
                        is_completed: false,
                        started_at: "2026-11-16",
                        last_activity: "2026-11-16",
                      },
                    })
                  }
                >
                  Enrolled · 33%
                </button>
              </div>
              <div className="ds-contained-path">
                <PathDetailView
                  path={path}
                  onBack={() => announce("Back to journeys — preview only")}
                  onEnroll={() => {
                    setPath({
                      ...initialPath,
                      user_progress: {
                        id: 1,
                        path_id: 1,
                        current_step_index: 0,
                        progress_percentage: 0,
                        is_completed: false,
                        started_at: "2026-11-16",
                        last_activity: "2026-11-16",
                      },
                    });
                    announce("Enrolled in the preview journey");
                  }}
                  onRefresh={() => {}}
                />
              </div>
            </Specimen>
          </Section>
          <Section
            id="companion"
            index="07"
            title="A space to be heard."
            description="Companion screen patterns, message hierarchy, and the project’s lightweight text renderer."
          >
            <div className="ds-grid">
              <Specimen
                title="Modes & conversation"
                source="pages/CompanionTab.tsx · pattern preview"
                note="Mode selection and sending are local UI demonstrations. The app’s AI connection is disconnected; these are pattern previews only."
              >
                <div className="ds-segment ds-chat-modes">
                  {["Listen", "Reflect", "Ground"].map((m) => (
                    <button
                      key={m}
                      aria-pressed={mode === m}
                      onClick={() => setMode(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="ds-chat">
                  <div className="bg-white border border-divider/50 rounded-2xl rounded-tl-sm p-4 text-sm shadow-sm">
                    You can take your time here.
                  </div>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className="bg-primary text-white rounded-2xl rounded-tr-sm p-4 text-sm ml-8"
                    >
                      {m}
                    </div>
                  ))}
                </div>
                <form
                  className="ds-chat-compose"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (message.trim()) {
                      setMessages((prev) => [...prev, message]);
                      setMessage("");
                    }
                  }}
                >
                  <input
                    aria-label="Demo companion message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your thoughts…"
                  />
                  <button
                    aria-label="Send demo message"
                    disabled={!message.trim()}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </Specimen>
              <Specimen
                title="Formatted companion text"
                source="components/MarkdownText.tsx"
                note="Live renderer: bold, bullets, numbered lists and paragraph breaks. Links, headings and fenced code are not supported."
              >
                <div className="bg-white rounded-2xl p-5 text-sm leading-relaxed border border-divider/50">
                  <MarkdownText
                    text={
                      "**A small moment of reflection**\n\nYou don’t need to find every answer today.\n- Notice one thing around you.\n- Give yourself a little room.\n\n1. Pause.\n2. Reflect at your own pace."
                    }
                  />
                </div>
              </Specimen>
            </div>
          </Section>
          <Section
            id="safety"
            index="08"
            title="Care in every state."
            description="Safety plan structure and system feedback, documented independently of live personal data."
          >
            <div className="ds-grid">
              <Specimen
                title="Safety plan entry"
                source="ProfileTab.tsx · SafetyPlanModal.tsx"
                note="Pattern preview. The app modal loads and saves personal data on this device; this dialog demonstrates layout and local list editing only."
              >
                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={20} className="text-red-500" />
                    <h4 className="text-sm font-medium text-red-900">
                      My Safety Plan
                    </h4>
                  </div>
                  <p className="text-sm text-red-800/70 mb-4">
                    A private space for your coping strategies and contacts.
                  </p>
                  <button
                    ref={openerRef}
                    onClick={() => setDialog(true)}
                    className="text-xs font-medium text-red-600 bg-white border border-red-200 px-4 py-2 rounded-lg"
                  >
                    View Plan
                  </button>
                </div>
              </Specimen>
              <Specimen
                title="Loading, empty & error"
                source="ProfileTab · CirclesTab · LoginPage"
                note="Screen patterns. Success toast is a gallery-only confirmation; the original app uses inline feedback and alerts."
              >
                <div className="ds-control-stack">
                  <div
                    role="status"
                    className="flex items-center gap-3 text-sm text-secondary"
                  >
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-divider border-t-sage" />
                    Loading your space…
                  </div>
                  <div className="text-center py-6 bg-white rounded-2xl border border-divider/30">
                    <p className="text-sm text-secondary">No posts yet</p>
                    <p className="text-xs text-secondary mt-2">
                      Join a circle to see posts from the community
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
                    Login failed. Please check your credentials.
                  </div>
                </div>
              </Specimen>
            </div>
          </Section>
          <Section
            id="admin"
            index="09"
            title="Clarity behind the scenes."
            description="Operational cards, severity, review actions, and account table patterns for the administrative experience."
          >
            <div className="ds-grid ds-stats-grid">
              {(["sage", "orange", "red", "blue"] as const).map((color, i) => (
                <StatCard
                  key={color}
                  title={
                    [
                      "Active members",
                      "Conversations",
                      "Flagged posts",
                      "Paths completed",
                    ][i]
                  }
                  value={["1,248", "326", "12", "84"][i]}
                  change={[8, -3, 2, 12][i]}
                  icon={Users}
                  color={color}
                />
              ))}
            </div>
            <p className="ds-note mb-6">
              Live StatCard components · illustrative data · all four color
              variants and both trend directions.
            </p>
            <div className="ds-grid">
              <Specimen
                title="Content review"
                source="components/admin/FlaggedContentCard.tsx"
                note="Live card. Switch severity, expand the full context and try the three review actions; actions show a local confirmation."
              >
                <div className="ds-row mb-4">
                  {(["low", "medium", "high"] as const).map((s) => (
                    <button
                      key={s}
                      className="ds-outline"
                      aria-pressed={severity === s}
                      onClick={() => setSeverity(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <FlaggedContentCard
                  id={1}
                  content="This sample community post has been flagged for review. A moderator can expand this example to read the full context before deciding what to do next."
                  author="Sample member"
                  reason="Community guideline review"
                  severity={severity}
                  timestamp="Demo"
                  onAction={(_, action) =>
                    announce(`Demo review action: ${action}`)
                  }
                />
              </Specimen>
              <Specimen
                title="Administrative navigation"
                source="components/admin/AdminLayout.tsx · pattern"
                note={`Desktop menu pattern; selected section: ${adminPage}. The original layout switches to a mobile menu below 1024px.`}
              >
                <nav
                  aria-label="Admin navigation example"
                  className="ds-admin-nav"
                >
                  {[
                    "Dashboard",
                    "User Management",
                    "Content Moderation",
                    "System Monitoring",
                    "Circle Management",
                    "Path Management",
                    "Safety & Crisis",
                    "Analytics",
                  ].map((label) => (
                    <button
                      key={label}
                      aria-current={adminPage === label ? "page" : undefined}
                      onClick={() => setAdminPage(label)}
                      className={
                        adminPage === label
                          ? "bg-sage/10 text-sage"
                          : "text-secondary"
                      }
                    >
                      {label}
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </nav>
              </Specimen>
            </div>
            <Specimen
              title="Account table"
              source="pages/admin/UserManagement.tsx · pattern"
              note="Representative table pattern: identity, role, text-backed status and action. Sample rows contain no real account information."
              wide
            >
              <div className="ds-table-wrap">
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Grace", "Sam", "Alex"].map((name, i) => (
                      <tr key={name}>
                        <td>
                          <span className="ds-avatar">{name[0]}</span>
                          {name}
                        </td>
                        <td>{i === 1 ? "Moderator" : "Member"}</td>
                        <td>
                          <span
                            className={`ds-badge ${i === 2 ? "ds-badge-orange" : ""}`}
                          >
                            {i === 2 ? "Flagged" : "Active"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="text-sage text-xs"
                            onClick={() =>
                              announce(`Previewing ${name} — demo account`)
                            }
                          >
                            View member
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Specimen>
          </Section>
          <Section
            id="inventory"
            index="10"
            title="Every piece, traceable."
            description="The complete reusable React inventory and all product screens. Paths are relative to ui/src; Flutter mappings follow below."
          >
            <div className="ds-inventory-search">
              <Search size={18} />
              <input
                aria-label="Filter source inventory"
                placeholder="Find a component, screen, or behavior…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span>
                {filteredInventory.length + filteredScreens.length} results
              </span>
            </div>
            <div className="ds-panel">
              <h3>Reusable components · {inventory.length}</h3>
              <div className="ds-catalog">
                {filteredInventory.map(([name, group, source, note]) => (
                  <div key={name}>
                    <div>
                      <strong>{name}</strong>
                      <span className="ds-tag">{group}</span>
                    </div>
                    <code>{source}</code>
                    <p>{note}</p>
                  </div>
                ))}
                {!filteredInventory.length && (
                  <p className="ds-note">No matching reusable components.</p>
                )}
              </div>
            </div>
            <div className="ds-panel">
              <h3>Composed product screens · {screens.length}</h3>
              <div className="ds-catalog ds-screen-catalog">
                {filteredScreens.map(([name, source, note]) => (
                  <div key={name}>
                    <strong>{name}</strong>
                    <code>pages/{source}</code>
                    <p>{note}</p>
                  </div>
                ))}
                {!filteredScreens.length && (
                  <p className="ds-note">No matching screens.</p>
                )}
              </div>
            </div>
            <div className="ds-panel">
              <h3>Flutter counterparts</h3>
              <div className="ds-rule-grid">
                <p>
                  <strong>Foundations & shell</strong>theme/app_theme.dart,
                  widgets/flints_scaffold.dart, screens/shell_page.dart.
                </p>
                <p>
                  <strong>Member screens</strong>welcome_page, home_page,
                  companion_page, paths_page, circles_page, profile_page in
                  app/lib/src/screens.
                </p>
                <p>
                  <strong>Local widget patterns</strong>_SectionCard,
                  _QuickActionCard, _MetaChip, _FeaturePill, _TypingBubble,
                  _Stat and _MetricCard. Material 3 controls inherit AppTheme.
                </p>
              </div>
              <p className="ds-note">
                Native widgets are documented here; this browser does not
                execute Flutter. See DESIGN_SYSTEM.md for the cross-platform
                mapping and theme differences.
              </p>
            </div>
          </Section>
          <Section
            id="guidelines"
            index="11"
            title="Keep the care consistent."
            description="Implementation guidance and the gaps discovered while reading the project."
          >
            <div className="ds-grid">
              <div className="ds-panel">
                <h3>Use the existing language</h3>
                <ul className="ds-guidelines">
                  <li>
                    Use existing components before reproducing screen markup.
                    Pass callbacks and controlled state from the parent.
                  </li>
                  <li>
                    Keep member content narrow, primary actions clear, and
                    surface borders quiet.
                  </li>
                  <li>
                    Retain text labels alongside risk colors, loading
                    indicators, and icon actions.
                  </li>
                  <li>
                    Treat web and mobile as separate themes until the product
                    explicitly adopts a shared palette.
                  </li>
                  <li>
                    Use the exported tokens as a source reference. They do not
                    change either application’s theme.
                  </li>
                </ul>
              </div>
              <div className="ds-panel">
                <h3>Observed gaps to resolve</h3>
                <ul className="ds-guidelines">
                  <li>
                    Buttons, fields, badges, chat bubbles and tables are
                    repeated screen patterns rather than shared primitives.
                  </li>
                  <li>
                    Some light text and sage-on-white combinations need contrast
                    improvements before claiming WCAG compliance.
                  </li>
                  <li>
                    Several icon controls lack accessible names; MoodSelector
                    removes the focus outline; the safety modal needs focus
                    management.
                  </li>
                  <li>
                    Reduced-motion handling and a dark theme are not defined.
                    Font weights 300–700 are now bundled for the iPhone build.
                  </li>
                  <li>
                    Path step navigation, the privacy policy URL, and several
                    utility actions are placeholders in the source.
                  </li>
                </ul>
              </div>
            </div>
          </Section>
          <footer className="ds-footer">
            <span>
              <Leaf size={17} /> Flints UI system
            </span>
            <p>Built from the product. Made for the people building it.</p>
            <a href="#overview">Back to top ↑</a>
          </footer>
        </main>
      </div>
      <div className="ds-toast" role="status" aria-live="polite">
        {notice && (
          <span>
            <CheckCircle2 size={16} />
            {notice}
          </span>
        )}
      </div>
      <dialog
        ref={dialogRef}
        className="ds-dialog"
        onCancel={() => setDialog(false)}
        onClose={() => {
          setDialog(false);
          openerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDialog(false);
        }}
      >
        <div className="ds-dialog-head">
          <div>
            <span className="ds-eyebrow">LOCAL PATTERN PREVIEW</span>
            <h2>My Safety Plan</h2>
          </div>
          <button
            aria-label="Close safety plan preview"
            onClick={() => setDialog(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="ds-dialog-content">
          {[
            "Warning Signs",
            "Things I Can Do On My Own",
            "People Who Can Distract Me",
            "People I Can Ask for Help",
            "Professional Contacts",
            "Emergency Contacts",
            "Making My Environment Safe",
            "Reasons for Living",
          ].map((title, i) => (
            <div key={title}>
              <h3>{title}</h3>
              {i === 1 ? (
                <>
                  <ul>
                    {coping.map((item, index) => (
                      <li key={index}>
                        {item}
                        <button
                          aria-label={`Remove ${item}`}
                          onClick={() =>
                            setCoping((prev) =>
                              prev.filter((_, n) => n !== index),
                            )
                          }
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <form
                    className="ds-chat-compose"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newCoping.trim()) {
                        setCoping((prev) => [...prev, newCoping.trim()]);
                        setNewCoping("");
                      }
                    }}
                  >
                    <input
                      aria-label="New coping strategy"
                      placeholder="Add a strategy…"
                      value={newCoping}
                      onChange={(e) => setNewCoping(e.target.value)}
                    />
                    <button
                      aria-label="Add coping strategy"
                      disabled={!newCoping.trim()}
                    >
                      <Check size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <p className="ds-note">
                  Your personal notes and contacts appear here.
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="ds-dialog-foot">
          <button
            className="ds-solid"
            onClick={() => {
              setDialog(false);
              announce("Preview closed. Demo changes stay in memory only.");
            }}
          >
            Done with preview
          </button>
        </div>
      </dialog>
    </div>
  );
}
