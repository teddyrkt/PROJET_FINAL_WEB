type Props = {
  onClose: () => void
  onChangeBackground: (bg: string) => void
}

export default function BoardMenu({ onClose, onChangeBackground }: Props) {

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      const imageUrl = reader.result as string
      onChangeBackground(imageUrl)
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="board-menu-overlay" onClick={onClose}>
      <div className="board-menu" onClick={(e) => e.stopPropagation()}>

        <div className="menu-header">
          <span>Menu</span>
          <button onClick={onClose}>✕</button>
        </div>

        <h4>Changer le fond d'écran</h4>

        <div className="background-grid">

          <div className="bg-option bg1"
            onClick={() => onChangeBackground('bg1')}
          />

          <div className="bg-option bg2"
            onClick={() => onChangeBackground('bg2')}
          />

          <div className="bg-option bg3"
            onClick={() => onChangeBackground('bg3')}
          />

          <div className="bg-option bg4"
            onClick={() => onChangeBackground('bg4')}
          />

        </div>

        {/* IMPORT IMAGE */}

        <label className="upload-background">
          Importer une image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

      </div>
    </div>
  )
}