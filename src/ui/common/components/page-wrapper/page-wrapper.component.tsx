import React from 'react'
import { useEnvironment } from '../../context/environment.context'
import MenuWrapper from '../../../settings/components/menu-wrapper/menu-wrapper'
import CenteredWrapper from '../centered-wrapper/centered-wrapper.component'

export interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const { pageEnvironment } = useEnvironment()

  if (!pageEnvironment) {
    return null
  }

  if (pageEnvironment === 'menu') {
    return <MenuWrapper>{children}</MenuWrapper>
  }

  return <CenteredWrapper>{children}</CenteredWrapper>
}

export default PageWrapper
