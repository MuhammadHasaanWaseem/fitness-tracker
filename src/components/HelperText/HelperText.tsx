import React from "react"
import { StyleSheet, View } from "react-native"
import Text, { type TextProps } from "../Text"
import { colors } from "../../themes"

const spacing = {
  small: 6,
  medium: 10,
  large: 15,
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: spacing.small },
  icon: {},
  text: {
    top: 4,
    marginLeft: spacing.small,
  },
})

export interface Props extends TextProps {
  color?: string
  text?: string
  tx?: string
}

export default function HelperText(props: Props) {
  const { color = colors.danger, text, style, tx, ...restprops } = props

  if (!text && !tx) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text color={color} style={[styles.text, style]} text={text} tx={tx} {...restprops} />
    </View>
  )
}
