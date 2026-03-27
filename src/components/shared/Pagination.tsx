import { Button } from '@/components/ui/Button'

interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  pageSizeOptions: readonly number[]
  loading?: boolean
  onPageChange: (nextPage: number) => void
  onPageSizeChange: (size: number) => void
}

export const Pagination = ({
  page,
  totalPages,
  pageSize,
  pageSizeOptions,
  loading = false,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2">
    

    <div className="flex items-center gap-2">
      <p className="text-[12.5px] text-gray-500">
      Page <strong className="text-gray-700">{page}</strong> of{' '}
      <strong className="text-gray-700">{totalPages}</strong>
    </p>
      <select
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12.5px] text-gray-700 outline-none focus:border-green-500"
        disabled={loading}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <Button
        variant="ghost"
        size="sm"
        disabled={page <= 1 || loading}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Previous
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Next
      </Button>
    </div>
  </div>
)
