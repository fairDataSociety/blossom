import { PersonalStorage } from '@fairdatasociety/fdp-storage'

export async function isDappPodCreated(podName: string): Promise<boolean> {
  const personalStorage = this as PersonalStorage

  const pods = await personalStorage.list()

  return pods.getPods().some((pod) => pod.name === podName)
}

export type PersonalStorageExtension = {
  isDappPodCreated(podName: string): Promise<boolean>
}

export type ExtendedPersonalStorage = PersonalStorage & PersonalStorageExtension

export function createPersonalStorageProxy(personalStorage: PersonalStorage): ExtendedPersonalStorage {
  return new Proxy<ExtendedPersonalStorage>(
    personalStorage as ExtendedPersonalStorage,
    {
      get(target: PersonalStorage, property: string) {
        if (property === 'isDappPodCreated') {
          return isDappPodCreated.bind(target)
        }

        return target[property]
      },
    } as ProxyHandler<ExtendedPersonalStorage>,
  )
}
