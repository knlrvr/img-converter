"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import DotGrid from "./components/dot-grid"
import { processImageFile, processImageToGrid, type ProcessedDot } from "./lib/img-processing"
import { GRID_SIZE_OPTIONS, type GridSize } from "./lib/grid-utils"
import { exportAsPNG, exportAsSVG } from "./lib/export-utils"

export default function Home() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [processedDots, setProcessedDots] = useState<ProcessedDot[]>([])
  const [gridSize, setGridSize] = useState<GridSize>({ width: 32, height: 32 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [exportFormat, setExportFormat] = useState<"png" | "svg">("png")
  const [transparentBackground, setTransparentBackground] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = useCallback(
    async (file: File, targetGridSize?: GridSize) => {
      if (!canvasRef.current) return

      setIsProcessing(true)
      const currentGridSize = targetGridSize || gridSize

      try {
        const data = await processImageFile(file, currentGridSize, canvasRef.current)
        const dots = processImageToGrid(data, currentGridSize)

        setImageData(data)
        setProcessedDots(dots)
        setCurrentFile(file)
      } catch (error) {
        console.error("Error processing image:", error)
      } finally {
        setIsProcessing(false)
      }
    },
    [gridSize],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processImage(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      processImage(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const exportGrid = useCallback(() => {
    if (processedDots.length === 0) return

    if (exportFormat === "png") {
      exportAsPNG(processedDots, gridSize, transparentBackground)
    } else {
      exportAsSVG(processedDots, gridSize, transparentBackground)
    }
  }, [processedDots, gridSize, exportFormat, transparentBackground])

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = GRID_SIZE_OPTIONS.find((option) => `${option.width}x${option.height}` === event.target.value)
    if (selectedOption) {
      const newGridSize = { width: selectedOption.width, height: selectedOption.height }
      setGridSize(newGridSize)
      if (currentFile) {
        processImage(currentFile, newGridSize)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Image to Dot Grid Converter</h1>
          <p className="text-slate-600 text-lg">Transform your images into beautiful pixelated dot grids</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col gap-2 w-full md:w-fit">
                <label htmlFor="gridSize" className="text-[#111] font-medium text-center">
                  Grid Size <em className="text-neutral-400">(w x h)</em>
                </label>
                <select
                  id="gridSize"
                  value={`${gridSize.width}x${gridSize.height}`}
                  onChange={handleGridSizeChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-[#111] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {GRID_SIZE_OPTIONS.map((option) => (
                    <option key={`${option.width}x${option.height}`} value={`${option.width}x${option.height}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-8 border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-600">Processing image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-700 font-medium mb-1">Drop an image here or click to browse</p>
                  <p className="text-slate-500 text-sm">Supports JPG, PNG, GIF, and other image formats</p>
                </div>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {processedDots.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 sm:mb-0">
                Your Dot Grid ({gridSize.width} × {gridSize.height})
              </h2>
            </div>

            <div className="flex justify-center overflow-hidden">
              <DotGrid dots={processedDots} gridSize={gridSize} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-end">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === "png"}
                    onChange={() => setExportFormat("png")}
                    className="w-4 h-4"
                  />
                  <span className="text-[#111] font-medium">PNG</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={exportFormat === "svg"}
                    onChange={() => setExportFormat("svg")}
                    className="w-4 h-4"
                  />
                  <span className="text-[#111] font-medium">SVG</span>
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transparentBackground}
                  onChange={(e) => setTransparentBackground(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-[#111] font-medium">Transparent</span>
              </label>

              <button
                onClick={exportGrid}
                className="cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Export {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  )
}
