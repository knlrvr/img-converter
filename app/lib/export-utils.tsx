import type { ProcessedDot } from "./img-processing"
import type { GridSize } from "./grid-utils"
import { getDotSize, getDotGap } from "./grid-utils"

export function exportAsPNG(dots: ProcessedDot[], gridSize: GridSize, transparentBackground: boolean): void {
  const dotSize = getDotSize(gridSize)
  const gap = getDotGap(dotSize)
  const padding = 16

  const exportCanvas = document.createElement("canvas")
  const ctx = exportCanvas.getContext("2d")
  if (!ctx) return

  const canvasWidth = gridSize.width * (dotSize + gap) - gap + padding * 2
  const canvasHeight = gridSize.height * (dotSize + gap) - gap + padding * 2

  exportCanvas.width = canvasWidth
  exportCanvas.height = canvasHeight

  if (!transparentBackground) {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  dots.forEach((dot) => {
    const x = padding + dot.x * (dotSize + gap)
    const y = padding + dot.y * (dotSize + gap)

    ctx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})`
    ctx.beginPath()
    ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, 2 * Math.PI)
    ctx.fill()
  })

  exportCanvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `dot-grid-${gridSize.width}x${gridSize.height}.png`
      a.click()
      URL.revokeObjectURL(url)
    }
  })
}

export function exportAsSVG(dots: ProcessedDot[], gridSize: GridSize, transparentBackground: boolean): void {
  const dotSize = getDotSize(gridSize)
  const gap = getDotGap(dotSize)
  const padding = 16

  const svgWidth = gridSize.width * (dotSize + gap) - gap + padding * 2
  const svgHeight = gridSize.height * (dotSize + gap) - gap + padding * 2

  let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`

  if (!transparentBackground) {
    svgContent += `<rect width="100%" height="100%" fill="#ffffff"/>`
  }

  dots.forEach((dot) => {
    const x = padding + dot.x * (dotSize + gap) + dotSize / 2
    const y = padding + dot.y * (dotSize + gap) + dotSize / 2
    svgContent += `<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})"/>`
  })

  svgContent += "</svg>"

  const blob = new Blob([svgContent], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `dot-grid-${gridSize.width}x${gridSize.height}.svg`
  a.click()
  URL.revokeObjectURL(url)
}
