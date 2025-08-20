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

  return (
    <div
      className=""
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
        gap: `${gap}px`,
        width: "fit-content",
      }}
    >
      {dots.map((dot, index) => (
        <div
          key={index}
          className="rounded-full"
          style={{
            backgroundColor: `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${dot.color.a})`,
            width: `${dotSize}px`,
            height: `${dotSize}px`,
          }}
        />
      ))}
    </div>
  )
}
