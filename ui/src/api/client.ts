/**
 * Compatibility facade over on-device Flints data. No remote backend.
 */

import { LocalClient, SESSION_KEY } from "../data/local-store";

class ApiClient {
  private client = new LocalClient();
  private token: string | null = localStorage.getItem(SESSION_KEY);

  // Auth methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem(SESSION_KEY, token);
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem(SESSION_KEY);
  }

  getToken() {
    return this.token;
  }

  // Authentication
  async createAnonymousSession(privacyConsent: boolean = true) {
    const response = await this.client.post("/auth/anonymous-session", {
      privacy_consent: privacyConsent,
    });
    this.setToken(response.data.access_token);
    return response.data;
  }

  async register(
    username: string,
    email: string,
    password: string,
    anonymousToken?: string,
  ) {
    const response = await this.client.post("/auth/register", {
      username,
      email,
      password,
      privacy_consent: true,
      anonymous_token: anonymousToken,
    });
    this.setToken(response.data.access_token);
    return response.data;
  }

  async login(identifier: string, password: string) {
    const response = await this.client.post("/auth/login", {
      identifier,
      password,
    });
    this.setToken(response.data.access_token);
    return response.data;
  }

  async logout() {
    await this.client.post("/auth/logout");
    this.clearAuth();
  }

  // Mood tracking
  async logMood(
    moodScore: number,
    emotions: string[],
    activities?: string[],
    notes?: string,
  ) {
    const response = await this.client.post("/mood", {
      mood_score: moodScore,
      emotions,
      activities,
      notes,
    });
    return response.data;
  }

  async getMoodHistory(days: number = 7) {
    const response = await this.client.get(`/mood/history?days=${days}`);
    return response.data;
  }

  // Profile
  async getProfile() {
    const response = await this.client.get("/profile");
    return response.data;
  }

  async updateProfile(username?: string, email?: string) {
    const response = await this.client.patch("/profile", {
      username,
      email,
    });
    return response.data;
  }

  async getMilestones() {
    const response = await this.client.get("/profile/milestones");
    return response.data;
  }

  // Safety Plan
  async getSafetyPlan() {
    const response = await this.client.get("/safety-plan");
    return response.data;
  }

  async updateSafetyPlan(data: any) {
    const response = await this.client.put("/safety-plan", data);
    return response.data;
  }

  // Verses
  async getDailyVerse(mood: string) {
    const response = await this.client.get(`/verses/daily-verse?mood=${mood}`);
    return response.data;
  }

  // Conversations
  async createConversation(
    mode: "listen" | "reflect" | "ground",
    title?: string,
  ) {
    const response = await this.client.post("/conversations", {
      mode,
      title,
    });
    return response.data;
  }

  async getConversations(skip: number = 0, limit: number = 20) {
    const response = await this.client.get(
      `/conversations?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  }

  async getConversationMessages(
    conversationId: string,
    skip: number = 0,
    limit: number = 50,
  ) {
    const response = await this.client.get(
      `/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  }

  async deleteConversation(conversationId: string) {
    await this.client.delete(`/conversations/${conversationId}`);
  }

  // Circles
  async getCircles(skip: number = 0, limit: number = 20) {
    const response = await this.client.get(
      `/circles?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  }

  async getCircle(circleId: number) {
    const response = await this.client.get(`/circles/${circleId}`);
    return response.data;
  }

  async createCircle(
    name: string,
    topic: string,
    description: string,
    icon?: string,
  ) {
    const response = await this.client.post("/circles", {
      name,
      topic,
      description,
      icon,
    });
    return response.data;
  }

  async joinCircle(circleId: number) {
    await this.client.post(`/circles/${circleId}/join`);
  }

  async leaveCircle(circleId: number) {
    await this.client.delete(`/circles/${circleId}/leave`);
  }

  async getCircleMembers(
    circleId: number,
    skip: number = 0,
    limit: number = 50,
  ) {
    const response = await this.client.get(
      `/circles/${circleId}/members?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  }

  // Posts
  async getCirclePosts(circleId: number, skip: number = 0, limit: number = 20) {
    const response = await this.client.get(
      `/posts/circles/${circleId}/posts?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  }

  async createPost(
    circleId: number,
    content: string,
    isAnonymous: boolean = false,
  ) {
    const response = await this.client.post(
      `/posts/circles/${circleId}/posts`,
      {
        content,
        is_anonymous: isAnonymous,
      },
    );
    return response.data;
  }

  async replyToPost(
    postId: number,
    content: string,
    isAnonymous: boolean = false,
  ) {
    const response = await this.client.post(`/posts/posts/${postId}/reply`, {
      parent_id: postId,
      content,
      is_anonymous: isAnonymous,
    });
    return response.data;
  }

  async addReaction(postId: number, reactionType: string = "relate") {
    await this.client.post(`/posts/posts/${postId}/reactions`, {
      reaction_type: reactionType,
    });
  }

  async removeReaction(postId: number) {
    await this.client.delete(`/posts/posts/${postId}/reactions`);
  }

  async flagPost(postId: number, reason: string) {
    await this.client.post(`/posts/posts/${postId}/flag`, { reason });
  }

  // Paths
  async getPaths(
    category?: string,
    difficulty?: string,
    skip: number = 0,
    limit: number = 20,
  ) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (difficulty) params.append("difficulty", difficulty);
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());

    const response = await this.client.get(`/paths?${params.toString()}`);
    return response.data;
  }

  async getPathDetail(pathId: number) {
    const response = await this.client.get(`/paths/${pathId}`);
    return response.data;
  }

  async enrollInPath(pathId: number) {
    const response = await this.client.post(`/paths/${pathId}/enroll`);
    return response.data;
  }

  async updatePathProgress(
    pathId: number,
    currentStepIndex: number,
    completedSteps?: any,
  ) {
    const response = await this.client.patch(`/paths/${pathId}/progress`, {
      current_step_index: currentStepIndex,
      completed_steps: completedSteps,
    });
    return response.data;
  }

  async saveStepReflection(
    pathId: number,
    stepId: number,
    reflection: string,
    moodRating?: number,
  ) {
    await this.client.post(`/paths/${pathId}/reflections`, {
      step_id: stepId,
      reflection,
      mood_rating: moodRating,
    });
  }

  // Resources
  async getResources(
    resourceType?: string,
    category?: string,
    difficulty?: string,
    skip: number = 0,
    limit: number = 20,
  ) {
    const params = new URLSearchParams();
    if (resourceType) params.append("resource_type", resourceType);
    if (category) params.append("category", category);
    if (difficulty) params.append("difficulty", difficulty);
    params.append("skip", skip.toString());
    params.append("limit", limit.toString());

    const response = await this.client.get(`/resources?${params.toString()}`);
    return response.data;
  }

  async getResource(resourceId: number) {
    const response = await this.client.get(`/resources/${resourceId}`);
    return response.data;
  }

  async markResourceHelpful(resourceId: number) {
    await this.client.post(`/resources/${resourceId}/helpful`);
  }

  // Admin
  async getFlaggedPosts(skip: number = 0, limit: number = 50) {
    const response = await this.client.get(
      `/admin/posts/flagged?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  }

  async hidePost(postId: number) {
    await this.client.patch(`/admin/posts/${postId}/hide`);
  }

  async unhidePost(postId: number) {
    await this.client.patch(`/admin/posts/${postId}/unhide`);
  }

  async getAnalytics() {
    const response = await this.client.get("/admin/analytics");
    return response.data;
  }

  // ============================================
  // PHASE 3: Admin & Moderation APIs
  // ============================================

  // Admin - Circle Management
  async adminCreateCircle(circleData: {
    name: string;
    topic: string;
    description: string;
    icon?: string;
  }) {
    const response = await this.client.post("/admin/circles", circleData);
    return response.data;
  }

  async adminUpdateCircle(
    circleId: string,
    circleData: {
      name: string;
      topic: string;
      description: string;
      icon?: string;
    },
  ) {
    const response = await this.client.patch(
      `/admin/circles/${circleId}`,
      circleData,
    );
    return response.data;
  }

  async adminDeleteCircle(circleId: string) {
    await this.client.delete(`/admin/circles/${circleId}`);
  }

  async adminGetCircleStats() {
    const response = await this.client.get("/admin/circles/stats");
    return response.data;
  }

  // Admin - Path Management
  async adminGetPaths(skip: number = 0, limit: number = 50) {
    const response = await this.client.get("/admin/paths", {
      params: { skip, limit },
    });
    return response.data;
  }

  async adminCreatePath(pathData: any) {
    const response = await this.client.post("/admin/paths", pathData);
    return response.data;
  }

  async adminUpdatePath(pathId: string, pathData: any) {
    const response = await this.client.patch(
      `/admin/paths/${pathId}`,
      pathData,
    );
    return response.data;
  }

  async adminDeletePath(pathId: string) {
    await this.client.delete(`/admin/paths/${pathId}`);
  }

  async adminTogglePathPublish(pathId: string, isPublished: boolean) {
    const response = await this.client.patch(`/admin/paths/${pathId}`, {
      is_published: isPublished,
    });
    return response.data;
  }

  // Admin - User Management
  async adminGetUsers(search?: string, skip: number = 0, limit: number = 50) {
    const response = await this.client.get("/admin/users", {
      params: { search, skip, limit },
    });
    return response.data;
  }

  async adminGetAtRiskUsers(
    riskLevel: string = "high",
    skip: number = 0,
    limit: number = 50,
  ) {
    const response = await this.client.get("/admin/users/at-risk", {
      params: { risk_level: riskLevel, skip, limit },
    });
    return response.data;
  }

  async adminUpdateUserRole(userId: string, role: string) {
    const response = await this.client.patch(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  }

  async adminUpdateEscalationStatus(
    userId: string,
    status: string,
    notes?: string,
  ) {
    const response = await this.client.patch(
      `/admin/users/${userId}/escalation`,
      {
        status_update: status,
        notes,
      },
    );
    return response.data;
  }

  // Admin - Moderation Summary
  async adminGetModerationSummary() {
    const response = await this.client.get("/admin/moderation/summary");
    return response.data;
  }

  async adminGetAnalytics() {
    const response = await this.client.get("/admin/analytics");
    return response.data;
  }

  async adminGetFlaggedPosts(
    severity?: string,
    skip: number = 0,
    limit: number = 50,
  ) {
    const params: any = { skip, limit };
    if (severity) params.severity = severity;

    const response = await this.client.get("/admin/posts/flagged", { params });
    return response.data;
  }

  async adminTogglePostHidden(postId: number) {
    const response = await this.client.patch(`/admin/posts/${postId}/hide`);
    return response.data;
  }

  async adminDeletePost(postId: number) {
    await this.client.delete(`/admin/posts/${postId}`);
  }

  async adminGetPostFlags(postId: number) {
    const response = await this.client.get(`/admin/posts/${postId}/flags`);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export interface User {
  id: string;
  username: string;
  email?: string;
  is_anonymous: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface MoodEntry {
  id: string;
  mood_score: number;
  emotions: string[];
  activities?: string[];
  notes?: string;
  created_at: string;
}

export interface MoodHistory {
  entries: MoodEntry[];
  total_entries: number;
  average_score: number;
  trend: "improving" | "stable" | "declining";
}

export interface Profile {
  user: User;
  streak_days: number;
  total_mood_entries: number;
  total_conversations: number;
  milestone_count: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  milestone_type: string;
  awarded_at: string;
}

export interface Conversation {
  id: string;
  title?: string;
  mode: "listen" | "reflect" | "ground";
  started_at: string;
  ended_at?: string;
  is_active: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sentiment_score?: number;
  emotion_tags?: string[];
  created_at: string;
}

// Phase 2 Types
export interface Circle {
  id: number;
  name: string;
  topic: string;
  description: string;
  icon?: string;
  member_count: number;
  post_count: number;
  created_at: string;
  is_member?: boolean;
  is_moderator?: boolean;
}

export interface Post {
  id: number;
  circle_id: number;
  user_id?: number;
  parent_id?: number;
  content: string;
  is_anonymous: boolean;
  reaction_count: number;
  reply_count: number;
  is_flagged: boolean;
  is_hidden: boolean;
  created_at: string;
  author_name?: string;
  replies?: Post[];
  user_reaction?: string;
  circle_name?: string; // Added for display purposes
}

export interface Path {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  estimated_duration?: number; // In days
  step_count: number;
  enrollment_count: number;
  created_at: string;
  steps?: PathStep[];
  user_progress?: PathProgress;
}

export interface PathStep {
  id: number;
  path_id: number;
  title: string;
  content: string;
  order_index: number;
  step_type: string;
  estimated_minutes?: number;
  prompts?: any;
  resources?: any;
}

export interface PathProgress {
  id: number;
  path_id: number;
  current_step_index: number;
  progress_percentage: number;
  is_completed: boolean;
  started_at: string;
  completed_at?: string;
  last_activity: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  resource_type: string;
  category: string;
  url?: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  difficulty?: string;
  tags?: string[];
  view_count: number;
  helpful_count: number;
  created_at: string;
}

export interface Analytics {
  users: {
    total: number;
    registered: number;
    anonymous: number;
    new_this_week: number;
  };
  circles: {
    total: number;
  };
  posts: {
    total: number;
    flagged: number;
  };
  paths: {
    total: number;
    active_enrollments: number;
  };
  mood_tracking: {
    total_entries: number;
    avg_mood_this_week: number;
  };
  conversations: {
    total: number;
  };
}
