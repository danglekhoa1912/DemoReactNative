import React, { useEffect, useRef, useState } from "react"
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native"

type dataType = {
  value: number | string
  label: number | string
}

interface WheelNumberPickerProps {
  data: dataType[]
  height: number
  textStyle?: StyleProp<TextStyle>
  selectedTextStyle?: StyleProp<TextStyle>
  unselectedTextStyle?: StyleProp<TextStyle>
  dividerWidth?: ViewStyle["borderBottomWidth"]
  dividerColor?: ViewStyle["borderBottomColor"]
  selectedValue?: number | string
  onValueChange?: (value: number | string) => void
}

function WheelNumberPicker({
  height = 25,
  textStyle,
  selectedTextStyle,
  unselectedTextStyle,
  dividerWidth = 1,
  dividerColor,
  selectedValue = 0,
  onValueChange,
  data = [],
}: WheelNumberPickerProps) {
  const [dataArray] = useState<dataType[]>([...data, ...data, ...data])
  const [value, setValue] = useState<number | string>(selectedValue)

  const flatListRef = useRef<FlatList>()
  const currentYOffset = useRef<number>(0)
  const numberOfValue = useRef<number>(data.length)
  const initialOffset = useRef<number>((data.length - 0.5) * height)

  useEffect(() => {
    if (!onValueChange) {
      return
    }
    onValueChange(value)
  }, [value, onValueChange])

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.contentOffset.y
    let index = Math.ceil((offsetY % initialOffset.current) / height)
    index = index < numberOfValue.current ? index : numberOfValue.current - 1
    const selectedValue = data[index].value
    if (value !== selectedValue) {
      setValue(selectedValue)
    }

    if (offsetY < currentYOffset.current) {
      if (offsetY <= initialOffset.current - height) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY + height * numberOfValue.current,
          animated: false,
        })
        currentYOffset.current = offsetY + height * numberOfValue.current
        return
      }
    }

    if (offsetY > currentYOffset.current) {
      if (offsetY > initialOffset.current + height) {
        flatListRef.current?.scrollToOffset({
          offset: offsetY - height * numberOfValue.current,
          animated: false,
        })
        currentYOffset.current = offsetY - height * numberOfValue.current
        return
      }
    }

    currentYOffset.current = offsetY
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          borderTopWidth: dividerWidth,
          borderBottomWidth: dividerWidth,
          borderColor: dividerColor,
          height,
          width: height * 1.2,
        }}
      />
      <View style={{ width: height * 1.2, height: height * 5 }}>
        <FlatList
          data={dataArray}
          onScroll={onScroll}
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={height}
          scrollEventThrottle={12}
          decelerationRate="fast"
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: "100%",
                  height,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={[textStyle, selectedTextStyle]}>{item.label}</Text>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

export default WheelNumberPicker