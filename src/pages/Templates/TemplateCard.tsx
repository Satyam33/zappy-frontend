import { Copy, AlertCircle } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import type { Template } from '../../types/template.types'
import toast from 'react-hot-toast'

const statusConfig = {
  approved: { v: 'green' as const, label: 'Approved' },
  pending:  { v: 'amber' as const, label: 'Pending' },
  rejected: { v: 'red'   as const, label: 'Rejected' },
}

const categoryLabels: Record<string, string> = {
  marketing: 'Marketing',
  utility:   'Utility',
  authentication: 'Authentication',
}

interface Props {
  template: Template
  onDuplicate: (t: Template) => void
  onResubmit: (id: string) => void
}

export const TemplateCard = ({ template, onDuplicate, onResubmit }: Props) => {
  const sc = statusConfig[template.status]

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col transition-all hover:border-gray-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-[Syne,sans-serif] text-[13.5px] font-semibold text-gray-900 truncate font-mono">
            {template.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="gray">{categoryLabels[template.category]}</Badge>
            <Badge variant="gray">{template.language.toUpperCase()}</Badge>
          </div>
        </div>
        <Badge variant={sc.v} className="ml-2 flex-shrink-0">{sc.label}</Badge>
      </div>

      <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1 mt-2 line-clamp-3">
        {template.body}
      </p>

      {template.status === 'rejected' && template.rejectionReason && (
        <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2.5 flex gap-2">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-red-600 leading-relaxed">{template.rejectionReason}</p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <Button variant="ghost" size="xs" icon={<Copy size={11} />} onClick={() => {
          onDuplicate(template)
          toast.success('Template duplicated')
        }}>
          Duplicate
        </Button>
        {template.status === 'rejected' && (
          <Button size="xs" onClick={() => onResubmit(template.id)}>
            Edit & Resubmit
          </Button>
        )}
      </div>
    </div>
  )
}
