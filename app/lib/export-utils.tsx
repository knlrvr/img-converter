import type { ProcessedDot } from "./img-processing"
import type { GridSize } from "./grid-utils"
import { getDotSize, getDotGap } from "./grid-utils"

export function exportAsPNG(dots: ProcessedDot[], gridSize: GridSize, transparentBackground: boolean) {
  const qualityMultiplier = 4 // 4x resolution for crisp output
  const baseDotSize = getDotSize(gridSize)
  const baseGap = getDotGap(baseDotSize)

  // Scale up for high quality export
  const dotSize = baseDotSize * qualityMultiplier
  const gap = baseGap * qualityMultiplier
  const canvasWidth = gridSize.width * dotSize + (gridSize.width - 1) * gap
  const canvasHeight = gridSize.height * dotSize + (gridSize.height - 1) * gap

  const canvas = document.createElement("canvas")
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext("2d")!

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  if (!transparentBackground) {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  dots.forEach((dot) => {
    const x = dot.x * (dotSize + gap)
    const y = dot.y * (dotSize + gap)

    ctx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})`
    ctx.beginPath()
    ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2)
    ctx.fill()
  })

  const link = document.createElement("a")
  link.download = `dot-grid-${gridSize.width}x${gridSize.height}.png`
  link.href = canvas.toDataURL("image/png", 1.0)
  link.click()
}

export function exportAsSVG(dots: ProcessedDot[], gridSize: GridSize, transparentBackground: boolean) {
  const qualityMultiplier = 2 // 2x for SVG precision
  const baseDotSize = getDotSize(gridSize)
  const baseGap = getDotGap(baseDotSize)

  const dotSize = baseDotSize * qualityMultiplier
  const gap = baseGap * qualityMultiplier
  const canvasWidth = gridSize.width * dotSize + (gridSize.width - 1) * gap
  const canvasHeight = gridSize.height * dotSize + (gridSize.height - 1) * gap

  console.log("[v0] SVG Export - Dots count:", dots.length)
  console.log("[v0] SVG Export - Grid size:", gridSize)

  let svg = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">`

  if (!transparentBackground) {
    svg += `<rect width="100%" height="100%" fill="white"/>`
  }

  dots.forEach((dot) => {
    const x = dot.x * (dotSize + gap) + dotSize / 2
    const y = dot.y * (dotSize + gap) + dotSize / 2
    const hexColor = `#${Math.round(dot.color.r).toString(16).padStart(2, "0")}${Math.round(dot.color.g).toString(16).padStart(2, "0")}${Math.round(dot.color.b).toString(16).padStart(2, "0")}`
    const opacity = dot.color.a
    svg += `<circle cx="${x}" cy="${y}" r="${dotSize / 2}" fill="${hexColor}" fillOpacity="${opacity}"/>`
  })

  svg += "</svg>"

  console.log("[v0] SVG Export - Generated SVG length:", svg.length)

  const blob = new Blob([svg], { type: "image/svg+xml" })
  const link = document.createElement("a")
  link.download = `dot-grid-${gridSize.width}x${gridSize.height}.svg`
  link.href = URL.createObjectURL(blob)
  link.click()
}
