import React from "react"

// Props du modal (données + actions)
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

      {/* Message affiché */}
      <p>{message}</p>

      <div className="confirm-actions">
        {/* Bouton annuler */}
        <button onClick={onCancel}>
          Annuler
        </button>

        {/* Bouton confirmer */}
        <button onClick={onConfirm}>
          Supprimer
        </button>

      </div>

    </div>
  )
}