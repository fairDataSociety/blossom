/**
 * Abstracts asynchronous loading of configuration
 */
export abstract class AsyncConfigService<Config> {
  private configPromise: Promise<Config>

  protected initialize(configLoader: () => Promise<Config>) {
    this.configPromise = configLoader()
  }

  protected getConfig(): Promise<Config> {
    return this.configPromise
  }

  protected updateConfig(config: Config) {
    this.configPromise = Promise.resolve(config)
  }

  protected updateConfigAsync(configPromise: Promise<Config>) {
    this.configPromise = configPromise
  }
}
