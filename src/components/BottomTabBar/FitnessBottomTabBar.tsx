import React from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  type BottomTabBarProps,
} from "react-native"
import Text from "../Text"
import { SvgIcon } from "../../utils"
import { iconWorkout, iconHistory, iconAdd, iconProfile } from "../../utils/svgIcons"
import {
  ACTIVE_WORKOUT_SCREEN,
  WORKOUT_HISTORY_SCREEN,
  PROFILE_SCREEN,
} from "../../constants"
import { colors, fonts, ResponsiveFonts } from "../../themes"
import { hp, wp } from "../../themes/dimensions"

export default function FitnessBottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index
        const isAdd = route.name === "Add"
        const label =
          route.name === ACTIVE_WORKOUT_SCREEN
            ? "Workout"
            : route.name === WORKOUT_HISTORY_SCREEN
              ? "History"
              : route.name === PROFILE_SCREEN
                ? "Profile"
                : ""
        const onPress = () => {
          if (isAdd) {
            navigation.navigate(ACTIVE_WORKOUT_SCREEN, { openAddModal: true })
            return
          }
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }
        const icon =
          route.name === ACTIVE_WORKOUT_SCREEN
            ? iconWorkout
            : route.name === WORKOUT_HISTORY_SCREEN
              ? iconHistory
              : route.name === PROFILE_SCREEN
                ? iconProfile
                : iconAdd
        if (isAdd) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.fab}
              activeOpacity={0.8}
            >
              <SvgIcon xml={icon} width={28} height={28} color={colors.white} />
            </TouchableOpacity>
          )
        }
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <SvgIcon
              xml={icon}
              width={24}
              height={24}
              color={isFocused ? colors.primary : colors.t4}
            />
            <Text
              text={label}
              fontFamily={fonts.poppinsSemiBold600}
              fontSize={ResponsiveFonts.px11}
              color={isFocused ? colors.primary : colors.t4}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    height: hp(8),
    paddingBottom: hp(1),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  fab: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -hp(2),
  },
})
