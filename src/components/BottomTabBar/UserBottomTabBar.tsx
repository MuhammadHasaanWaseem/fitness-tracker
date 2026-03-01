import { StyleSheet, View, TouchableOpacity, Image } from "react-native"
import React from "react"
import { useRoute } from "@react-navigation/native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { appIcons, colors, fonts, ResponsiveFonts } from "../../themes"
import Text from "../Text"
import { hp, wp } from "../../themes/dimensions"
import { USER_ROUTES } from "../../constants"

const UserBottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const route = useRoute()

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        let iconSource
        switch (route.name) {
          case USER_ROUTES.USER_MY_PAKAGE_SCREEN:
            iconSource = appIcons.pakageIcon
            break
          case USER_ROUTES.USER_HISTORY_SCREEN:
            iconSource = appIcons.historyIcon
            break
          case USER_ROUTES.USER_NOTIFICATION_SCREEN:
            iconSource = appIcons.notificationIcon
            break
          case USER_ROUTES.USER_MORE_SCREEN:
            iconSource = appIcons.profileIcon
            break
        }

        return (
          <TouchableOpacity key={index} onPress={onPress} style={styles.tabButton}>
            {/* {isFocused && <View style={styles.activeIndicator} />} */}
            <Image source={iconSource} style={[styles.icon, isFocused && styles.activeIcon]} />
            <Text
              style={[styles.label, isFocused && styles.activeLabel]}
              fontFamily={fonts.poppinsBold700}
              fontSize={ResponsiveFonts.px12}
            >
              {
                label === USER_ROUTES.USER_MY_PAKAGE_SCREEN
                  ? "My Package"
                  : label === USER_ROUTES.USER_HISTORY_SCREEN
                    ? "History"
                    : label === USER_ROUTES.USER_NOTIFICATION_SCREEN
                      ? "Notification"
                      : "Profile"
              }

            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default UserBottomTabBar

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    height: hp(9),
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: hp(1),
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: hp(0),
    width: "100%",
    height: 3,
    backgroundColor: colors.bluish,
  },
  icon: {
    width: wp(6),
    height: wp(6),
    tintColor: colors.t4,
  },
  activeIcon: {
    tintColor: colors.primary,
  },
  label: {
    // marginTop: 4,
    paddingTop: hp(0.5),
    fontSize: ResponsiveFonts.px11,
    color: colors.t4,
  },
  activeLabel: {
    color: colors.primary,
  },
})
