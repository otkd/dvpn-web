/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NodeMonitoringStatusResponse } from 'mysterium-vpn-js'

export enum BubbleStatus {
  IDLE = 'idle',
  WARNING = 'warning',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export const statusText = (node: NodeMonitoringStatusResponse, online: boolean): string => {
  if (!online) {
    return 'All services offline'
  }
  switch (node.status) {
    case 'failed':
      return 'Test Failed'
    default:
      return 'Online'
  }
}

export const nodeStatusBubble = (node: NodeMonitoringStatusResponse, online: boolean): BubbleStatus => {
  if (!online) {
    return BubbleStatus.FAILED
  }
  switch (node.status) {
    case 'failed':
      return BubbleStatus.WARNING
    default:
      return BubbleStatus.SUCCESS
  }
}

export const natTypeStatusBubble = (natType: string, loading: boolean): BubbleStatus => {
  if (loading) {
    return BubbleStatus.IDLE
  }
  switch (natType) {
    case 'symmetric':
      return BubbleStatus.WARNING
    default:
      return BubbleStatus.SUCCESS
  }
}

const NATType2Human: { [key: string]: string } = {
  none: 'All',
  fullcone: 'All',
  rcone: 'All',
  prcone: 'Most',
  symmetric: 'Limited',
}

export const natType2Human = (type: string, loading: boolean = false): string => {
  const humanReadable = NATType2Human[type]
  if (loading) {
    return 'Checking...'
  }
  if (!humanReadable) {
    return 'Unknown'
  }
  return humanReadable
}
