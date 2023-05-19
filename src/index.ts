import { ICacheClient, StringOrGlobPattern } from '@i1k/smart-cache-manager'

import { LRUCache } from 'lru-cache'
import micromatch from 'micromatch'

class MemoryCacheClient implements ICacheClient {
  private _client: LRUCache<string, string>

  constructor(options: LRUCache.Options<string, string, unknown>) {
    this._client = new LRUCache(options)
  }

  public async set(key: string, value: string): Promise<'OK'> {
    this._client.set(key, value)
    return 'OK'
  }

  public async get(key: string): Promise<string | null> {
    return this._client.get(key) ?? null
  }

  public async del(key: StringOrGlobPattern | StringOrGlobPattern[]): Promise<string[]> {
    const keys: string[] = await this.keys(key)

    if (keys.length) {
      keys.forEach(key => this._client.delete(key))
    }

    return keys
  }

  public async clear(): Promise<string[]> {
    const keys: string[] = await this.keys('*')

    if (keys) {
      this._client.clear()
    }

    return keys
  }

  public async keys(pattern: StringOrGlobPattern | StringOrGlobPattern[]): Promise<string[]> {
    return Array.from(new Set(micromatch([...this._client.keys()], pattern, { bash: true })))
  }
}

export default MemoryCacheClient
