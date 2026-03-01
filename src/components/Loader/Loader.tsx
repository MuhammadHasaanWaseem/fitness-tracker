import { ActivityIndicator, Modal, StyleSheet, View } from "react-native"
import Text from "../Text"
import { colors } from "../../themes"

type WaitProps = { visible?: boolean }

const Loader = ({ visible = true }: WaitProps) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <ActivityIndicator size={45} color={colors.p1} />
          <Text style={styles.text}>{"Processing..."}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    flexDirection: "row",
    minWidth: "60%",
    backgroundColor: "white",
    borderRadius: 8,
    minHeight: 70,
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  text: {
    fontSize: 14,
    marginLeft: "5%",
  },
})

export default Loader
