import type { ProcessedDot } from "../lib/img-processing"
import type { GridSize } from "../lib/grid-utils"
import { getDotSize, getDotGap } from "../lib/grid-utils"

interface DotGridProps {
  dots: ProcessedDot[]
  gridSize: GridSize
}

export default function DotGrid({ dots, gridSize }: DotGridProps) {
  const dotSize = getDotSize(gridSize)
  const gap = getDotGap(dotSize)

  const containerWidth = Math.min(
    gridSize.width * (dotSize + gap) - gap,
    typeof window !== "undefined" ? window.innerWidth - 48 : 800, // 48px for padding
  )
  const scaleFactor = containerWidth / (gridSize.width * (dotSize + gap) - gap)
  const responsiveDotSize = Math.max(2, dotSize * scaleFactor)
  const responsiveGap = Math.max(1, gap * scaleFactor)

  return (
    <div className="w-full flex justify-center overflow-x-auto">
      <div
        className="shrink-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
          gap: `${responsiveGap}px`,
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        {dots.map((dot, index) => (
          <div
            key={index}
            className="rounded-full"
            style={{
              backgroundColor: `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})`,
              width: `${responsiveDotSize}px`,
              height: `${responsiveDotSize}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
