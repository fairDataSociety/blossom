import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'

export type PageEnvironment = 'tab' | 'menu'

export interface IEnvironmentContext {
  pageEnvironment: PageEnvironment
}

const EnvironmentContext = createContext<IEnvironmentContext>({
  pageEnvironment: 'menu',
})

export const useEnvironment = () => useContext(EnvironmentContext)

export interface EnvironmentContextProps {
  children: React.ReactNode
}

export const EnvironmentProvider = ({ children }: EnvironmentContextProps) => {
  const [pageEnvironment, setPageEnvironment] = useState<PageEnvironment>('menu')

  const checkEnvironment = async () => {
    try {
      const tab = await chrome.tabs.getCurrent()

      if (tab) {
        setPageEnvironment('tab')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  return (
    <EnvironmentContext.Provider
      value={{
        pageEnvironment,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}
