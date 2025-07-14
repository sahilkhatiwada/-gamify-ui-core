The Complete Gamification Engine for Modern Frontend Apps

[![npm version](https://badge.fury.io/js/%40gamify-ui%2Fcore.svg)](https://badge.fury.io/js/%40gamify-ui%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-blue)](https://github.com/gamify-ui/core)

Transform users into players. Turn sessions into streaks. Make your UI unforgettable.

## 📦 Installation

```bash
npm install @gamify-ui/core
# or
yarn add @gamify-ui/core
# or
pnpm add @gamify-ui/core
```

## 🚀 Minimal Usage

```typescript
import { GamifyEngine, createUser, triggerEvent } from '@gamify-ui/core';

// Initialize the gamification engine
const gamify = new GamifyEngine({
  rules: {
    'first-click': {
      trigger: 'click',
      reward: { xp: 10, badge: 'First Steps' }
    }
  }
});

// Create a user
const user = createUser('user-123');

// Trigger an event
triggerEvent(user, 'click', { element: 'button' });
```

## 🎮 Why @gamify-ui/core Will Change the Way You Build Frontend Apps

Gamification isn't a gimmick — it's a proven strategy to boost motivation and loyalty. @gamify-ui/core gives you a developer-first, framework-agnostic engine that adapts to any frontend stack and backend.

### 🧠 Built for Developers. Loved by Users.

- **🎯 Custom Rule Engine** - Trigger XP, badges, or rewards on any event — scrolls, clicks, views, time spent, combos — all defined in simple JSON or code
- **🏆 Real-Time Leaderboards** - Show global or scoped rankings with live updates (Firebase/REST). Drive competition and virality
- **🕹️ Streaks, Missions & Daily Challenges** - Habit-building logic to increase DAUs and session frequency. Think Duolingo-style growth — now in your app
- **🧾 User Reward Logs + Export** - Let users see their growth. Export badge history to PDF/CSV — perfect for LMS, enterprise, or compliance
- **🔌 Ecosystem Integrations** - Trigger Slack/Discord alerts, sync with LMS, gamify GitHub actions, and more
- **🧠 Optional AI Add-On** - Auto-suggest missions and badges based on user behavior. Train models to maximize retention or A/B test reward timing
- **⚡ Framework Agnostic + Official Plugins** - Works with React, Vue, Angular, or plain JS. Seamless integration across stacks
- **🎨 Theming, Animation & Sound Packs** - Delight users with badge popups, XP transitions, sparkles, level-up sounds — all skinnable and theme-ready

## 🔥 What Makes @gamify-ui/core Go Viral?

- **✅ Built-in virality** - Leaderboards, social sharing triggers, community missions
- **✅ Developer-first** - Clean API, powerful hooks, reactive state, full TypeScript support
- **✅ Universally needed** - Gamification for LMS, SaaS, fitness, e-commerce, finance, education, productivity
- **✅ Share-worthy UX** - Reward animations and badge popups people want to post on LinkedIn, Twitter, Instagram
- **✅ Growth Loop Ready** - Drives return visits, higher retention, and social bragging rights

## 🎯 Advanced Features

### Custom Rule Engine

```typescript
const advancedRules = {
  'combo-master': {
    trigger: 'keypress',
    condition: {
      combo: ['ctrl', 'shift', 's'],
      timeWindow: 2000
    },
    reward: { xp: 100, badge: 'Combo Master' }
  },
  'time-spent': {
    trigger: 'session',
    condition: { duration: 300000 }, // 5 minutes
    reward: { xp: 25, streak: 1 }
  }
};
```

### Real-Time Leaderboards

```typescript
import { Leaderboard } from '@gamify-ui/core';

const leaderboard = new Leaderboard({
  scope: 'global',
  updateInterval: 5000,
  display: {
    topUsers: 10,
    showUserRank: true
  }
});

// Subscribe to updates
leaderboard.onUpdate((rankings) => {
  console.log('New rankings:', rankings);
});
```

### Streaks & Missions

```typescript
import { StreakManager, MissionSystem } from '@gamify-ui/core';

const streakManager = new StreakManager({
  types: ['daily', 'weekly', 'monthly'],
  rewards: {
    daily: { xp: 10, multiplier: 1.1 },
    weekly: { xp: 100, badge: 'Week Warrior' },
    monthly: { xp: 500, badge: 'Month Master' }
  }
});

const missionSystem = new MissionSystem({
  missions: [
    {
      id: 'first-week',
      title: 'Complete Your First Week',
      description: 'Log in for 7 consecutive days',
      goal: { type: 'streak', value: 7 },
      reward: { xp: 200, badge: 'Week Warrior' }
    }
  ]
});
```

## 🎨 Theming & Customization

```typescript
import { ThemeProvider } from '@gamify-ui/core';

const customTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  animations: {
    badgePopup: 'bounce-in 0.5s ease-out',
    xpGain: 'slide-up 0.3s ease-out'
  },
  sounds: {
    levelUp: '/sounds/level-up.mp3',
    achievement: '/sounds/achievement.mp3'
  }
};

<ThemeProvider theme={customTheme}>
  <YourApp />
</ThemeProvider>
```

## 🔌 Ecosystem Integrations

### Slack/Discord Notifications

```typescript
import { NotificationService } from '@gamify-ui/core';

const notifications = new NotificationService({
  integrations: {
    slack: {
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: '#achievements'
    },
    discord: {
      webhook: process.env.DISCORD_WEBHOOK_URL,
      channel: 'achievements'
    }
  }
});

// Automatically notify when user achieves something
notifications.onAchievement(user, achievement);
```

### LMS Integration

```typescript
import { LMSConnector } from '@gamify-ui/core';

const lmsConnector = new LMSConnector({
  platform: 'canvas', // or 'blackboard', 'moodle', etc.
  apiKey: process.env.LMS_API_KEY,
  syncOptions: {
    grades: true,
    attendance: true,
    achievements: true
  }
});
```

## 📊 Analytics & Insights

```typescript
import { Analytics } from '@gamify-ui/core';

const analytics = new Analytics({
  tracking: {
    events: true,
    conversions: true,
    retention: true
  },
  export: {
    formats: ['csv', 'pdf', 'json'],
    schedule: 'weekly'
  }
});

// Get insights
const insights = await analytics.getInsights({
  timeRange: 'last-30-days',
  metrics: ['engagement', 'retention', 'conversion']
});
```

## 🚀 Perfect For

- **EdTech & LMS Platforms** - Gamify learning paths and course completion
- **E-commerce Loyalty Programs** - Reward purchases and engagement
- **Productivity & Habit Apps** - Build streaks and daily challenges
- **Dashboards & Admin Panels** - Make data entry and management fun
- **SaaS Onboarding Journeys** - Guide users through feature discovery
- **Developer Communities** - Gamify contributions and knowledge sharing

## 📚 Documentation

- [Getting Started](https://docs.gamify-ui.com/getting-started)
- [API Reference](https://docs.gamify-ui.com/api)
- [Examples](https://docs.gamify-ui.com/examples)
- [Tutorials](https://docs.gamify-ui.com/tutorials)
- [Migration Guide](https://docs.gamify-ui.com/migration)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Make It Go Viral

Tag your product with **#gamify-ui**, share your gamified UI screenshots, and challenge others to beat your leaderboard.

Let's make UI fun again — and unforgettable.

---

**Ready to level up your app?**  
Get started with @gamify-ui/core today and join the global gamification movement.

[![Star on GitHub](https://img.shields.io/github/stars/gamify-ui/core?style=social)](https://github.com/gamify-ui/core)
[![Follow on Twitter](https://img.shields.io/twitter/follow/gamify_ui?style=social)](https://twitter.com/gamify_ui)
[![Join Discord](https://img.shields.io/discord/1234567890?style=flat&logo=discord)](https://discord.gg/gamify-ui)