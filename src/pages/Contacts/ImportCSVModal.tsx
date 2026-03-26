import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
}

export const ImportCSVModal = ({ open, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) setFile(f)
    else toast.error('Please upload a .csv file')
  }

  const handleImport = () => {
    if (!file) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(`Importing ${file.name}...`)
      onClose()
      setFile(null)
    }, 1200)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import Contacts"
      subtitle="Upload a CSV file with columns: name, phone, tags (optional)"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button loading={loading} onClick={handleImport} disabled={!file}>Import Contacts</Button>
        </>
      }
    >
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${dragging ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={e => {
          const f = e.target.files?.[0]
          if (f) setFile(f)
        }} />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={22} className="text-green-600" />
            <div className="text-left">
              <p className="text-[13.5px] font-medium text-gray-900">{file.name}</p>
              <p className="text-[11.5px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setFile(null) }}
              className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[13.5px] font-medium text-gray-600 mb-1">Drop your CSV here</p>
            <p className="text-[12px] text-gray-400">or click to browse · .csv files only</p>
          </>
        )}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3">
        <p className="text-[11.5px] text-amber-700 leading-relaxed">
          <strong>Required columns:</strong> name, phone (E.164 format)<br />
          <strong>Optional:</strong> tags (comma-separated)<br />
          Phone numbers that aren't in E.164 format will be skipped.
        </p>
      </div>
    </Modal>
  )
}
