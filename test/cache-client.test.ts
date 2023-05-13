import ICacheClientTestes from '@i1k/smart-cache-manager/test/cache-client.test'
import MemoryCacheClient from '../src'

const client = new MemoryCacheClient({ max: 10 })
ICacheClientTestes(client)
