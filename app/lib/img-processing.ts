export interface ProcessedDot {
  x: number
  y: number
  color: { r: number; g: number; b: number; a: number }
}

export function processImageToGrid(imageData: ImageData, gridSize: { width: number; height: number }): ProcessedDot[] {
  const { width, height, data } = imageData
  const cellWidth = width / gridSize.width
  const cellHeight = height / gridSize.height

  const dots: ProcessedDot[] = []

  for (let row = 0; row < gridSize.height; row++) {
    for (let col = 0; col < gridSize.width; col++) {
      const x = Math.floor(col * cellWidth + cellWidth / 2)
      const y = Math.floor(row * cellHeight + cellHeight / 2)
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]
      const a = data[index + 3]

      dots.push({
        x: col,
        y: row,
        color: { r, g, b, a: a / 255 },
      })
    }
  }

  return dots
}

export function processImageFile(
  file: File,
  gridSize: { width: number; height: number },
  canvas: HTMLCanvasElement,
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      canvas.width = gridSize.width
      canvas.height = gridSize.height

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      resolve(data)
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}
