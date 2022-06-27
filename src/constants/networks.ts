export interface Network {
  id: number
  label: string
  rpc: string
}

export const networks: Network[] = [
  {
    id: 1,
    label: 'Localhost',
    rpc: 'http://localhost:9545',
  },
]
