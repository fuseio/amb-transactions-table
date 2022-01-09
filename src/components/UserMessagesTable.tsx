import React, { useState, useMemo, useEffect } from 'react'
import { getSubgraphMessages } from '../utils/subgraph'
import MessagesTable from './MessagesTable'
import { BRIDGE_OPTIONS, BRIDGES } from '../config/constants'
import { useParams, useHistory } from 'react-router-dom'
import BridgeSelector from './BridgeSelector'
import { subgraphMessageToTableMessage } from './SubgraphMessageFormatter'

export const UserMessagesTable = () => {
  const history = useHistory()
  const { searchMode, searchParam } = useParams()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [sender, setSender] = useState('')
  const [txHash, setTxHash] = useState('')
  const [bridges, setBridges] = useState<any[]>(BRIDGE_OPTIONS)
  const [userMessage, setUserMessage] = useState('')
  // const [submitted, setSubmitted] = useState(false)

  const handleSenderChange = (e: any) => {
    setSender(e.target.value)
    setTxHash('')
  }
  const handleTxHashChange = (e: any) => {
    setTxHash(e.target.value)
    setSender('')
  }

  const handleBridgeChange = (selected: any) => {
    setBridges(selected)
  }

  useEffect(() => {
    if (!searchMode) return
    if (searchMode === 'txHash') {
      setTxHash(searchParam)
    } else setSender(searchParam)
  }, [searchMode, searchParam])

  useEffect(() => {
    search()
  }, [txHash, sender])

  const searchClicked = (e: any) => {
    e.preventDefault()

    if (txHash !== '') history.push(`/txHash/${txHash}`)
    else if (sender !== '') history.push(`/sender/${sender}`)

    search()
  }

  const search = () => {
    if (loading) return
    setData([])
    setUserMessage('Loading')
    setLoading(true)
    bridges.forEach((bridgeName) => {
      bridgeName = bridgeName.value
      getSubgraphMessages(BRIDGES[bridgeName], sender, txHash).then(
        ({ messages, orphans }) => {
          let tmp: any[] = []
          messages.forEach((message) => {
            tmp.push(
              subgraphMessageToTableMessage(message, BRIDGES[bridgeName]),
            )
          })
          orphans.forEach((message) => {
            tmp.push(
              subgraphMessageToTableMessage(message, BRIDGES[bridgeName]),
            )
          })
          setData(tmp)
          setUserMessage(tmp.length === 0 ? 'No results' : '')
        },
      )
    })
    setLoading(false)
  }

  return (
    <div className="MessagesTable">
      <label>
        Bridgeable Transaction Hash:
        <input
          value={txHash}
          onChange={handleTxHashChange}
          placeholder={'Bridgeable Transaction Hash'}
        />
      </label>
      <label>
        Message Sender Address:
        <input
          value={sender}
          onChange={handleSenderChange}
          placeholder={'Message Sender'}
        />
      </label>
      <label>
        Bridges:
        <BridgeSelector
          options={BRIDGE_OPTIONS}
          onChange={handleBridgeChange}
          value={bridges}
        />
      </label>
      <label>
        <button onClick={searchClicked}>Search</button>
      </label>
      {data.length === 0 && <p>{userMessage}</p>}
      {data.length > 0 && <MessagesTable data={data} />}
    </div>
  )
}
