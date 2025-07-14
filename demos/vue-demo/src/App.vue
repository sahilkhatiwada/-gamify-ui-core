<template>
  <div id="app">
    <h1>🎮 Gamify Vue Demo</h1>
    <p>Experience the power of gamification with Vue.js!</p>
    
    <div class="gamify-container">
      <!-- User Panel -->
      <div class="user-panel">
        <h2>👤 User Profile</h2>
        <div v-if="user">
          <h3>{{ user.name || 'Anonymous Player' }}</h3>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ user.level }}</div>
              <div class="stat-label">Level</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ user.xp }}</div>
              <div class="stat-label">XP</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ user.badges.length }}</div>
              <div class="stat-label">Badges</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ user.achievements.length }}</div>
              <div class="stat-label">Achievements</div>
            </div>
          </div>
          
          <div>
            <strong>Progress to Level {{ user.level + 1 }}</strong>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${levelProgress.progress * 100}%` }"
              ></div>
            </div>
            <small>{{ levelProgress.current }} / {{ levelProgress.next }} XP</small>
          </div>
          
          <div v-if="user.badges.length > 0">
            <h4>🏆 Recent Badges</h4>
            <div class="achievements-list">
              <div 
                v-for="badge in user.badges.slice(-3)" 
                :key="badge.id"
                class="achievement-card"
              >
                <div class="achievement-title">{{ badge.name }}</div>
                <div class="achievement-desc">{{ badge.description }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Loading user data...</p>
        </div>
      </div>
      
      <!-- Actions Panel -->
      <div class="actions-panel">
        <h2>🎯 Actions</h2>
        <p>Click buttons to earn XP and progress!</p>
        
        <div>
          <button 
            class="action-button" 
            @click="performAction('click', 10)"
          >
            🖱️ Click (10 XP)
          </button>
          
          <button 
            class="action-button" 
            @click="performAction('scroll', 5)"
          >
            📜 Scroll (5 XP)
          </button>
          
          <button 
            class="action-button" 
            @click="performAction('share', 25)"
          >
            📤 Share (25 XP)
          </button>
          
          <button 
            class="action-button" 
            @click="performAction('comment', 15)"
          >
            💬 Comment (15 XP)
          </button>
          
          <button 
            class="action-button" 
            @click="performAction('like', 8)"
          >
            ❤️ Like (8 XP)
          </button>
          
          <button 
            class="action-button" 
            @click="performAction('complete_task', 50)"
          >
            ✅ Complete Task (50 XP)
          </button>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>📊 Analytics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ engagementScore }}</div>
              <div class="stat-label">Engagement Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ totalActions }}</div>
              <div class="stat-label">Total Actions</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>🏆 Achievements</h3>
          <div v-if="achievements.length > 0" class="achievements-list">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="achievement-card"
            >
              <div class="achievement-title">{{ achievement.title }}</div>
              <div class="achievement-desc">{{ achievement.description }}</div>
            </div>
          </div>
          <p v-else>No achievements earned yet. Keep playing!</p>
        </div>
      </div>
    </div>
    
    <!-- Notifications -->
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { GamifyEngine } from '@gamify-ui/core'

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
})

// Reactive state
const user = ref<any>(null)
const levelProgress = ref({ current: 0, next: 100, progress: 0 })
const achievements = ref<any[]>([])
const engagementScore = ref(0)
const totalActions = ref(0)
const notification = ref('')

// Create user on mount
onMounted(() => {
  const userId = 'vue-demo-user'
  user.value = engine.createUser(userId, 'Vue Player', 'vue@example.com')
  
  // Start analytics session
  engine.startSession(userId)
  
  // Set up event listeners
  engine.onLevelUp().subscribe((updatedUser) => {
    if (updatedUser.id === userId) {
      showNotification(`🎉 Level Up! You're now level ${updatedUser.level}!`)
      updateUserData()
    }
  })
  
  engine.onAchievement().subscribe((data) => {
    if (data.user.id === userId) {
      showNotification(`🏆 Achievement Unlocked: ${data.achievement.title}!`)
      updateUserData()
    }
  })
  
  // Initial data update
  updateUserData()
})

// Computed properties
const updateUserData = () => {
  if (user.value) {
    levelProgress.value = engine.getLevelProgress(user.value)
    achievements.value = engine.getUserAchievements(user.value.id)
    engagementScore.value = engine.getEngagementScore(user.value.id)
    
    // Get user metrics for total actions
    const metrics = engine.getUserMetrics(user.value.id)
    totalActions.value = metrics?.totalXp || 0
  }
}

// Actions
const performAction = (actionType: string, xp: number) => {
  if (!user.value) return
  
  engine.triggerEvent(user.value.id, actionType, { xp })
  showNotification(`+${xp} XP for ${actionType}!`)
  updateUserData()
}

const showNotification = (message: string) => {
  notification.value = message
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}
</script> 