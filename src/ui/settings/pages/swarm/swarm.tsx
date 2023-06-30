import React, { useEffect, useState } from 'react'
import intl from 'react-intl-universal'
import Hive from '@mui/icons-material/Hive'
import { FlexColumnDiv } from '../../../common/components/utils/utils'
import Header from '../../../common/components/header/header.component'
import SwarmExtension from './swarm-extension'
import { Swarm } from '../../../../model/storage/swarm.model'
import { getSwarmSettings } from '../../../../messaging/content-api.messaging'
import { setSwarmSettings } from '../../../../listeners/message-listeners/settings.listener'
import { useNavigate } from 'react-router-dom'
import RouteCodes from '../../routes/route-codes'

const SwarmComponent = () => {
  const navigate = useNavigate()
  const [swarm, setSwarm] = useState<Swarm>(null)

  const fetchSwarmSettings = async () => {
    const swarm = await getSwarmSettings()
    setSwarm(swarm)
  }

  const updateExtensionId = async (extensionId: string) => {
    await setSwarmSettings({ extensionId })
    navigate(RouteCodes.home)
  }

  useEffect(() => {
    fetchSwarmSettings()
  }, [])

  if (!swarm) {
    return null
  }

  return (
    <FlexColumnDiv>
      <Header title={intl.get('SWARM')} image={Hive} backRoute={RouteCodes.settings} />
      <SwarmExtension extensionId={swarm.extensionId} onUpdate={updateExtensionId} />
    </FlexColumnDiv>
  )
}

export default SwarmComponent
