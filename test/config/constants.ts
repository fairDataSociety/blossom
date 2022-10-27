export const RPC_PROVIDER_URL = process.env.CI === 'true' ? 'http://172.18.0.1:9545' : 'http://localhost:9545'
export const BEE_URL = process.env.CI === 'true' ? 'http://172.18.0.1:1633' : 'http://127.0.0.1:1633'
export const BEE_DEBUG_URL = process.env.CI === 'true' ? 'http://172.18.0.1:1635' : 'http://127.0.0.1:1635'
export const PRIVATE_KEY = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
