import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
import { heightRem } from "../../themes/dimensions"

interface VerticalSpaceProps {
  h?: number
}

const VerticalSpace: React.FC<VerticalSpaceProps> = ({ h = 2 }) => {
  return <View style={styles.height(h)} />
}

export default VerticalSpace

const styles = StyleSheet.create({
  height: (h: number): ViewStyle => ({
    height: heightRem * h,
  }),
})
