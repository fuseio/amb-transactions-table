import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { BridgeInfo, MESSAGES_BY_SENDER_QUERY, MESSAGES_BY_TXHASH_QUERY, MESSAGE_BY_ID_QUERY } from '../config/constants'

const getSubgraph = (uri: string) => {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  })
}

export const rawGqlQuery = async (uri: string, query: string) => {
  const client = getSubgraph(uri)
  const ret = await client.query({
    query: gql(query),
  })

  return ret
}

export const getSubgraphMessages = async (bridge: BridgeInfo, sender: string, txHash : string) => {
  let homeData: any[] = []
  let foreignData: any[] = []

  let query = txHash === '' ? MESSAGES_BY_SENDER_QUERY(sender) : MESSAGES_BY_TXHASH_QUERY(txHash)

  let i = 0
  let ret: any[] = (await rawGqlQuery(bridge.homeSubgraphUrl, query)).data.messages
  homeData.push(...ret)

  ret = (await rawGqlQuery(bridge.foreignSubgraphUrl, query)).data.messages
  foreignData.push(...ret)

  return await mergeBridgeMessages(homeData, foreignData, bridge)
}

const getMessageById = async (id: string, bridge: BridgeInfo) => {
  let messageAtHome = (await rawGqlQuery(bridge.homeSubgraphUrl, MESSAGE_BY_ID_QUERY(id))).data.messages
  let messageAtForeign = (await rawGqlQuery(bridge.foreignSubgraphUrl, MESSAGE_BY_ID_QUERY(id))).data.messages

  if (messageAtForeign.length === 0) return { message: messageAtHome, finished: false }
  // Message is from home and did not get relayed yet
  else if (messageAtForeign.length === 0) return { message: messageAtForeign, finished: false }

  messageAtHome = messageAtHome[0]
  messageAtForeign = messageAtForeign[0]

  let message: { [key: string]: any } = {}
  for (const key in messageAtHome) {
    message[key] = messageAtHome[key] !== null ? messageAtHome[key] : messageAtForeign[key]
  }

  if (message['userRequestForAffirmation'] !== null) {
    message['txHash'] = messageAtForeign['txHash']
  }
  return { message, finished: true }
}

export const mergeBridgeMessages = async (homeMessages: any, foreignMessages: any, bridge: BridgeInfo) => {
  let orphanCnt = 0

  let ret = new Map()
  let orphans = new Map()

  homeMessages.forEach((message: any) => {
    ret.set(message.id, message)
    orphans.set(message.id, message)
    orphanCnt++
  })
  foreignMessages.forEach((message: any) => {
    if (ret.has(message.id)) {
      orphanCnt--
      orphans.delete(message.id)

      let tmp: { [key: string]: any } = {}
      for (const key in ret.get(message.id)) {
        tmp[key] = ret.get(message.id)[key]
      }

      if (message['userRequestForAffirmation'] !== null) {
        tmp['txHash'] = message['txHash']
      }
      for (const key in tmp) {
        if (tmp[key] === null) tmp[key] = message[key]
      }
      ret.set(message.id, tmp)
    } else {
      orphanCnt++
      orphans.set(message.id, message)
      ret.delete(message.id)
    }
  })
  for (let _ of Array.from(orphans.entries())) {
    let orphan = _[1]
    const { message, finished } = await getMessageById(orphan.id, bridge)
    if (finished) {
      ret.set(orphan.id, message)
      orphanCnt--
      orphans.delete(orphan.id)
    }
  }
  return { messages: ret, orphans }
}
