import { useEffect, useState } from 'react'
import { getCurrentUser } from '../../../messaging/content-api.messaging'
import { UserResponse } from '../../../model/internal-messages.model'

export interface UserData {
  user: UserResponse | null
  error: string | null
}

export function useUser(): UserData {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const user = await getCurrentUser()

      setUser(user)
    } catch (error) {
      setError(String(error))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    user,
    error,
  }
}
