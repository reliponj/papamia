import { AdminModal } from '../AdminModal'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function AdminConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AdminModal title={title} open={open} onClose={onCancel}>
      <p className="admin-confirm__message">{message}</p>
      <div className="crm-form__actions">
        <button
          type="button"
          className={`btn btn--primary${danger ? ' btn--danger' : ''}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? '…' : confirmLabel}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </button>
      </div>
    </AdminModal>
  )
}
