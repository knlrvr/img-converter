export interface GridSize {
  width: number
  height: number
}

export const GRID_SIZE_OPTIONS = [
  { label: "Small Square (8 × 8)", width: 8, height: 8 },
  { label: "Small Wide (16 × 8)", width: 16, height: 8 },
  { label: "Medium Square (16 × 16)", width: 16, height: 16 },
  { label: "Medium Wide (32 × 16)", width: 32, height: 16 },
  { label: "Large Square (32 × 32)", width: 32, height: 32 },
  { label: "Large Wide (64 × 32)", width: 64, height: 32 },
  { label: "XL Square (64 x 64)", width: 64, height: 64},
  { label: "XL Wide (128 x 64)", width: 128, height: 64}
]

export function getDotSize(gridSize: GridSize): number {
  return gridSize.width <= 32 ? 12 : gridSize.width <= 64 ? 8 : 6
}

export function getDotGap(dotSize: number): number {
  return Math.max(1, Math.floor(dotSize * 0.2))
}
