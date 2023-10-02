import { useEffect } from 'react'
import { refreshWalletLock } from '../../../../../messaging/content-api.messaging'
import { useNavigate } from 'react-router-dom'
import { errorMessages } from '../../../../../constants/errors'

export function useWalletLock() {
  const navigate = useNavigate()

  const checkLock = async (): Promise<boolean> => {
    try {
      await refreshWalletLock()

      return false
    } catch (error) {
      setTimeout(() => navigate('..'))

      return true
    }
  }

  const checkLockError = async (error: unknown): Promise<boolean> => {
    try {
      if (error.toString().includes(errorMessages.WALLET_LOCKED)) {
        return await checkLock()
      }
    } catch (error) {}

    return false
  }

  useEffect(() => {
    checkLock()
  }, [])

  return {
    checkLockError,
  }
}
