import { View, StyleSheet } from "react-native"
import { widthRem } from "../../themes/dimensions"

const HorizontalSpace = ({ w = 5 }) => {
  return <View style={styles.width(w)} />
}

const styles = StyleSheet.create({
  width: (w) => ({
    width: widthRem * w,
  }),
})

export default HorizontalSpace
