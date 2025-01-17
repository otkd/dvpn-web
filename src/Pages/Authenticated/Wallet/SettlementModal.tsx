/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from 'react'
import { toastSuccess } from '../../../commons/toast.utils'
import Button from '../../../Components/Buttons/Button'
import { Fees } from 'mysterium-vpn-js'
import './SettlementModal.scss'
import { displayMyst } from '../../../commons/money.utils'
import { Fade, Modal } from '@material-ui/core'
import ConfirmationDialogue from '../../../Components/ConfirmationDialogue/ConfirmationDialogue'

interface Props {
  open?: boolean
  onClose?: () => void
  onSettle?: () => void
  fees?: Fees
  unsettledEarnings: number
  beneficiary: string
}

const SettlementModal = ({
  open = false,
  onClose = () => {},
  fees,
  onSettle = () => {},
  unsettledEarnings,
  beneficiary,
}: Props) => {
  const [confirmation, setConfirmation] = useState<boolean>(false)

  const calculateEstimatedEarnings = (): number => {
    const settlementFee = fees?.settlement || 0
    const hermesFee = fees?.hermes || 0
    return unsettledEarnings - settlementFee - hermesFee
  }

  return (
    <>
      <Modal className="settlement-modal" open={open} onClose={onClose}>
        <Fade in={open}>
          <div className="settlement-modal__block">
            <div className="settlement-modal__title">Settle your earnings</div>
            <div className="settlement-modal__content">
              <div className="settlement">
                <div className="settlement-details">
                  <div className="settlement-details__label">Beneficiary address:</div>
                  <div className="settlement-details__value">{beneficiary}</div>
                </div>
                <div className="settlement-details">
                  <div className="settlement-details__label">Amount to settle:</div>
                  <div className="settlement-details__value">{displayMyst(unsettledEarnings)}</div>
                </div>
              </div>
              <div className="fee">
                <div className="fee-details">
                  <div className="fee-details__label">Transactor fee:</div>
                  <div className="fee-details__value">{displayMyst(fees?.settlement)}</div>
                </div>
              </div>
              <div className="estimate">
                <div className="estimate-details">
                  <div className="estimate-details__label">You will get:</div>
                  <div className="estimate-details__value">{displayMyst(calculateEstimatedEarnings())}</div>
                </div>
              </div>
            </div>
            <div className="settlement-modal__footer">
              <Button onClick={onClose} extraStyle="gray">
                Cancel
              </Button>
              <Button
                className="m-l-10"
                disabled={unsettledEarnings < 1}
                onClick={() => {
                  setConfirmation(true)
                }}
                autoFocus
              >
                Settle
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
      <ConfirmationDialogue
        open={confirmation}
        onCancel={() => setConfirmation(false)}
        onConfirm={() => {
          toastSuccess('Settlement submitted for processing')
          setConfirmation(false)
          onSettle()
          return Promise.resolve()
        }}
      />
    </>
  )
}

export default SettlementModal
