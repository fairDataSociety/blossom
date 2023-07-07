import { useEffect } from 'react'
import { refreshWalletLock } from '../../../../../messaging/content-api.messaging'
import { useNavigate } from 'react-router-dom'

export function useWalletLock() {
  const navigate = useNavigate()

  const checkLock = async () => {
    try {
      await refreshWalletLock()
    } catch (error) {
      setTimeout(() => navigate('..'))
    }
  }

  useEffect(() => {
    checkLock()
  }, [])
}
