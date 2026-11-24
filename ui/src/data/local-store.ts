/** On-device Flints data. No HTTP, WebSocket, cloud accounts or LLM requests. */
import verses from "./verses.json";

type Row = Record<string, any>;
interface LocalProfile {
  id: string;
  username: string;
  email: string;
  is_anonymous: boolean;
  created_at: string;
  salt?: string;
  password_hash?: string;
}
interface Space {
  moods: Row[];
  safety: Row;
  circles: Row[];
  posts: Row[];
  paths: Row[];
  conversations: Row[];
  messages: Record<string, Row[]>;
  reflections: Row[];
}
interface Store {
  version: 1;
  profiles: LocalProfile[];
  spaces: Record<string, Space>;
}
const STORE_KEY = "flints.device.v1";
export const SESSION_KEY = "flints_session";
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();
const failure = (detail: string): never => {
  throw Object.assign(new Error(detail), { response: { data: { detail } } });
};
function read(): Store {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return { version: 1, profiles: [], spaces: {} };
  try {
    const value = JSON.parse(raw);
    if (value.version !== 1 || !Array.isArray(value.profiles) || !value.spaces)
      throw new Error();
    return value;
  } catch {
    return failure(
      "Flints could not read your saved data. It has not been overwritten.",
    );
  }
}
function write(store: Store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    failure(
      "Your device could not save this change. Free some storage and try again.",
    );
  }
}
function initialSpace(): Space {
  const circles = [
    {
      name: "Anxiety Support",
      topic: "anxiety",
      description:
        "A private place to record your wins, struggles, and coping strategies.",
      icon: "🌊",
    },
    {
      name: "Grief & Loss",
      topic: "grief",
      description: "A private space to reflect on loss at your own pace.",
      icon: "🕯️",
    },
    {
      name: "Daily Gratitude",
      topic: "gratitude",
      description: "Finding small sparks of joy in the everyday.",
      icon: "✨",
    },
    {
      name: "Work Stress",
      topic: "burnout",
      description: "Notes about boundaries, balance, and demanding days.",
      icon: "🌱",
    },
  ].map((c, i) => ({
    ...c,
    id: i + 1,
    created_at: now(),
    member_count: 0,
    post_count: 0,
    is_member: false,
  }));
  const steps = [
    {
      title: "Understanding Your Anxiety",
      content:
        "Learn to recognize your anxiety triggers and physical responses.",
      step_type: "reading",
      estimated_minutes: 15,
      prompts: {
        questions: [
          "What situations make you feel anxious?",
          "How does anxiety feel in your body?",
        ],
      },
    },
    {
      title: "Breathing Techniques",
      content:
        "Practice simple breathing exercises to calm your nervous system.",
      step_type: "exercise",
      estimated_minutes: 10,
      prompts: {
        instructions: [
          "Try a gentle breathing exercise at a comfortable pace.",
        ],
      },
    },
    {
      title: "Grounding with 5 Senses",
      content: "Use the 5-4-3-2-1 technique to anchor yourself in the present.",
      step_type: "exercise",
      estimated_minutes: 5,
      prompts: {
        instructions: [
          "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        ],
      },
    },
  ].map((s, i) => ({ ...s, id: i + 1, path_id: 1, order_index: i }));
  return {
    moods: [],
    posts: [],
    conversations: [],
    messages: {},
    reflections: [],
    circles,
    safety: {
      warning_signs: [],
      internal_coping: [],
      social_contacts: [],
      people_to_ask: [],
      professionals: [],
      emergency_contacts: [],
      safe_environment: "",
      reasons_to_live: [],
    },
    paths: [
      {
        id: 1,
        name: "Managing Anxiety",
        category: "anxiety",
        difficulty: "beginner",
        estimated_duration: 14,
        steps,
      },
      {
        id: 2,
        name: "Coping with Grief",
        category: "grief",
        difficulty: "beginner",
        estimated_duration: 28,
        steps: [],
      },
      {
        id: 3,
        name: "Burnout Recovery",
        category: "burnout",
        difficulty: "intermediate",
        estimated_duration: 21,
        steps: [],
      },
    ].map((p) => ({
      ...p,
      step_count: p.steps.length,
      enrollment_count: 0,
      created_at: now(),
      is_published: true,
    })),
  };
}
const encode = (bytes: Uint8Array) =>
  Array.from(bytes, (n) => n.toString(16).padStart(2, "0")).join("");
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return encode(
    new Uint8Array(
      await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: new TextEncoder().encode(salt),
          iterations: 210000,
          hash: "SHA-256",
        },
        key,
        256,
      ),
    ),
  );
}
function analytics(store: Store, space: Space) {
  const mean = space.moods.length
    ? space.moods.reduce((s, m) => s + m.mood_score, 0) / space.moods.length
    : 0;
  return {
    users: {
      total: store.profiles.length,
      registered: store.profiles.filter((p) => !p.is_anonymous).length,
      anonymous: store.profiles.filter((p) => p.is_anonymous).length,
      new_this_week: store.profiles.filter(
        (p) => Date.now() - Date.parse(p.created_at) < 7 * 86400000,
      ).length,
    },
    circles: { total: space.circles.length },
    posts: {
      total: space.posts.length,
      flagged: space.posts.filter((p) => p.is_flagged).length,
    },
    paths: {
      total: space.paths.length,
      active_enrollments: space.paths.filter((p) => p.user_progress).length,
    },
    mood_tracking: {
      total_entries: space.moods.length,
      avg_mood_this_week: mean,
    },
    conversations: { total: space.conversations.length },
  };
}
function profileView(profile: LocalProfile, space: Space) {
  const dates = new Set(
    space.moods.map((m) => new Date(m.created_at).toLocaleDateString("en-CA")),
  );
  let streak = 0;
  const date = new Date();
  if (!dates.has(date.toLocaleDateString("en-CA")))
    date.setDate(date.getDate() - 1);
  while (dates.has(date.toLocaleDateString("en-CA"))) {
    streak++;
    date.setDate(date.getDate() - 1);
  }
  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    created_at: profile.created_at,
    is_anonymous: profile.is_anonymous,
    is_admin: true,
    is_moderator: false,
    is_active: true,
    role: "device_owner",
    risk_level: "not_assessed",
    flag_count: 0,
    streak_days: streak,
    total_mood_entries: space.moods.length,
    total_conversations: space.conversations.length,
    milestone_count: 0,
  };
}
function nextId(rows: Row[]) {
  return Math.max(0, ...rows.map((r) => Number(r.id) || 0)) + 1;
}

export class LocalClient {
  get(path: string, options?: Row) {
    return this.request("GET", path, undefined, options);
  }
  post(path: string, body?: Row) {
    return this.request("POST", path, body);
  }
  put(path: string, body?: Row) {
    return this.request("PUT", path, body);
  }
  patch(path: string, body?: Row) {
    return this.request("PATCH", path, body);
  }
  delete(path: string) {
    return this.request("DELETE", path);
  }
  private async request(
    method: string,
    path: string,
    body: Row = {},
    options: Row = {},
  ): Promise<{ data: any }> {
    const url = new URL(path, "https://on-device.invalid");
    const route = url.pathname;
    const params = {
      ...Object.fromEntries(url.searchParams),
      ...options.params,
    };
    const store = read();
    let data: any;
    if (route === "/auth/anonymous-session") {
      const user: LocalProfile = {
        id: id(),
        username: "anonymous_" + id().slice(0, 6),
        email: "",
        is_anonymous: true,
        created_at: now(),
      };
      store.profiles.push(user);
      store.spaces[user.id] = initialSpace();
      write(store);
      return { data: { access_token: user.id } };
    }
    if (route === "/auth/register") {
      if (
        !body.username?.trim() ||
        typeof body.password !== "string" ||
        body.password.length < 8
      )
        failure(
          "Enter a nickname and a device password of at least 8 characters.",
        );
      const salt = encode(crypto.getRandomValues(new Uint8Array(16)));
      const password_hash = await hashPassword(body.password, salt);
      const latest = read();
      if (
        latest.profiles.some(
          (p) =>
            p.username.toLowerCase() === body.username.trim().toLowerCase() ||
            (body.email && p.email.toLowerCase() === body.email.toLowerCase()),
        )
      )
        failure("That nickname or email already has a profile on this device.");
      const user: LocalProfile = {
        id: id(),
        username: body.username.trim(),
        email: body.email || "",
        is_anonymous: false,
        created_at: now(),
        salt,
        password_hash,
      };
      latest.profiles.push(user);
      latest.spaces[user.id] = initialSpace();
      write(latest);
      return { data: { access_token: user.id } };
    }
    if (route === "/auth/login") {
      const user = store.profiles.find(
        (p) =>
          !p.is_anonymous &&
          (p.username.toLowerCase() === body.identifier?.toLowerCase() ||
            (p.email &&
              p.email.toLowerCase() === body.identifier?.toLowerCase())),
      );
      if (
        !user?.salt ||
        !user.password_hash ||
        (await hashPassword(body.password || "", user.salt)) !==
          user.password_hash
      )
        return failure(
          "No matching profile and password on this device. Cloud accounts are disconnected.",
        );
      return { data: { access_token: user.id } };
    }
    if (route === "/auth/logout") return { data: null };
    const user = store.profiles.find(
      (p) => p.id === localStorage.getItem(SESSION_KEY),
    );
    if (!user) return failure("Open a profile on this device to continue.");
    const space = store.spaces[user.id];
    const page = (rows: Row[]) =>
      rows.slice(
        Number(params.skip || 0),
        Number(params.skip || 0) + Number(params.limit || 50),
      );
    const find = (rows: Row[], value: string | number) =>
      rows.find((r) => String(r.id) === String(value)) ||
      failure("This item is no longer on your device.");
    if (route === "/profile") {
      if (method === "PATCH") {
        if (body.username) user.username = body.username.trim();
        if (body.email !== undefined) user.email = body.email;
      }
      data = profileView(user, space);
    } else if (route === "/profile/milestones") data = [];
    else if (route === "/mood" && method === "POST") {
      if (
        !Number.isInteger(body.mood_score) ||
        body.mood_score < 1 ||
        body.mood_score > 5
      )
        failure("Choose a mood from 1 to 5.");
      data = { ...body, id: id(), created_at: now() };
      space.moods.unshift(data);
    } else if (route === "/mood/history") {
      const entries = space.moods.filter(
        (m) =>
          Date.parse(m.created_at) >=
          Date.now() - Number(params.days || 7) * 86400000,
      );
      data = {
        entries,
        total_entries: entries.length,
        average_score: entries.length
          ? entries.reduce((s, m) => s + m.mood_score, 0) / entries.length
          : 0,
        trend: "stable",
      };
    } else if (route === "/safety-plan") {
      if (method === "PATCH" || method === "POST" || method === "PUT")
        space.safety = { ...space.safety, ...body };
      data = space.safety;
    } else if (route === "/verses/daily-verse") {
      const choices =
        (verses as Record<string, Row[]>)[params.mood] || verses.default;
      data = choices[new Date().getDate() % choices.length];
    } else if (route === "/conversations") {
      if (method === "POST") {
        data = {
          id: id(),
          mode: body.mode || "listen",
          title: body.title || "Companion",
          started_at: now(),
          is_active: true,
        };
        space.conversations.unshift(data);
        space.messages[data.id] = [];
      } else data = page(space.conversations);
    } else if (/^\/conversations\/[^/]+\/messages$/.test(route))
      data = page(space.messages[route.split("/")[2]] || []);
    else if (/^\/conversations\/[^/]+$/.test(route) && method === "DELETE") {
      const key = route.split("/")[2];
      space.conversations = space.conversations.filter((c) => c.id !== key);
      delete space.messages[key];
      data = null;
    } else if (route === "/admin/analytics") data = analytics(store, space);
    else if (route === "/admin/users")
      data = page(
        store.profiles
          .filter(
            (p) =>
              !params.search ||
              p.username.toLowerCase().includes(params.search.toLowerCase()),
          )
          .map((p) => profileView(p, store.spaces[p.id])),
      );
    else if (route === "/admin/users/at-risk") data = [];
    else if (/^\/admin\/users\/[^/]+\/(role|escalation)$/.test(route))
      failure(
        "Cloud roles and escalation are disconnected. Device profiles are not monitored.",
      );
    else if (route === "/admin/moderation/summary")
      data = {
        total_flagged_posts: space.posts.filter((p) => p.is_flagged).length,
        pending_review: space.posts.filter((p) => p.is_flagged && !p.is_hidden)
          .length,
        actioned_today: 0,
        high_severity_count: 0,
        flagged_posts: {
          critical: 0,
          high: 0,
          medium: 0,
          low: space.posts.filter((p) => p.is_flagged).length,
          total: space.posts.filter((p) => p.is_flagged).length,
        },
        at_risk_users: { critical: 0, high: 0, total: 0 },
        pending_escalations: 0,
      };
    else if (route === "/admin/circles/stats")
      data = {
        total_circles: space.circles.length,
        total_members: space.circles.filter((c) => c.is_member).length,
        total_posts: space.posts.length,
        active_circles: space.circles.filter((c) => c.is_member).length,
      };
    else if (route === "/circles" || route === "/admin/circles") {
      if (method === "POST") {
        data = {
          ...body,
          id: nextId(space.circles),
          member_count: 0,
          post_count: 0,
          created_at: now(),
          is_member: false,
        };
        space.circles.push(data);
      } else data = page(space.circles);
    } else if (
      /^\/(admin\/)?circles\/\d+(\/(join|leave|members))?$/.test(route)
    ) {
      const parts = route.split("/");
      const i = parts.indexOf("circles");
      const circle = find(space.circles, parts[i + 1]);
      if (parts[i + 2] === "join" || parts[i + 2] === "leave") {
        circle.is_member = parts[i + 2] === "join";
        circle.member_count = circle.is_member ? 1 : 0;
      } else if (parts[i + 2] === "members")
        data = circle.is_member ? [profileView(user, space)] : [];
      else if (method === "PATCH") Object.assign(circle, body);
      else if (method === "DELETE") {
        space.circles = space.circles.filter((c) => c.id !== circle.id);
        space.posts = space.posts.filter((p) => p.circle_id !== circle.id);
      }
      if (data === undefined) data = circle;
    } else if (/^\/posts\/circles\/\d+\/posts$/.test(route)) {
      const circle = find(space.circles, route.split("/")[3]);
      if (method === "POST") {
        if (!circle.is_member || !body.content?.trim())
          failure("Open this circle and write a note first.");
        data = {
          ...body,
          content: body.content.trim(),
          id: nextId(space.posts),
          circle_id: circle.id,
          user_id: user.id,
          author_name: body.is_anonymous ? "Anonymous" : user.username,
          reaction_count: 0,
          reply_count: 0,
          is_flagged: false,
          is_hidden: false,
          created_at: now(),
          replies: [],
        };
        space.posts.unshift(data);
        circle.post_count++;
      } else
        data = page(
          space.posts.filter(
            (p) => p.circle_id === circle.id && !p.parent_id && !p.is_hidden,
          ),
        );
    } else if (
      /^\/(posts\/posts|admin\/posts)\/\d+(\/(reply|reactions|flag|flags|hide|unhide))?$/.test(
        route,
      )
    ) {
      const parts = route.split("/");
      const post = find(space.posts, parts[3]);
      const action = parts[4];
      if (action === "reply") {
        if (!body.content?.trim()) failure("Write a reply first.");
        data = {
          ...body,
          id: nextId(space.posts),
          parent_id: post.id,
          circle_id: post.circle_id,
          created_at: now(),
          author_name: body.is_anonymous ? "Anonymous" : user.username,
          reaction_count: 0,
          reply_count: 0,
          is_flagged: false,
          is_hidden: false,
          replies: [],
        };
        space.posts.push(data);
        post.reply_count++;
      } else if (action === "reactions") {
        post.user_reaction =
          method === "DELETE" ? undefined : body.reaction_type;
        post.reaction_count = post.user_reaction ? 1 : 0;
      } else if (action === "flag") {
        post.is_flagged = true;
        post.flag_reason = body.reason;
      } else if (action === "flags")
        data = post.is_flagged
          ? [{ reason: post.flag_reason, created_at: now(), severity: "low" }]
          : [];
      else if (action === "hide" || action === "unhide")
        post.is_hidden = action === "hide" ? !post.is_hidden : false;
      else if (method === "DELETE")
        space.posts = space.posts.filter(
          (p) => p.id !== post.id && p.parent_id !== post.id,
        );
      if (data === undefined) data = post;
    } else if (route === "/admin/posts/flagged")
      data = page(
        space.posts
          .filter((p) => p.is_flagged)
          .map((p) => ({
            ...p,
            severity: "low",
            author_id: user.id,
            flag_count: 1,
            flag_severity: "low",
          })),
      );
    else if (route === "/paths" || route === "/admin/paths") {
      if (method === "POST") {
        data = {
          ...body,
          id: nextId(space.paths),
          steps: [],
          step_count: 0,
          enrollment_count: 0,
          created_at: now(),
        };
        space.paths.push(data);
      } else
        data = page(
          space.paths.filter(
            (p) =>
              (route.startsWith("/admin") || p.is_published) &&
              (!params.category || p.category === params.category) &&
              (!params.difficulty || p.difficulty === params.difficulty),
          ),
        );
    } else if (
      /^\/(admin\/)?paths\/\d+(\/(enroll|progress|reflections))?$/.test(route)
    ) {
      const parts = route.split("/");
      const i = parts.indexOf("paths");
      const pathItem = find(space.paths, parts[i + 1]);
      const action = parts[i + 2];
      if (action === "enroll")
        pathItem.user_progress ||= {
          id: nextId(space.paths),
          path_id: pathItem.id,
          current_step_index: 0,
          progress_percentage: 0,
          is_completed: false,
          started_at: now(),
          last_activity: now(),
        };
      else if (action === "progress") {
        if (!pathItem.user_progress) failure("Start this journey first.");
        const index = Math.min(
          pathItem.steps.length,
          Math.max(0, Number(body.current_step_index) || 0),
        );
        Object.assign(pathItem.user_progress, {
          current_step_index: index,
          progress_percentage: pathItem.steps.length
            ? (index / pathItem.steps.length) * 100
            : 0,
          is_completed:
            pathItem.steps.length > 0 && index === pathItem.steps.length,
          last_activity: now(),
        });
      } else if (action === "reflections")
        space.reflections.push({
          ...body,
          path_id: pathItem.id,
          created_at: now(),
        });
      else if (method === "PATCH") Object.assign(pathItem, body);
      else if (method === "DELETE")
        space.paths = space.paths.filter((p) => p.id !== pathItem.id);
      data = pathItem;
    } else if (route === "/resources") data = [];
    else if (/^\/resources\/\d+/.test(route))
      failure("No resources have been added to this device.");
    else failure(`This action is not available on this device: ${route}`);
    // Rebuild nested replies from canonical flat records, without duplicated storage.
    if (/^\/posts\/circles\/\d+\/posts$/.test(route) && method === "GET") {
      const nested = (p: Row): Row => ({
        ...p,
        replies: space.posts
          .filter((r) => r.parent_id === p.id && !r.is_hidden)
          .map(nested),
      });
      data = data.map(nested);
    }
    if (method !== "GET") write(store);
    return { data: structuredClone(data ?? null) };
  }
}
