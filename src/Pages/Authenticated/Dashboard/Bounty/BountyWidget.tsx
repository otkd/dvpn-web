/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CircularProgress } from '@material-ui/core'
import { MMNReport, MMNReportResponse } from 'mysterium-vpn-js'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tequilapiClient } from '../../../../api/TequilApiClient'
import { parseError } from '../../../../commons/error.utils'
import { toastError } from '../../../../commons/toast.utils'
import { SETTINGS } from '../../../../constants/routes'
import './BountyWidget.scss'

const BountyWidget = ({ mmnUrl, apiKey }: { mmnUrl: string; apiKey: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [bountyReport, setBountyReport] = useState<MMNReport>({} as MMNReport)
  const [nodeInfo, setNodeInfo] = useState<MMNReportResponse>({} as MMNReportResponse)

  useEffect(() => {
    setIsLoading(true)
    tequilapiClient
      .getMMNNodeReport()
      .then((response) => {
        setNodeInfo(response)
        setBountyReport(response.report as MMNReport)
      })
      .catch((e) => toastError(parseError(e)))
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="bounty-widget">
        <CircularProgress className="loader spinner" disableShrink />
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div className="bounty-widget">
        <div className="bounty-widget__title">
          <div>Bounty pilot</div>
        </div>
        <div className="bounty-widget__body bounty-widget__body--empty">
          <div>
            To participate in the bounty pilot, please go to <Link to={SETTINGS}>Settings</Link> and enter your MMN API
            token to claim this node.
          </div>
        </div>
      </div>
    )
  }

  if (!bountyReport) {
    return (
      <div className="bounty-widget">
        <div className="bounty-widget__title">
          <div>Bounty pilot</div>
        </div>
        <div className="bounty-widget__body bounty-widget__body--empty">
          <div>Your bounty report is being generated. Refresh this page in a moment to update.</div>
        </div>
      </div>
    )
  }

  const formatPosition = (position?: number) => {
    if (!position) {
      return '-'
    }

    return position
  }

  return (
    <div className="bounty-widget">
      <div className="bounty-widget__title">
        <div>Bounty pilot</div>
        <div>
          <a href={`${mmnUrl}/nodes/${nodeInfo.id}/dashboard`}>View in MMN</a>
        </div>
      </div>

      <div className="bounty-widget__body">
        <div className="bounty bounty--residential">
          <div className="bounty-title">Residential bounty</div>
          <div className="bounty-status">
            <div className="bounty-status__earnings">
              <div className="label">Earnings</div>
              <div className="value">
                {bountyReport.balanceResidentialTokens} / <small>${bountyReport.balanceResidentialUsd}</small>
              </div>
            </div>
            <div className="bounty-status__position">
              <div className="label">Position</div>
              <div className="value">{formatPosition(bountyReport.positionResidential)}</div>
            </div>
          </div>
        </div>

        <div className="bounty bounty--global">
          <div className="bounty-title">Global bounty</div>
          <div className="bounty-status">
            <div className="bounty-status__earnings">
              <div className="label">Earnings</div>
              <div className="value">
                {bountyReport.balanceGlobalTokens} / <small>${bountyReport.balanceGlobalUsd}</small>
              </div>
            </div>
            <div className="bounty-status__position">
              <div className="label">Position</div>
              <div className="value">{formatPosition(bountyReport.positionGlobal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BountyWidget
