/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react'
import { ServiceInfo, ServiceStatus } from 'mysterium-vpn-js'
import { Config } from 'mysterium-vpn-js/lib/config/config'
import { useSnackbar } from 'notistack'

import { ServiceType } from '../../../../commons'
import {
  isAccessPolicyEnabled,
  pricePerGbMax,
  pricePerMinMax,
  servicePricePerGb,
  servicePricePerMin,
} from '../../../../commons/config'
import { Switch } from '../../../../Components/Switch'
import Button from '../../../../Components/Buttons/Button'
import { tequilapiClient } from '../../../../api/TequilApiClient'
import { parseError } from '../../../../commons/error.utils'

import ServiceHeader from './ServiceHeader'
import ServiceDetail from './ServiceDetail'
import ServiceSettingsModal from './ServiceSettingsModal'

const { RUNNING } = ServiceStatus

interface Props {
  identityRef: string
  serviceType: ServiceType
  serviceInfo?: ServiceInfo
  config: Config
  disabled?: boolean
}

interface ModalProps {
  isOpen: boolean
}

const ServiceCard = ({ serviceType, serviceInfo, identityRef, config, disabled = false }: Props) => {
  const [isTurnOnWorking, setTurnOnWorking] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ModalProps>({ isOpen: false })
  const { status, id } = { ...serviceInfo }
  const { enqueueSnackbar } = useSnackbar()

  const startService = (serviceType: string) => {
    setTurnOnWorking(true)
    tequilapiClient
      .serviceStart({
        providerId: identityRef,
        type: serviceType,
      })
      .catch((err) => {
        enqueueSnackbar(parseError(err) || `Service "${serviceType}" could not be started`, {
          variant: 'error',
        })
        console.log(err)
      })
      .finally(() => setTurnOnWorking(false))
  }

  const stopService = (serviceId: string) => {
    setTurnOnWorking(true)
    tequilapiClient
      .serviceStop(serviceId)
      .catch((err) => {
        enqueueSnackbar(parseError(err) || `Service "${serviceType}" could not be stopped`, {
          variant: 'error',
        })
        console.log(err)
      })
      .finally(() => setTurnOnWorking(false))
  }

  const openSettings = () => {
    setModalState({ ...modalState, isOpen: true })
  }

  const closeSettings = () => {
    setModalState({ ...modalState, isOpen: false })
  }

  const prices: {
    pricePerMin: number
    pricePerGb: number
    pricePerMinMax: number
    pricePerGbMax: number
  } = {
    pricePerGbMax: pricePerGbMax(config),
    pricePerMinMax: pricePerMinMax(config),
    pricePerMin: servicePricePerMin(config, serviceType),
    pricePerGb: servicePricePerGb(config, serviceType),
  }
  const accessPolicyEnabled = isAccessPolicyEnabled(config)
  return (
    <div className="service">
      <ServiceHeader whitelisted={accessPolicyEnabled} running={status === RUNNING} type={serviceType} />

      <div className="service__details">
        <ServiceDetail label="Price per minute">{prices.pricePerMin}</ServiceDetail>

        <ServiceDetail label="Price per GB">{prices.pricePerGb}</ServiceDetail>

        <ServiceDetail label="Turned on" alignValueRight={true}>
          <Switch
            disabled={isTurnOnWorking || disabled}
            turnedOn={!!serviceInfo}
            handleChange={() => {
              if (!id) {
                startService(serviceType.toLowerCase())
              } else {
                stopService(id)
              }
            }}
          />
        </ServiceDetail>
      </div>

      <div className="service__options">
        <Button disabled={disabled} onClick={openSettings} extraStyle="gray">
          Settings
        </Button>
      </div>

      <ServiceSettingsModal
        isOpen={modalState.isOpen}
        onClose={closeSettings}
        serviceType={serviceType}
        pricePerGbMax={prices.pricePerGbMax}
        pricePerMinuteMax={prices.pricePerMinMax}
        currentPricePerGb={prices.pricePerGb}
        currentPricePerMinute={prices.pricePerMin}
        identityRef={identityRef}
        serviceInfo={serviceInfo}
      />
    </div>
  )
}

export default ServiceCard
