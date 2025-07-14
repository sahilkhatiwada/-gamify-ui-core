.PHONY: install build test test-watch test-coverage lint clean publish demo-basic demo-react help

# Default target
help:
	@echo "Available commands:"
	@echo "  install      - Install dependencies"
	@echo "  build        - Build the package"
	@echo "  test         - Run tests"
	@echo "  test-watch   - Run tests in watch mode"
	@echo "  test-coverage - Run tests with coverage"
	@echo "  lint         - Run linter"
	@echo "  lint-fix     - Fix linting issues"
	@echo "  clean        - Clean build artifacts"
	@echo "  publish      - Build and publish to npm"
	@echo "  demo-basic   - Run basic HTML demo"
	@echo "  demo-react   - Run React demo"
	@echo "  help         - Show this help"

# Install dependencies
install:
	npm install

# Build the package
build:
	npm run build

# Run tests
test:
	npm run test

# Run tests in watch mode
test-watch:
	npm run test:watch

# Run tests with coverage
test-coverage:
	npm run test:coverage

# Run linter
lint:
	npm run lint

# Fix linting issues
lint-fix:
	npm run lint:fix

# Clean build artifacts
clean:
	npm run clean

# Build and publish to npm
publish: build test
	npm publish

# Run basic HTML demo
demo-basic:
	npm run demo:basic

# Run React demo
demo-react:
	cd demo/react-demo && npm install && npm run dev

# Development workflow
dev: install
	npm run dev

# CI workflow
ci: install lint test-coverage build

# Full development setup
setup: install
	@echo "Setting up development environment..."
	@echo "Installing demo dependencies..."
	cd demo/react-demo && npm install
	@echo "Setup complete! Run 'make dev' to start development." 