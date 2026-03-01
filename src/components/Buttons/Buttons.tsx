import React from "react"
import {
  StyleSheet,
  ActivityIndicator,
  type TextStyle,
  type GestureResponderEvent,
  type ViewStyle,
  type TouchableHighlightProps,
  TouchableOpacity,
  Dimensions,
  StyleProp,
} from "react-native"
import Text from "../Text"
import { hp, screenRem } from "../../themes/dimensions"
import { colors, fonts, ResponsiveFonts } from "../../themes"
const { width } = Dimensions.get("screen")

export interface Props extends TouchableHighlightProps {
  variant?: keyof typeof variants
  color?: string
  disabledColor?: string
  contentColor?: string
  disabledTextColor?: string
  borderColor?: string
  loading?: boolean
  text?: string
  children?: React.ReactNode
  textStyle?: StyleProp<TextStyle>
  flex?: boolean
  small?: boolean
  top?: number
  left?: number
  right?: number
  bottom?: number
  tx?: string
  onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined
  LeftIcon?: (props: { color: string; style: ViewStyle }) => React.FunctionComponentElement<any>
  RightIcon?: (props: { color: string; style: ViewStyle }) => React.FunctionComponentElement<any>
}

const spacing = {
  small: 6, //Before
  // small: screenRem * 0.3,
  medium: screenRem * 0.8,
  large: 15,
}

const paddingVertical = screenRem * 0.4
const paddingHorizontal = screenRem * 0.4

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: paddingVertical,
    paddingHorizontal: spacing.large,
    borderRadius: screenRem * 0.5,
    height: hp(6),
  },
  smallContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.small,
    maxWidth: width * 0.3,
  },
  buttonTextStyle: {
    textAlign: "center",
    fontFamily: fonts.poppinsBold700,
    fontSize: ResponsiveFonts.px18,
  },
})

const variants = {
  primary: {
    textColor: colors.buttonText,
    backgroundColor: colors.primary,
    disabledTextColor: colors.mutedText,
    disabledBackgroundColor: colors.muted,
  },
  secondary: {
    textColor: colors.buttonText,
    backgroundColor: colors.secondary,
    disabledTextColor: colors.mutedText,
    disabledBackgroundColor: colors.muted,
  },
  text: {
    textColor: colors.text,
    backgroundColor: colors.transparent,
    disabledTextColor: colors.mutedText,
    disabledBackgroundColor: colors.transparent,
  },
  outline: {
    textColor: colors.primary,
    backgroundColor: colors.transparent,
    disabledTextColor: colors.primary,
    disabledBackgroundColor: colors.transparent,
    borderColor: colors.primary,
    mutedBorderColor: colors.primary,
  },
}

export default function Button(props: Props) {
  const {
    variant = "primary",
    color,
    disabledColor,
    contentColor,
    disabledTextColor,
    textStyle,
    loading,
    text,
    children,
    style,
    flex = false,
    LeftIcon,
    RightIcon,
    small,
    top,
    bottom,
    left,
    right,
    tx,
    ...rest
  } = props

  const V = variants[variant]

  const _backgroundColor = props.disabled
    ? disabledColor || V.disabledBackgroundColor
    : color || V.backgroundColor

  const _textColor = props.disabled
    ? disabledTextColor || V.disabledTextColor
    : contentColor || V.textColor

  const content = children || (
    <Text style={[styles.buttonTextStyle, textStyle]} color={_textColor} text={text} tx={tx} />
  )

  const customStyle: ViewStyle = {
    flex: flex ? 1 : 0,
    backgroundColor: _backgroundColor,
    marginTop: top ?? undefined,
    marginBottom: bottom ?? undefined,
    marginLeft: left ?? undefined,
    marginRight: right ?? undefined,
    borderWidth: variant === "outline" ? screenRem * 0.09 : undefined,
    paddingVertical: variant === "outline" ? paddingVertical - screenRem * 0.06 : paddingVertical,
    borderColor: variant === "outline" ? _textColor : undefined,
  }

  return (
    <TouchableOpacity
      style={[styles.container, small && styles.smallContainer, customStyle, style]}
      activeOpacity={0.5}
      {...rest}
    >
      <>
        {LeftIcon && <LeftIcon color={_textColor} style={{ marginRight: spacing.medium }} />}
        {content}
        {RightIcon && <RightIcon color={_textColor} style={{ marginLeft: spacing.medium }} />}
        {loading && <ActivityIndicator style={{ marginLeft: spacing.small }} color={_textColor} />}
      </>
    </TouchableOpacity>
  )
}
