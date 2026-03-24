import React from "react"

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  return (
    <div className="confirm-delete">

      <p>{message}</p>

      <div className="confirm-actions">

        <button onClick={onCancel}>
          Annuler
        </button>

        <button onClick={onConfirm}>
          Supprimer
        </button>

      </div>

    </div>
  )
}