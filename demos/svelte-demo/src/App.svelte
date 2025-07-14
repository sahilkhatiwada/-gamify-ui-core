<script lang="ts">
  import { onMount } from 'svelte';
  import { GamifyEngine } from '@gamify-ui/core';

  // Initialize the gamification engine
  const engine = new GamifyEngine({
    debug: true,
    theme: {
      colors: {
        primary: '#646cff',
        secondary: '#535bf2',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    }
  });

  // Reactive state
  let user: any = null;
  let levelProgress = { current: 0, next: 100, progress: 0 };
  let achievements: any[] = [];
  let engagementScore = 0;
  let totalActions = 0;
  let notification = '';

  // Create user on mount
  onMount(() => {
    const userId = 'svelte-demo-user';
    user = engine.createUser(userId, 'Svelte Player', 'svelte@example.com');
    
    // Start analytics session
    engine.startSession(userId);
    
    // Set up event listeners
    engine.onLevelUp().subscribe((updatedUser) => {
      if (updatedUser.id === userId) {
        showNotification(`🎉 Level Up! You're now level ${updatedUser.level}!`);
        updateUserData();
      }
    });
    
    engine.onAchievement().subscribe((data) => {
      if (data.user.id === userId) {
        showNotification(`🏆 Achievement Unlocked: ${data.achievement.title}!`);
        updateUserData();
      }
    });
    
    // Initial data update
    updateUserData();
  });

  // Update user data
  function updateUserData() {
    if (user) {
      levelProgress = engine.getLevelProgress(user);
      achievements = engine.getUserAchievements(user.id);
      engagementScore = engine.getEngagementScore(user.id);
      
      // Get user metrics for total actions
      const metrics = engine.getUserMetrics(user.id);
      totalActions = metrics?.totalXp || 0;
    }
  }

  // Actions
  function performAction(actionType: string, xp: number) {
    if (!user) return;
    
    engine.triggerEvent(user.id, actionType, { xp });
    showNotification(`+${xp} XP for ${actionType}!`);
    updateUserData();
  }

  function showNotification(message: string) {
    notification = message;
    setTimeout(() => {
      notification = '';
    }, 3000);
  }
</script>

<main>
  <h1>🎮 Gamify Svelte Demo</h1>
  <p>Experience the power of gamification with Svelte!</p>
  
  <div class="gamify-container">
    <!-- User Panel -->
    <div class="user-panel">
      <h2>👤 User Profile</h2>
      {#if user}
        <h3>{user.name || 'Anonymous Player'}</h3>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{user.level}</div>
            <div class="stat-label">Level</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{user.xp}</div>
            <div class="stat-label">XP</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{user.badges.length}</div>
            <div class="stat-label">Badges</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{user.achievements.length}</div>
            <div class="stat-label">Achievements</div>
          </div>
        </div>
        
        <div>
          <strong>Progress to Level {user.level + 1}</strong>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              style="width: {levelProgress.progress * 100}%"
            ></div>
          </div>
          <small>{levelProgress.current} / {levelProgress.next} XP</small>
        </div>
        
        {#if user.badges.length > 0}
          <h4>🏆 Recent Badges</h4>
          <div class="achievements-list">
            {#each user.badges.slice(-3) as badge}
              <div class="achievement-card">
                <div class="achievement-title">{badge.name}</div>
                <div class="achievement-desc">{badge.description}</div>
              </div>
            {/each}
          </div>
        {/if}
      {:else}
        <p>Loading user data...</p>
      {/if}
    </div>
    
    <!-- Actions Panel -->
    <div class="actions-panel">
      <h2>🎯 Actions</h2>
      <p>Click buttons to earn XP and progress!</p>
      
      <div>
        <button 
          class="action-button" 
          on:click={() => performAction('click', 10)}
        >
          🖱️ Click (10 XP)
        </button>
        
        <button 
          class="action-button" 
          on:click={() => performAction('scroll', 5)}
        >
          📜 Scroll (5 XP)
        </button>
        
        <button 
          class="action-button" 
          on:click={() => performAction('share', 25)}
        >
          📤 Share (25 XP)
        </button>
        
        <button 
          class="action-button" 
          on:click={() => performAction('comment', 15)}
        >
          💬 Comment (15 XP)
        </button>
        
        <button 
          class="action-button" 
          on:click={() => performAction('like', 8)}
        >
          ❤️ Like (8 XP)
        </button>
        
        <button 
          class="action-button" 
          on:click={() => performAction('complete_task', 50)}
        >
          ✅ Complete Task (50 XP)
        </button>
      </div>
      
      <div style="margin-top: 2rem;">
        <h3>📊 Analytics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{engagementScore}</div>
            <div class="stat-label">Engagement Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{totalActions}</div>
            <div class="stat-label">Total Actions</div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 2rem;">
        <h3>🏆 Achievements</h3>
        {#if achievements.length > 0}
          <div class="achievements-list">
            {#each achievements as achievement}
              <div class="achievement-card">
                <div class="achievement-title">{achievement.title}</div>
                <div class="achievement-desc">{achievement.description}</div>
              </div>
            {/each}
          </div>
        {:else}
          <p>No achievements earned yet. Keep playing!</p>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Notifications -->
  {#if notification}
    <div class="notification">
      {notification}
    </div>
  {/if}
</main> 