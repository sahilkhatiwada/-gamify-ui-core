import { GamifyPlugin } from '../types';

/**
 * Manages plugin installation and lifecycle
 */
export class PluginManager {
  private readonly plugins = new Map<string, GamifyPlugin>();

  /**
   * Install a plugin
   */
  install(plugin: GamifyPlugin, engine: any): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} is already installed`);
    }

    // Install the plugin
    plugin.install(engine);
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Uninstall a plugin
   */
  uninstall(pluginName: string): boolean {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) return false;

    // Call uninstall method if available
    if (plugin.uninstall) {
      plugin.uninstall(this);
    }

    this.plugins.delete(pluginName);
    return true;
  }

  /**
   * Get all installed plugins
   */
  getPlugins(): GamifyPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get a specific plugin by name
   */
  getPlugin(pluginName: string): GamifyPlugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Check if a plugin is installed
   */
  isPluginInstalled(pluginName: string): boolean {
    return this.plugins.has(pluginName);
  }

  /**
   * Get total number of installed plugins
   */
  getPluginCount(): number {
    return this.plugins.size;
  }

  /**
   * Get plugin names
   */
  getPluginNames(): string[] {
    return Array.from(this.plugins.keys());
  }
} 