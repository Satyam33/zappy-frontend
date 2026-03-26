import { useState } from 'react'
import { UserPlus, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Table } from '../../components/ui/Table'
import toast from 'react-hot-toast'

interface Member { id: string; name: string; email: string; role: 'admin' | 'agent' }

const INITIAL: Member[] = [
  { id: '1', name: 'Rohan Verma',  email: 'rohan@demo.com',  role: 'admin' },
  { id: '2', name: 'Sneha Patel',  email: 'sneha@demo.com',  role: 'agent' },
  { id: '3', name: 'Amit Sharma',  email: 'amit@demo.com',   role: 'agent' },
]

export const TeamMembers = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleInvite = () => {
    if (!inviteEmail.includes('@')) { toast.error('Enter a valid email'); return }
    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: 'agent',
    }
    setMembers(p => [...p, newMember])
    setInviteEmail('')
    toast.success(`Invite sent to ${inviteEmail}`)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-[Syne,sans-serif] text-[15px] font-semibold text-gray-900">Team Members</h3>
        <span className="text-[12.5px] text-gray-400">{members.length} members</span>
      </div>

      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <input
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleInvite()}
          placeholder="colleague@company.com"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
        />
        <Button size="sm" icon={<UserPlus size={13} />} onClick={handleInvite}>
          Invite
        </Button>
      </div>

      <Table
        columns={[
          { key: 'name',   header: 'Name',   render: r => <span className="td-primary">{r.name}</span> },
          { key: 'email',  header: 'Email',  render: r => r.email },
          { key: 'role',   header: 'Role',   render: r => (
            <Badge variant={r.role === 'admin' ? 'accent' : 'blue'}>{r.role === 'admin' ? 'Admin' : 'Agent'}</Badge>
          )},
          { key: 'action', header: '', width: '60px', render: r => (
            r.role !== 'admin' ? (
              <button
                onClick={() => { setMembers(p => p.filter(m => m.id !== r.id)); toast.success('Member removed') }}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            ) : null
          )},
        ]}
        data={members}
        emptyText="No team members yet"
      />
    </div>
  )
}
