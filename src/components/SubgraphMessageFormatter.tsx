import React from 'react'
import { BridgeInfo } from '../config/constants'
import { formatMessageId, formatTxHash, getExplorerTxUrl } from '../utils/networks'
import { ExplorerTxLink } from './commons/ExplorerTxLink'

const getExplorerTxLinkComponent = (
  explorerTxTemplate: string,
  txHash: any,
) => {
  if (txHash === undefined) return '-'
  return (
    <ExplorerTxLink href={getExplorerTxUrl(txHash, explorerTxTemplate)}>
      {formatTxHash(txHash)}
    </ExplorerTxLink>
  )
}

export const subgraphMessageToTableMessage = (
  message: any,
  bridgeInfo: BridgeInfo,
) => {
  let fromHome = message.userRequestForSignature !== null
  let isDelivered =
    (fromHome ? message.relayedMessage : message.affirmationCompleted) !== null

  let messageId = formatMessageId(message.id)
  let txHash = getExplorerTxLinkComponent(
    bridgeInfo.homeTxTemplate,
    message.txHash,
  )
  let direction = fromHome
    ? bridgeInfo.homeNetworkName + ' => ' + bridgeInfo.foreignNetworkName
    : bridgeInfo.foreignNetworkName + ' => ' + bridgeInfo.homeNetworkName
  let userRequestForSignature = fromHome
    ? getExplorerTxLinkComponent(
        bridgeInfo.homeTxTemplate,
        message.userRequestForSignature.txHash,
      )
    : '-'
  let collectedSignatures = fromHome
    ? getExplorerTxLinkComponent(
        bridgeInfo.homeTxTemplate,
        message.collectedSignature.txHash,
      )
    : '-'
  let relayedMessage = fromHome
    ? getExplorerTxLinkComponent(
        bridgeInfo.foreignTxTemplate,
        message.relayedMessage?.txHash,
      )
    : '-'
  let userRequestForAffirmation = !fromHome
    ? getExplorerTxLinkComponent(
        bridgeInfo.foreignTxTemplate,
        message.userRequestForAffirmation.txHash,
      )
    : '-'
  let affirmationCompleted = !fromHome
    ? getExplorerTxLinkComponent(
        bridgeInfo.homeBridgeAddress,
        message.affirmationCompleted.txHash,
      )
    : '-'

  // The following vars will be used for filtering and sorting the table
  let fullTxHash = message.txHash
  let creationTimestamp = parseInt(
    fromHome
      ? message.userRequestForSignature.timestamp
      : message.userRequestForAffirmation.timestamp,
  )
  let deliveryTimestamp = isDelivered
    ? fromHome
      ? message.relayedMessage.timestamp
      : message.affirmationCompleted.timestamp
    : 'not delivered'
  let deliveryStatus = isDelivered ? 'delivered' : 'not delivered'
  let bridge = fromHome ? 'home' : 'foreign'

  return {
    messageId,
    txHash,
    direction,
    userRequestForSignature,
    collectedSignatures,
    relayedMessage,
    userRequestForAffirmation,
    affirmationCompleted,
    fullTxHash,
    creationTimestamp,
    deliveryTimestamp,
    deliveryStatus,
    bridge,
  }
}
