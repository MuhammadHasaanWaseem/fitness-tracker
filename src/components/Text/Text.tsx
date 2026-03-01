import React from "react"
import {
  type Insets,
  Text as ReactNativeText,
  type TextStyle,
  TouchableOpacity,
} from "react-native"
import type { TextProps as RNTextProps } from "./Text.props"
import { colors } from "../../themes"

interface TextProps extends RNTextProps {
  hitSlop?: Insets
}
export default function Text(props: TextProps) {
  const {
    center,
    text,
    children,
    style: styleOverride,
    containerStyle,
    touchable,
    underline,
    hitSlop,
    allowFontScaling = false,
    maxCharacterLength,
    top,
    bottom,
    left,
    right,
    fontWeight,
    fontSize,
    fontFamily,
    ...rest
  } = props
  let { color = colors.text } = props

  const content = text || children

  const truncatedContent =
    typeof content === "string" && maxCharacterLength && content.length > maxCharacterLength
      ? content.slice(0, maxCharacterLength) + "..."
      : content

  const customStyle: TextStyle = {
    textAlign: center ? "center" : "left",
    textDecorationLine: underline ? "underline" : "none",
    marginTop: top ?? undefined,
    marginBottom: bottom ?? undefined,
    marginStart: left ?? undefined,
    marginEnd: right ?? undefined,
    fontWeight,
    fontSize,
    fontFamily,
    color,
  }

  const style = [customStyle, styleOverride]

  if (touchable) {
    return (
      <TouchableOpacity hitSlop={hitSlop} onPress={props?.onPress} style={containerStyle}>
        <ReactNativeText {...rest} style={style} allowFontScaling={allowFontScaling}>
          {truncatedContent}
        </ReactNativeText>
      </TouchableOpacity>
    )
  }
  return (
    <ReactNativeText {...rest} style={style}>
      {truncatedContent}
    </ReactNativeText>
  )
}
