import React, { useMemo, useState } from 'react'
import { useFilters, useTable, usePagination, useSortBy } from 'react-table'

export default function MessagesTable({ data }: { data: any }) {
  const [txHashFilter, setTxHashFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [bridgeFilter, setBridgeFilter] = useState('')

  const columns = useMemo(
    () => [
      {
        Header: 'Hidden Columns',
        columns: [
          {
            Header: 'fullTxHash',
            accessor: 'fullTxHash',
          },
          {
            Header: 'creationTimestamp',
            accessor: 'creationTimestamp',
          },
          {
            Header: 'deliveryTimestamp',
            accessor: 'deliveryTimestamp',
          },
          {
            Header: 'deliveryStatus',
            accessor: 'deliveryStatus',
          },
          {
            Header: 'bridge',
            accessor: 'bridge',
          },
        ],
      },
      {
        Header: 'Message Details',
        columns: [
          {
            Header: 'Message ID',
            accessor: 'messageId',
          },
          {
            Header: 'Direction',
            accessor: 'direction',
          },
          {
            Header: 'Transaction Hash',
            accessor: 'txHash',
          },
        ],
      },
      {
        Header: 'Home Events',
        columns: [
          {
            Header: 'UserRequestForSignature',
            accessor: 'userRequestForSignature',
          },
          {
            Header: 'CollectedSignatures',
            accessor: 'collectedSignatures',
          },
          {
            Header: 'RelayedMessage',
            accessor: 'relayedMessage',
          },
        ],
      },
      {
        Header: 'Foreign events',
        columns: [
          {
            Header: 'UserRequestForAffirmation',
            accessor: 'userRequestForAffirmation',
          },
          {
            Header: 'AffirmationCompleted',
            accessor: 'affirmationCompleted',
          },
        ],
      },
    ],
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow,
    state: { pageIndex, pageSize },
    setFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: [
          'fullTxHash',
          'creationTimestamp',
          'deliveryTimestamp',
          'deliveryStatus',
          'bridge',
        ],
        pageIndex: 0,
        sortBy: [
          {
            id: 'creationTimestamp',
            desc: true,
          },
        ],
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  )

  const handleTxHashFilterChange = (e: any) => {
    const value = e.target.value || undefined
    setFilter('fullTxHash', value)
    setTxHashFilter(value)
  }
  const handleStatusFilterChange = (e: any) => {
    const value = e.target.value || undefined
    setFilter('deliveryStatus', value)
    setStatusFilter(value)
  }
  const handleBridgeFilterChange = (e: any) => {
    const value = e.target.value || undefined
    setFilter('bridge', value)
    setBridgeFilter(value)
  }

  return (
    <div>
      <label>Table Filters</label>
      <br />
      <label>
        Search for a tx:
        <input
          id="txHashFilter"
          value={txHashFilter}
          onChange={handleTxHashFilterChange}
          placeholder={'TxHash'}
        />
      </label>
      <label>
        Message Status
        <select value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="">All</option>
          <option value="delivered">Delivered</option>
          <option value="not delivered">Pending</option>
        </select>
      </label>
      <label>
        Bridge
        <select value={bridgeFilter} onChange={handleBridgeFilterChange}>
          <option value="">Both Bridges</option>
          <option value="home">Home Bridge</option>
          <option value="foreign">Foreign Bridge</option>
        </select>
      </label>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 25, 50, 100, 250].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
