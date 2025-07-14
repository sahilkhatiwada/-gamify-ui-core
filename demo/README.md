# @gamify-ui/core Demos

This directory contains interactive demos showcasing the capabilities of the @gamify-ui/core gamification engine.

## 🎮 Available Demos

### Basic HTML Demo
A vanilla HTML/JavaScript demo that demonstrates the core functionality without any framework dependencies.

**Features:**
- User profile with stats
- Interactive action buttons
- Real-time leaderboard
- Level progress visualization
- Event notifications
- Responsive design

**To run:**
```bash
npm run demo:basic
# or
cd demo/basic-demo
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### React Demo
A modern React application showcasing the React hooks and components.

**Features:**
- React hooks integration
- Real-time state management
- Component-based architecture
- TypeScript support
- Hot reload development

**To run:**
```bash
npm run demo:react
# or
cd demo/react-demo
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## 🚀 Demo Features

Both demos include:

### User Management
- Create and manage users
- Track XP and levels
- Monitor badges and achievements
- Streak tracking

### Game Rules
- Click actions (10 XP)
- Scroll actions (5 XP)
- Share actions (25 XP)
- Comment actions (15 XP)
- Daily check-ins (50 XP)
- Weekly goals (100 XP)

### Missions
- First Click mission (50 XP reward)
- Click Master mission (100 XP reward)

### Real-time Features
- Live leaderboard updates
- Level up notifications
- Achievement unlocks
- Progress tracking

### Visual Elements
- Progress bars
- Level indicators
- Badge displays
- Streak counters
- Responsive design

## 🛠️ Customization

You can easily customize the demos by:

1. **Modifying game rules** - Edit the rule definitions in the demo files
2. **Adding new missions** - Create custom missions with different goals
3. **Changing themes** - Update colors and styling
4. **Adding new actions** - Implement custom event triggers
5. **Extending functionality** - Add new gamification features

## 📚 Learning Resources

- Check the main [README.md](../README.md) for API documentation
- Review [ARCHITECTURE.md](../ARCHITECTURE.md) for design patterns
- Explore the [tests](../tests/) directory for usage examples

## 🤝 Contributing

Want to add a new demo or improve existing ones?

1. Fork the repository
2. Create a new demo directory or enhance existing demos
3. Add documentation
4. Submit a pull request

## 📄 License

The demos are licensed under the same MIT license as the main package. 