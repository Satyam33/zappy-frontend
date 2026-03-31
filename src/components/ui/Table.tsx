import React from 'react'

interface Column<T> {
  key: string
  header: React.ReactNode
  width?: string
  headerClassName?: string
  cellClassName?: string
  render: (row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  emptyIcon?: React.ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelectAll?: (checked: boolean) => void
  onSelectRow?: (id: string, checked: boolean) => void
}

const TableSkeleton = ({ cols, rows }: { cols: number; rows: number }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}><div className="skeleton skeleton-text w-24" /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}><div className="skeleton skeleton-text" style={{ width: `${60 + Math.random() * 40}%` }} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const Table = <T extends { id: string }>({
  columns, data, loading, emptyText = 'No data found',
  onRowClick, selectable, selectedIds = [], onSelectAll, onSelectRow,
}: TableProps<T>) => {
  if (loading) return <TableSkeleton cols={columns.length + (selectable ? 1 : 0)} rows={5} />

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={e => onSelectAll?.(e.target.checked)}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={col.headerClassName}
                style={col.width ? { width: col.width } : {}}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                <div className="empty-state py-16 text-center">
                  <p className="text-[13px] text-gray-400">{emptyText}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {selectable && (
                  <td onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={e => onSelectRow?.(row.id, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className={col.cellClassName}>{col.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
