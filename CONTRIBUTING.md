# Contributing to @gamify-ui/core

Thank you for your interest in contributing to @gamify-ui/core! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/gamify-ui-core.git
   cd gamify-ui-core
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Follow strict TypeScript configuration
- Use meaningful type names and interfaces
- Avoid `any` type when possible

### Code Formatting
- Use Prettier for code formatting
- Use ESLint for code linting
- Follow the existing code style patterns

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names that explain the purpose

## 🧪 Testing

### Writing Tests
- Write tests for all new features
- Use Jest as the testing framework
- Aim for high test coverage
- Test both success and error cases

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## 📦 Building

### Build Process
```bash
# Build the package
npm run build

# Build in watch mode
npm run dev
```

### Build Outputs
- `dist/index.js` - CommonJS bundle
- `dist/index.esm.js` - ES Module bundle
- `dist/index.d.ts` - TypeScript declarations

## 🔧 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write your code following the style guidelines
- Add tests for new functionality
- Update documentation if needed

### 3. Test Your Changes
```bash
npm run lint
npm run type-check
npm test
npm run build
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new gamification feature"
```

### 5. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the style guidelines
- [ ] Tests pass and coverage is maintained
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] No sensitive information is committed

### Pull Request Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

## 🐛 Bug Reports

### Before Reporting
- Check if the issue has already been reported
- Try to reproduce the issue with the latest version
- Check the documentation for solutions

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Node.js version: [e.g., 16.15.0]
- Package version: [e.g., 1.0.0]

## Additional Information
Any other relevant information
```

## 💡 Feature Requests

### Before Requesting
- Check if the feature has already been requested
- Consider if the feature aligns with the project goals
- Think about the implementation complexity

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature would be useful

## Proposed Implementation
How you think it could be implemented

## Alternatives Considered
Other approaches you've considered
```

## 📚 Documentation

### Documentation Guidelines
- Keep documentation up to date
- Use clear and concise language
- Include code examples
- Add JSDoc comments for public APIs

### Documentation Structure
- README.md - Project overview and quick start
- API.md - Detailed API documentation
- EXAMPLES.md - Code examples and use cases
- MIGRATION.md - Migration guides for breaking changes

## 🏷️ Versioning

### Semantic Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Process
1. Update version in package.json
2. Update CHANGELOG.md
3. Create a release tag
4. Publish to npm

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's code of conduct

### Communication
- Use GitHub Issues for bug reports and feature requests
- Use GitHub Discussions for questions and general discussion
- Be patient and helpful with newcomers

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Bug fixes
- Documentation improvements
- Test coverage improvements

### Medium Priority
- New gamification features
- Framework integrations
- UI components
- Analytics features

### Low Priority
- Nice-to-have features
- Experimental features
- Additional themes
- Sound packs

## 📞 Getting Help

### Resources
- [GitHub Issues](https://github.com/gamify-ui/core/issues)
- [GitHub Discussions](https://github.com/gamify-ui/core/discussions)
- [Documentation](https://docs.gamify-ui.com)
- [Discord Community](https://discord.gg/gamify-ui)

### Questions
If you have questions about contributing:
1. Check the documentation first
2. Search existing issues and discussions
3. Create a new discussion if needed
4. Join our Discord community

## 🙏 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes
- Project documentation

### Special Thanks
Special recognition for:
- Major feature contributions
- Bug fixes that save significant time
- Documentation improvements
- Community support

Thank you for contributing to @gamify-ui/core! 🚀 