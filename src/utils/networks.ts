export const validTxHash = (txHash: string) => /^0x[a-fA-F0-9]{64}$/.test(txHash)

export const formatTxHash = (txHash: string) => `${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`

export const getExplorerTxUrl = (txHash: string, explorerTxTemplate: string) => {
  const template = explorerTxTemplate
  return template.replace('%s', txHash)
}

export const formatMessageId = (messageId: string) => {
  return `${messageId.substring(0, 6)}...${messageId.substring(messageId.length - 4)}`
}