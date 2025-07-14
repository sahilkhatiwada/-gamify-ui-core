# @gamify-ui/core Architecture

This document explains the clean, maintainable architecture of the @gamify-ui/core package.

## 🏗️ Overall Architecture

The package follows a **clean architecture** pattern with clear separation of concerns:

```
src/
├── core/           # Core business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── hooks/          # React hooks
├── components/     # React components
└── index.ts        # Main entry point
```

## 📁 Folder Structure

### `/core` - Core Business Logic

The core folder contains the main gamification engine and its managers:

- **`GamifyEngine.ts`** - Main orchestrator class
- **`UserManager.ts`** - User management operations
- **`EventProcessor.ts`** - Event processing and reward application
- **`RuleEngine.ts`** - Game rule management
- **`MissionManager.ts`** - Mission and achievement tracking
- **`PluginManager.ts`** - Plugin system management
- **`ThemeManager.ts`** - Theme configuration

### `/types` - TypeScript Definitions

All TypeScript interfaces and types are centralized here:

- **`index.ts`** - All type exports
- Core types: `User`, `Badge`, `Achievement`, `Streak`
- Event types: `GameEvent`, `EventTrigger`, `EventCondition`
- Configuration types: `GamifyConfig`, `Theme`
- Hook types: `GamifyHookReturn`

### `/utils` - Utility Functions

Organized by functionality:

- **`user.ts`** - User-related utilities
- **`ui.ts`** - UI and styling utilities
- **`date.ts`** - Date and time utilities
- **`index.ts`** - Centralized exports

### `/hooks` - React Hooks

React-specific functionality:

- **`useGamify.ts`** - Main hook and related hooks
- **`GamifyProvider`** - Context provider

### `/components` - React Components

UI components:

- **`ThemeProvider.tsx`** - Theme context provider

## 🧩 Core Components

### GamifyEngine

The main orchestrator class that coordinates all gamification features:

```typescript
export class GamifyEngine {
  private readonly userManager: UserManager;
  private readonly eventProcessor: EventProcessor;
  private readonly ruleEngine: RuleEngine;
  // ... other managers

  constructor(config: GamifyConfig = {}) {
    // Initialize managers
    // Set up event streams
    // Configure theme
  }

  // Public API methods
  createUser(id: string, name?: string, email?: string): User
  triggerEvent(userId: string, eventType: string, data?: Record<string, any>): void
  addRule(rule: GameRule): void
  // ... other methods
}
```

**Key Features:**
- **Separation of Concerns**: Each manager handles a specific domain
- **Dependency Injection**: Managers are injected into the main engine
- **Event-Driven**: Uses RxJS observables for real-time updates
- **Configurable**: Accepts configuration for customization

### UserManager

Handles all user-related operations:

```typescript
export class UserManager {
  private readonly users = new Map<string, User>();

  createUser(id: string, name?: string, email?: string): User
  getUser(id: string): User | undefined
  updateUser(id: string, updates: Partial<User>): User | null
  addXp(userId: string, xp: number): User | null
  addBadge(userId: string, badge: Badge): User | null
  // ... other methods
}
```

**Key Features:**
- **In-Memory Storage**: Uses Map for fast lookups
- **Immutable Updates**: Returns new user objects
- **Validation**: Checks for existing users/badges
- **Level Calculation**: Automatic level progression

### EventProcessor

Processes game events and applies rewards:

```typescript
export class EventProcessor {
  constructor(
    private readonly userManager: UserManager,
    private readonly ruleEngine: RuleEngine,
    private readonly missionManager: MissionManager
  ) {}

  processEvent(event: GameEvent, user: User): void
  private evaluateCondition(condition: any, event: GameEvent): boolean
  private applyReward(user: User, reward: Reward): void
}
```

**Key Features:**
- **Condition Evaluation**: Flexible condition checking
- **Reward Application**: Centralized reward logic
- **Mission Integration**: Automatic mission checking
- **Extensible**: Easy to add new condition types

### RuleEngine

Manages game rules and their evaluation:

```typescript
export class RuleEngine {
  private readonly rules = new Map<string, GameRule>();

  addRule(rule: GameRule): void
  removeRule(ruleId: string): boolean
  getApplicableRules(event: GameEvent): GameRule[]
  enableRule(ruleId: string): boolean
  disableRule(ruleId: string): boolean
  // ... other methods
}
```

**Key Features:**
- **Rule Management**: Add, remove, enable, disable rules
- **Priority System**: Rules are sorted by priority
- **Event Filtering**: Only applicable rules are evaluated
- **Performance**: Fast rule lookup and filtering

## 🔧 Design Patterns

### 1. Manager Pattern

Each domain has its own manager class:

```typescript
// Example: UserManager
export class UserManager {
  private readonly users = new Map<string, User>();
  
  // Public API methods
  createUser(id: string, name?: string, email?: string): User
  getUser(id: string): User | undefined
  // ... other methods
  
  // Private helper methods
  private checkLevelUp(user: User): void
  private calculateXpForLevel(level: number): number
}
```

**Benefits:**
- **Single Responsibility**: Each manager has one job
- **Encapsulation**: Internal state is private
- **Testability**: Easy to unit test individual managers
- **Maintainability**: Changes are isolated to specific managers

### 2. Observer Pattern

Uses RxJS observables for real-time updates:

```typescript
// Event streams
private readonly eventStream = new Subject<GameEvent>();
private readonly userStream = new Subject<User>();

// Public observables
onEvent(): Observable<GameEvent>
onUserUpdate(): Observable<User>
onLevelUp(): Observable<User>
onAchievement(): Observable<{ user: User; achievement: Achievement }>
```

**Benefits:**
- **Real-time Updates**: Components can react to changes
- **Decoupling**: Components don't need to poll for updates
- **Composability**: Multiple observables can be combined
- **Memory Management**: Automatic cleanup with subscriptions

### 3. Factory Pattern

Creates objects with consistent structure:

```typescript
// Example: Badge creation
private createBadge(name: string): Badge {
  return {
    id: uuidv4(),
    name,
    description: `Earned ${name} badge`,
    rarity: 'common',
    earnedAt: new Date()
  };
}
```

**Benefits:**
- **Consistency**: All badges have the same structure
- **Flexibility**: Easy to modify creation logic
- **Reusability**: Can be used in multiple places

### 4. Strategy Pattern

Flexible condition evaluation:

```typescript
private evaluateCondition(condition: any, event: GameEvent): boolean {
  if (!condition) return true;

  // Custom condition function
  if (condition.custom) {
    return condition.custom(event);
  }

  // Threshold condition
  if (condition.threshold && event.data?.value) {
    return event.data.value >= condition.threshold;
  }

  // Combo condition
  if (condition.combo && event.data?.keys) {
    return condition.combo.every(key => event.data.keys.includes(key));
  }

  return true;
}
```

**Benefits:**
- **Extensibility**: Easy to add new condition types
- **Flexibility**: Supports custom condition functions
- **Maintainability**: Each condition type is handled separately

## 🎯 Code Quality Principles

### 1. Single Responsibility Principle

Each class and function has one clear purpose:

```typescript
// ✅ Good: Single responsibility
export class UserManager {
  // Only handles user operations
}

// ❌ Bad: Multiple responsibilities
export class GamifyEngine {
  // Handles users, events, rules, missions, etc.
}
```

### 2. Dependency Inversion

High-level modules don't depend on low-level modules:

```typescript
// ✅ Good: Dependencies are injected
export class EventProcessor {
  constructor(
    private readonly userManager: UserManager,
    private readonly ruleEngine: RuleEngine,
    private readonly missionManager: MissionManager
  ) {}
}

// ❌ Bad: Direct instantiation
export class EventProcessor {
  private userManager = new UserManager();
  private ruleEngine = new RuleEngine();
}
```

### 3. Interface Segregation

Clients don't depend on interfaces they don't use:

```typescript
// ✅ Good: Specific interfaces
interface UserOperations {
  createUser(id: string): User;
  getUser(id: string): User | undefined;
}

interface EventOperations {
  triggerEvent(userId: string, eventType: string): void;
}

// ❌ Bad: Large interface
interface GamifyEngine {
  // 50+ methods that clients might not need
}
```

### 4. Open/Closed Principle

Open for extension, closed for modification:

```typescript
// ✅ Good: Extensible through plugins
export class PluginManager {
  install(plugin: GamifyPlugin): void {
    plugin.install(this);
  }
}

// ❌ Bad: Hard to extend
export class GamifyEngine {
  // All functionality is hardcoded
}
```

## 🧪 Testing Strategy

### Unit Testing

Each manager can be tested independently:

```typescript
describe('UserManager', () => {
  let userManager: UserManager;

  beforeEach(() => {
    userManager = new UserManager();
  });

  it('should create a user', () => {
    const user = userManager.createUser('user-1', 'John');
    expect(user.id).toBe('user-1');
    expect(user.name).toBe('John');
  });

  it('should add XP to user', () => {
    const user = userManager.createUser('user-1');
    const updatedUser = userManager.addXp('user-1', 100);
    expect(updatedUser?.xp).toBe(100);
  });
});
```

### Integration Testing

Test the interaction between managers:

```typescript
describe('EventProcessor Integration', () => {
  let eventProcessor: EventProcessor;
  let userManager: UserManager;
  let ruleEngine: RuleEngine;

  beforeEach(() => {
    userManager = new UserManager();
    ruleEngine = new RuleEngine();
    eventProcessor = new EventProcessor(userManager, ruleEngine);
  });

  it('should process event and apply reward', () => {
    // Test setup
    // Event processing
    // Assertions
  });
});
```

## 📈 Performance Considerations

### 1. Memory Management

- **Map Usage**: Fast lookups for users and rules
- **Observable Cleanup**: Automatic subscription cleanup
- **Object Pooling**: Reuse objects where possible

### 2. Event Processing

- **Priority Queue**: Rules are sorted by priority
- **Early Exit**: Stop processing after first matching rule
- **Conditional Evaluation**: Only evaluate relevant conditions

### 3. Caching

- **Level Calculations**: Cache XP requirements
- **User Lookups**: Fast user retrieval
- **Rule Filtering**: Pre-filter rules by event type

## 🔄 Future Extensibility

### 1. Plugin System

Easy to add new features through plugins:

```typescript
interface GamifyPlugin {
  name: string;
  version: string;
  install: (engine: GamifyEngine) => void;
  uninstall?: (engine: GamifyEngine) => void;
}
```

### 2. Custom Conditions

Extensible condition system:

```typescript
interface EventCondition {
  threshold?: number;
  combo?: string[];
  timeWindow?: number;
  duration?: number;
  custom?: (event: GameEvent) => boolean; // Extensible
}
```

### 3. Custom Rewards

Flexible reward system:

```typescript
interface Reward {
  xp?: number;
  badge?: string | Badge;
  streak?: number;
  multiplier?: number;
  custom?: (user: User) => void; // Extensible
}
```

## 📚 Best Practices

### 1. Error Handling

```typescript
// ✅ Good: Specific error messages
if (!user) {
  throw new Error(`User ${userId} not found`);
}

// ❌ Bad: Generic error
if (!user) {
  throw new Error('User not found');
}
```

### 2. Type Safety

```typescript
// ✅ Good: Strong typing
export function createUser(id: string, name?: string, email?: string): User

// ❌ Bad: Weak typing
export function createUser(id: any, name?: any, email?: any): any
```

### 3. Documentation

```typescript
/**
 * Create a new user in the gamification system
 * @param id - Unique user identifier
 * @param name - Optional user display name
 * @param email - Optional user email
 * @returns Newly created user object
 */
createUser(id: string, name?: string, email?: string): User
```

### 4. Immutability

```typescript
// ✅ Good: Return new objects
updateUser(id: string, updates: Partial<User>): User | null {
  const user = this.users.get(id);
  if (!user) return null;

  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  this.users.set(id, updatedUser);
  return updatedUser;
}

// ❌ Bad: Mutate existing objects
updateUser(id: string, updates: Partial<User>): User | null {
  const user = this.users.get(id);
  if (!user) return null;

  Object.assign(user, updates);
  user.updatedAt = new Date();
  return user;
}
```

This architecture ensures the code is **clean**, **maintainable**, **testable**, and **extensible** for future development. 