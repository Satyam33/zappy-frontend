import { useState, useMemo } from 'react'
import { Search, UserPlus, Upload, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Chip } from '../../components/ui/Chip'
import { Table } from '../../components/ui/Table'
import { AddContactModal } from './AddContactModal'
import { ImportCSVModal } from './ImportCSVModal'
import { mockContacts } from '../../utils/mockData'
import type { Contact, ContactSegment } from '../../types/contact.types'
import { formatPhone } from '../../utils/formatters'
import toast from 'react-hot-toast'

const SEGMENTS: ContactSegment[] = ['All', 'VIP', 'New Customer', 'Repeat', 'Inactive']

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState<ContactSegment>('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = contacts
    if (segment !== 'All') list = list.filter(c => c.tags.includes(segment))
    if (search) list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    )
    return list
  }, [contacts, segment, search])

  const handleAdd = (data: { name: string; phone: string; tags: string[] }) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      ...data,
      opted_in: true,
      added: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
    }
    setContacts(prev => [newContact, ...prev])
  }

  const handleDelete = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id))
    toast.success('Contact removed')
  }

  const handleBulkDelete = () => {
    setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)))
    toast.success(`${selectedIds.length} contacts removed`)
    setSelectedIds([])
  }

  const handleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? filtered.map(c => c.id) : [])

  const handleSelectRow = (id: string, checked: boolean) =>
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id))

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full lg:flex-1 lg:max-w-xs transition-colors focus-within:border-green-500 focus-within:bg-white">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="bg-transparent border-none outline-none text-[13.5px] text-gray-900 placeholder:text-gray-400 flex-1"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {SEGMENTS.map(seg => (
            <Chip key={seg} active={segment === seg} onClick={() => setSegment(seg)}>{seg}</Chip>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:ml-auto flex-wrap">
          {selectedIds.length > 0 && (
            <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={handleBulkDelete}>
              Delete ({selectedIds.length})
            </Button>
          )}
          <Button variant="ghost" size="sm" icon={<Upload size={13} />} onClick={() => setImportOpen(true)}>
            Import CSV
          </Button>
          <Button size="sm" icon={<UserPlus size={13} />} onClick={() => setAddOpen(true)}>
            Add Contact
          </Button>
        </div>
      </div>

      {/* Count */}
      <p className="text-[12.5px] text-gray-400">
        Showing <strong className="text-gray-700">{filtered.length}</strong> contact{filtered.length !== 1 ? 's' : ''}
        {selectedIds.length > 0 && <span> · <strong className="text-gray-700">{selectedIds.length}</strong> selected</span>}
      </p>

      <Table
        columns={[
          { key: 'name',     header: 'Name',      render: r => <span className="td-primary">{r.name}</span> },
          { key: 'phone',    header: 'Phone', headerClassName: 'col-hide-sm', cellClassName: 'col-hide-sm', render: r => <span className="td-mono">{formatPhone(r.phone)}</span> },
          { key: 'tags',     header: 'Tags', headerClassName: 'col-hide-md', cellClassName: 'col-hide-md', render: r => (
            <div className="flex flex-wrap gap-1">
              {r.tags.map(t => <Badge key={t} variant="gray">{t}</Badge>)}
            </div>
          )},
          { key: 'opted_in', header: 'Opt-in',    render: r => (
            <Badge variant={r.opted_in ? 'green' : 'red'} dot={r.opted_in}>
              {r.opted_in ? 'Opted in' : 'Opted out'}
            </Badge>
          )},
          { key: 'added',    header: 'Added', headerClassName: 'col-hide-md', cellClassName: 'col-hide-md', render: r => r.added },
          { key: 'action',   header: '',          width: '60px', render: r => (
            <button
              onClick={e => { e.stopPropagation(); handleDelete(r.id) }}
              className="text-[12px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              Remove
            </button>
          )},
        ]}
        data={filtered}
        selectable
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        emptyText="No contacts found. Try a different search or filter."
      />

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      <ImportCSVModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
