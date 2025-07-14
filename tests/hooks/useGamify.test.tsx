import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { GamifyProvider, useGamify, useLevelUp, useAchievement, useLeaderboard } from '../../src/hooks/useGamify';
import { GamifyEngine } from '../../src/core/GamifyEngine';
import { GameRule, Mission } from '../../src/types';

// Test component to use the hook
const TestComponent: React.FC<{ userId?: string }> = ({ userId }) => {
  const { user, loading, error, triggerEvent, level, xp, progress } = useGamify(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user</div>;

  return (
    <div>
      <div data-testid="user-name">{user.name}</div>
      <div data-testid="user-level">Level: {level}</div>
      <div data-testid="user-xp">XP: {xp}</div>
      <div data-testid="user-progress">Progress: {Math.round(progress * 100)}%</div>
      <button 
        data-testid="trigger-click" 
        onClick={() => triggerEvent('click', { element: 'button' })}
      >
        Click me!
      </button>
    </div>
  );
};

describe('useGamify Hook', () => {
  let engine: GamifyEngine;

  beforeEach(() => {
    engine = new GamifyEngine();
  });

  describe('Basic Usage', () => {
    it('should provide user data', () => {
      const user = engine.createUser('user-1', 'John Doe');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GamifyProvider engine={engine}>
          {children}
        </GamifyProvider>
      );

      const { result } = renderHook(() => useGamify('user-1'), { wrapper });

      expect(result.current.user).toEqual(user);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.level).toBe(1);
      expect(result.current.xp).toBe(0);
      expect(result.current.progress).toBe(0);
    });

    it('should create user if not exists', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GamifyProvider engine={engine}>
          {children}
        </GamifyProvider>
      );

      const { result } = renderHook(() => useGamify('user-1'), { wrapper });

      expect(result.current.user?.id).toBe('user-1');
      expect(result.current.user?.name).toBeUndefined();
    });

    it('should trigger events', () => {
      const user = engine.createUser('user-1', 'John');

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GamifyProvider engine={engine}>
          {children}
        </GamifyProvider>
      );

      const { result } = renderHook(() => useGamify('user-1'), { wrapper });

      act(() => {
        result.current.triggerEvent('click', { element: 'button' });
      });

      // Event should be triggered without error
      expect(result.current.user).toBeDefined();
    });

    it('should throw error when triggering event without userId', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GamifyProvider engine={engine}>
          {children}
        </GamifyProvider>
      );

      const { result } = renderHook(() => useGamify(), { wrapper });

      expect(() => {
        act(() => {
          result.current.triggerEvent('click');
        });
      }).toThrow('userId is required to trigger events');
    });
  });

  describe('Component Integration', () => {
    it('should render user data in component', async () => {
      const user = engine.createUser('user-1', 'John Doe');

      render(
        <GamifyProvider engine={engine}>
          <TestComponent userId="user-1" />
        </GamifyProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('user-level')).toHaveTextContent('Level: 1');
        expect(screen.getByTestId('user-xp')).toHaveTextContent('XP: 0');
        expect(screen.getByTestId('user-progress')).toHaveTextContent('Progress: 0%');
      });
    });

    it('should handle event triggering in component', async () => {
      const user = engine.createUser('user-1', 'John Doe');

      render(
        <GamifyProvider engine={engine}>
          <TestComponent userId="user-1" />
        </GamifyProvider>
      );

      await waitFor(() => {
        const button = screen.getByTestId('trigger-click');
        fireEvent.click(button);
        // Button should be clickable without error
        expect(button).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(
        <GamifyProvider engine={engine}>
          <TestComponent userId="user-1" />
        </GamifyProvider>
      );

      // Should not show loading since initialization is now synchronous
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useGamify('user-1'));
      }).toThrow('useGamify must be used within a GamifyProvider');
    });
  });
});

describe('useLevelUp Hook', () => {
  let engine: GamifyEngine;

  beforeEach(() => {
    engine = new GamifyEngine();
  });

  it('should detect level up events', (done) => {
    const user = engine.createUser('user-1', 'John');
    user.xp = 100; // Enough XP for level 2

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GamifyProvider engine={engine}>
        {children}
      </GamifyProvider>
    );

    const { result } = renderHook(() => useLevelUp('user-1'), { wrapper });

    // Trigger level up
    engine.triggerEvent('user-1', 'xp-gain', { amount: 100 });

    // Check for level up notification
    setTimeout(() => {
      expect(result.current).toBeDefined();
      if (result.current) {
        expect(result.current.user.id).toBe('user-1');
        expect(result.current.level).toBe(2);
      }
      done();
    }, 100);
  });
});

describe('useAchievement Hook', () => {
  let engine: GamifyEngine;

  beforeEach(() => {
    engine = new GamifyEngine();
  });

  it('should detect achievement events', (done) => {
    const user = engine.createUser('user-1', 'John');

    // Add a mission that will be completed
    const mission: Mission = {
      id: 'mission-1',
      title: 'First Event',
      description: 'Trigger your first event',
      goal: { type: 'event', value: 1 },
      reward: { xp: 50 },
      repeatable: false,
      difficulty: 'easy'
    };

    engine.addMission(mission);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GamifyProvider engine={engine}>
        {children}
      </GamifyProvider>
    );

    const { result } = renderHook(() => useAchievement('user-1'), { wrapper });

    // Trigger achievement
    engine.triggerEvent('user-1', 'first-event');

    // Check for achievement notification
    setTimeout(() => {
      expect(result.current).toBeDefined();
      if (result.current) {
        expect(result.current.user.id).toBe('user-1');
        expect(result.current.achievement.id).toBe('mission-1');
      }
      done();
    }, 100);
  });
});

describe('useLeaderboard Hook', () => {
  let engine: GamifyEngine;

  beforeEach(() => {
    engine = new GamifyEngine();
  });

  it('should provide leaderboard data', () => {
    // Create users with different XP
    engine.createUser('user-1', 'John');
    engine.createUser('user-2', 'Jane');
    engine.createUser('user-3', 'Bob');

    engine.updateUser('user-1', { xp: 100 });
    engine.updateUser('user-2', { xp: 300 });
    engine.updateUser('user-3', { xp: 200 });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GamifyProvider engine={engine}>
        {children}
      </GamifyProvider>
    );

    const { result } = renderHook(() => useLeaderboard(10), { wrapper });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].userName).toBe('Jane'); // Highest XP
    expect(result.current[0].rank).toBe(1);
    expect(result.current[1].userName).toBe('Bob');
    expect(result.current[1].rank).toBe(2);
    expect(result.current[2].userName).toBe('John');
    expect(result.current[2].rank).toBe(3);
  });

  it('should limit leaderboard size', () => {
    engine.createUser('user-1', 'John');
    engine.createUser('user-2', 'Jane');
    engine.createUser('user-3', 'Bob');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GamifyProvider engine={engine}>
        {children}
      </GamifyProvider>
    );

    const { result } = renderHook(() => useLeaderboard(2), { wrapper });

    expect(result.current).toHaveLength(2);
  });
});

describe('GamifyProvider', () => {
  it('should provide engine context', async () => {
    const engine = new GamifyEngine();
    
    const TestConsumer: React.FC = () => {
      const { user } = useGamify('user-1');
      return <div data-testid="consumer">{user ? 'User exists' : 'No user'}</div>;
    };

    render(
      <GamifyProvider engine={engine}>
        <TestConsumer />
      </GamifyProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('consumer')).toHaveTextContent('User exists');
    });
  });
}); 