import MaskedView from '@react-native-masked-view/masked-view';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

interface IItem {
  item: any;
  i: any;
  scrollPosition: any;
  h: any;
  half: any;
  renderChild: any;
}

interface IFlatListPicker {
  data: any[];
  itemHeight?: number;
  numberVisibleItem?: number;
  opacityInactiveItem?: number;
  initialValue?: any;
  isDate?: boolean;
  infiniteScroll?: boolean;
  numColumns?: number;
  currentColumn?: number;
  renderChild?: (item: any) => React.ReactNode;
  onValueChange?: (value: any) => void;
}

const FlatListPicker = React.memo((props: IFlatListPicker) => {
  const {
    data,
    itemHeight: h = 30,
    numberVisibleItem: n = 5,
    opacityInactiveItem = 0.5,
    onValueChange,
    renderChild,
    initialValue,
    isDate = false,
    infiniteScroll = false,
    currentColumn,
    numColumns,
  } = props;
  const [dates, setDates] = useState<any[]>(data);
  const wheelRef = useRef<FlatList<number>>(null);
  const [loadMoreData,setLoadMoreData] = useState(false)

  const generateDates = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const generatedDates = [];
    let currentDate = start;

    while (currentDate.isBefore(end)) {
      generatedDates.push(currentDate);
      currentDate = currentDate.add(1, 'day');
    }

    return generatedDates;
  };

  const loadMoreDatesForward = () => {
    const lastDate = dates?.[dates.length - 1] || dayjs(new Date());
    const newDates = generateDates(
      lastDate.add(1, 'day'),
      lastDate.add(30, 'days'),
    );
    setDates([...dates, ...newDates]);
  };

  const loadMoreDatesBackward = (offSetY: number) => {
    console.log(offSetY,loadMoreData)
    if(offSetY > 100 || !(dates[0] instanceof dayjs) || loadMoreData) {
      setLoadMoreData(false)
      return
    }
    setLoadMoreData(true)
    const firstDate = dates[0];
    const newDates = generateDates(
      firstDate.subtract(30, 'days'),
      firstDate.subtract(1, 'day'),
    );
    console.log(offSetY + newDates.length * h)
    wheelRef.current?.scrollToOffset({
      animated: false,
      offset: offSetY + newDates.length * h,
    });
    console.log(1)
    setDates([...newDates, ...dates]);
  };
  // {
  //   // array of data
  //   data = [],
  //   // height of each row in wheel
  //   itemHeight: h = 30,
  //   // it should be odd number (3,5,7,9)
  //   numberVisibleItem: n = 5,
  //   // opacity of inactive item from above and under active item
  //   opacityInactiveItem = 0.5,
  //   // listen when wheel finish scroll to value.
  //   onValueChange = () => {},
  //   // child inside a row of Flatlist
  //   renderChild = ({ _, index }) => (
  //     <Text style={styles.label}>Item {index}</Text>
  //   ),
  //   // initial index that wheel display first.
  //   initialIndex = -1,
  // }
  const half = (n - 1) / 2;
  const scrollPosition = useSharedValue(0);

  const renderItem = ({item, index}) => {
    return (
      <Item
        item={item}
        i={index}
        h={h}
        scrollPosition={scrollPosition}
        half={half}
        renderChild={renderChild}
      />
    );
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollPosition.value = event.contentOffset.y / h;
      runOnJS(loadMoreDatesBackward)(event.contentOffset.y)
    }
  });

  const onEndReached = () => {
    if(isDate){
      loadMoreDatesForward()
    }
    // Handle the end of the list to create an infinite scroll effect
    // For example, you can scroll back to the initial years
    wheelRef.current?.scrollToIndex({animated: true, index: data.length -1});
  };

  const currentPosition = useMemo(() => {
    if (initialValue instanceof dayjs) {
      const index = data?.findIndex(value => value.isSame(initialValue));
      return index === -1 ? 0 : index;
    }
    return data?.indexOf(initialValue) || 0;
  }, [data, initialValue]);
  useEffect(() => {
    if(infiniteScroll){
      setDates([...data, ...data, ...data])
      return
    }
    setDates(data);
  }, [data, infiniteScroll]);

  return (
    <View style={{height: n * h}}>
      <MaskedView
        style={{
          flex: 1,
          flexDirection: 'row',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: 20,
        }}
        maskElement={
          <Fragment>
            <View
              style={{
                backgroundColor: `rgba(0,0,0,${opacityInactiveItem})`,
                height: h * half,
              }}
            />
            <View
              style={[
                {
                  height: h,
                  backgroundColor: `red`,
                },
                currentColumn === 1 && {
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                },
                currentColumn === numColumns && {
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                },
              ]}
            />
            <View
              style={{
                backgroundColor: `rgba(0,0,0,${opacityInactiveItem})`,
                height: h * half,
              }}
            />
          </Fragment>
        }>
        <Animated.FlatList
          ref={wheelRef}
          windowSize={5}
          initialNumToRender={21}
          contentContainerStyle={{
            paddingTop: h * half,
            paddingBottom: h * half,
          }}
          getItemLayout={(data, index) => ({
            length: h,
            offset: h * index,
            index,
          })}
          initialScrollIndex={currentPosition}
          snapToOffsets={dates?.map((x, i) => i * h)}
          snapToAlignment="center"
          keyExtractor={(_,index) => index.toString()}
          data={dates}
          renderItem={renderItem}
          decelerationRate={0.97}
          onScroll={scrollHandler}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          fadingEdgeLength={h}
          onMomentumScrollEnd={e => {
            onValueChange?.(
              dates?.[Math.round(e.nativeEvent.contentOffset.y / h)],
            );
          }}
          snapToInterval={40} // Adjust based on your item height
          onEndReached={onEndReached}
          onEndReachedThreshold={1} // Adjust based on your needs
        />
      </MaskedView>
    </View>
  );
});

const Item = React.memo(
  (props: IItem) => {
    const {h, half, i, item, renderChild, scrollPosition} = props;
    const animatedItem = useDerivedValue(() => {
      const v = (scrollPosition.value - i) / (half + 1);
      if (v <= -1) {
        return -1;
      }
      if (v >= 1) {
        return 1;
      }
      return v;

      // interpolate(scrollPosition.value, [i - half - 1, i, i + half + 1], [-1, 0, 1], Extrapolate.CLAMP)
    });

    const childViewStyle = useAnimatedStyle(() => ({
      transform: [
        {perspective: half * 100},
        {rotateX: 90 * animatedItem.value + 'deg'},
        {
          scale: 1 - 0.1 * Math.abs(animatedItem.value),
        },
      ],
    }));

    return (
      <Animated.View style={[styles.item, {height: h}, childViewStyle]}>
        {renderChild({item, index: i})}
      </Animated.View>
    );
  },
  () => true,
);

const TrudiDatePicker = () => {
  const [dates, setDates] = useState<dayjs.Dayjs[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
    dayjs(new Date()),
  );

  const periods = ['AM', 'PM'];

  const hours = new Array(12).fill(0).map((_, i) => i + 1);

  const minutes = new Array(60).fill(0).map((_, i) => i + 1);

  const handleChange =
    (type: 'hour' | 'minute' | 'period' | 'date') => (data: any) => {
      switch (type) {
        case 'hour':
        case 'minute':
          const newTime = selectedDate.set(type, data);
          setSelectedDate(newTime);
          break;
        case 'period':
          const newPeriod = selectedDate.set(
            'hour',
            data === 'AM'
              ? selectedDate.hour() % 12
              : (selectedDate.hour() % 12) + 12,
          );
          setSelectedDate(newPeriod);
          break;
        case 'date':
          const newDate = dayjs(data).set('hour', selectedDate.hour());
          newDate.set('minute', selectedDate.minute());
          newDate.set('second', 0);
          setSelectedDate(newDate);
          break;
        default:
          break;
      }
    };

  useEffect(() => {
    // Tính ngày 1 tháng trước và 1 tháng sau
    const startDate = dayjs().subtract(1, 'month');
    const endDate = dayjs().add(1, 'month');

    // Tạo mảng ngày trong khoảng từ startDate đến endDate
    const generatedDates = [];
    let currentDate = startDate;

    while (currentDate.isBefore(endDate)) {
      generatedDates.push(currentDate);
      currentDate = currentDate.add(1, 'day').startOf('day');
    }

    setDates(generatedDates);
  }, []);

  const formatDate = (date: dayjs.Dayjs): string => {
    const today = dayjs().startOf('day');
    const formattedDate = date.format('ddd D MMM');
  
    if (date.isSame(today, 'day')) {
      return 'Today';
    }
  
    return formattedDate;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            flex: 3,
          }}>
          <FlatListPicker
            numColumns={4}
            currentColumn={1}
            data={dates}
            isDate
            initialValue={dayjs(new Date()).startOf('day')}
            renderChild={({item, index}) => (
              <Text style={styles.label}>{formatDate(item)}</Text>
            )}
            onValueChange={handleChange('date')}
          />
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <FlatListPicker
            numColumns={4}
            currentColumn={2}
            data={hours}
            initialValue={selectedDate.hour() % 12 || 12}
            renderChild={({item, index}) => (
              <Text style={styles.label}>{item}</Text>
            )}
            onValueChange={handleChange('hour')}
            infiniteScroll
          />
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <FlatListPicker
            numColumns={4}
            currentColumn={3}
            data={minutes}
            initialValue={selectedDate.minute()}
            renderChild={({item, index}) => (
              <Text style={styles.label}>{item}</Text>
            )}
            onValueChange={handleChange('minute')}
            infiniteScroll
          />
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <FlatListPicker
            numColumns={4}
            currentColumn={4}
            data={periods}
            initialValue={selectedDate.hour() < 12 ? 'AM' : 'PM'}
            renderChild={({item, index}) => (
              <Text style={styles.label}>{item}</Text>
            )}
            onValueChange={handleChange('period')}
          />
        </View>
      </View>
    </View>
  );
};

export { TrudiDatePicker };

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 31,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
