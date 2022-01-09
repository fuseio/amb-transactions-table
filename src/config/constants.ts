export interface BridgeInfo {
    name: string

    homeNetworkName: string
    foreignNetworkName: string

    homeBridgeAddress: string
    foreignBridgeAddress: string

    // subgraph must follow the schema here: https://github.com/t0mcr8se/amb-bridge-subgraph
    homeSubgraphUrl: string
    foreignSubgraphUrl: string

    homeTxTemplate: string
    foreignTxTemplate: string
}

export const BRIDGES: {[key: string]: BridgeInfo} = {
    FUSE_BSC_AMB: {
        name: "BSC Bridge",

        homeNetworkName: "FUSE",
        foreignNetworkName: "BSC",
        
        homeBridgeAddress: "0x1ee6E3E3d2DE779858728E157B3B9C488bA7b706",
        foreignBridgeAddress: "0x3A5A320a2f98a3Fe39c9040e7e3E9caA7F0D5bd6",

        homeSubgraphUrl: "https://api.thegraph.com/subgraphs/name/t0mcr8se/fuse-bsc-home-subgraph",
        foreignSubgraphUrl: "https://api.thegraph.com/subgraphs/name/t0mcr8se/fuse-bsc-foreign-subgraph",

        homeTxTemplate: "https://explorer.fuse.io/tx/%s",
        foreignTxTemplate: "https://bscscan.com/tx/%s",
    },
    FUSE_ETH_AMB: {
        name: "Ethereum Bridge",

        homeNetworkName: "FUSE",
        foreignNetworkName: "ETH",
        
        homeBridgeAddress: "0x2CA5411c4bf447Cc27CD6E6d1d046f922A27C399",
        foreignBridgeAddress: "0x63C47c296B63bE888e9af376bd927C835014039f",

        homeSubgraphUrl: "https://api.thegraph.com/subgraphs/name/t0mcr8se/fuse-ethereum-home-v1",
        foreignSubgraphUrl: "https://api.thegraph.com/subgraphs/name/t0mcr8se/fuse-ethereum-foreign-v1",

        homeTxTemplate: "https://explorer.fuse.io/tx/%s",
        foreignTxTemplate: "https://etherscan.com/tx/%s",

    },
}

export const BRIDGE_OPTIONS: {[key: string]: string}[] = [
    {value: "FUSE_BSC_AMB", label: BRIDGES.FUSE_BSC_AMB.name},
    {value: "FUSE_ETH_AMB", label: BRIDGES.FUSE_ETH_AMB.name},
]


export const ALL_MESSAGES_QUERY = (n:number|String, offset:number|string):string => {
  return `{
    messages(first: ${n}, skip: ${offset}){
      id
      txHash
      userRequestForSignature {
        blockNo
        timestamp
        txHash
      }
      userRequestForAffirmation {
        blockNo
        timestamp
        txHash
      }
      relayedMessage {
        blockNo
        timestamp
        txHash
      }
      affirmationCompleted {
        blockNo
        timestamp
        txHash
      }
      collectedSignature {
        blockNo
        timestamp
        txHash
      }
    }
  }`
}

export const MESSAGES_BY_SENDER_QUERY = (address: string) => {
  return `{
    messages(where: {sender : "${address}"}){
      id
      txHash
      userRequestForSignature {
        blockNo
        timestamp
        txHash
      }
      userRequestForAffirmation {
        blockNo
        timestamp
        txHash
      }
      relayedMessage {
        blockNo
        timestamp
        txHash
      }
      affirmationCompleted {
        blockNo
        timestamp
        txHash
      }
      collectedSignature {
        blockNo
        timestamp
        txHash
      }
    }
  }`

}

export const MESSAGES_BY_TXHASH_QUERY = (txHash: string) => {
  return `{
    messages(where: {txHash : "${txHash}"}){
      id
      txHash
      userRequestForSignature {
        blockNo
        timestamp
        txHash
      }
      userRequestForAffirmation {
        blockNo
        timestamp
        txHash
      }
      relayedMessage {
        blockNo
        timestamp
        txHash
      }
      affirmationCompleted {
        blockNo
        timestamp
        txHash
      }
      collectedSignature {
        blockNo
        timestamp
        txHash
      }
    }
  }`

}

export const MESSAGE_BY_ID_QUERY = (id:string) => {
  return `{
    messages(where: {id : "${id}"}){
      id
      txHash
      userRequestForSignature {
        blockNo
        timestamp
        txHash
      }
      userRequestForAffirmation {
        blockNo
        timestamp
        txHash
      }
      relayedMessage {
        blockNo
        timestamp
        txHash
      }
      affirmationCompleted {
        blockNo
        timestamp
        txHash
      }
      collectedSignature {
        blockNo
        timestamp
        txHash
      }
    }
  }`
}