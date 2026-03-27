import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmActionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  subtitle?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'danger' | 'primary' | 'ghost' | 'accent'
}

export const ConfirmActionModal = ({
  open,
  onClose,
  onConfirm,
  title,
  subtitle,
  description,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmVariant = 'danger',
}: ConfirmActionModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    subtitle={subtitle}
    width="w-[420px]"
    fullWidthOnMobile={false}
    centerOnMobile
    footer={
      <>
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={async () => {
            await onConfirm()
            onClose()
          }}
        >
          {confirmText}
        </Button>
      </>
    }
  >
    {description ? <p className="text-[13px] text-gray-600">{description}</p> : null}
  </Modal>
)
