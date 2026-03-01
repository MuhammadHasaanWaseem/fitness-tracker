import React from "react"
import { SvgXml } from "react-native-svg"

interface SvgIconProps {
  xml: string
  width?: number
  height?: number
  color?: string
}

export function SvgIcon({ xml, width = 24, height = 24, color }: SvgIconProps) {
  const filled = color ? xml.replace(/stroke="currentColor"/g, `stroke="${color}"`).replace(/fill="currentColor"/g, `fill="${color}"`) : xml
  return <SvgXml xml={filled} width={width} height={height} />
}
