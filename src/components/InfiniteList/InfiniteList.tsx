import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface ListItem {
  id: string;
  text: string;
}

const InfiniteList: React.FC = () => {
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const infListRef = useRef<FlatList<ListItem>>(null);

  const fetchMoreData = () => {
    if (!loading) {
      setLoading(true);

      // Simulate fetching more data
      setTimeout(() => {
        const newData = generateData(5); // Generate new data
        setData((prevData) => [...prevData, ...newData]);
        setLoading(false);
      }, 1000); // Simulated delay for demonstration
    }
  };

  const handleEndReached = () => {
    fetchMoreData();
  };

  const handleBeginReached = () => {
    // Fetch data when the beginning of the list is reached
    if (!loading) {
      setLoading(true);

      // Simulate fetching more data in reverse direction
      setTimeout(() => {
        const newData = generateData(5);
        setData((prevData) => [...newData, ...prevData]);
        setLoading(false);
      }, 1000); // Simulated delay for demonstration
    }
  };

  const generateData = (count: number): ListItem[] => {
    // Generate dummy data
    const newData: ListItem[] = [];
    for (let i = 0; i < count; i++) {
      newData.push({ id: Math.random().toString(), text: `Item ${Math.random().toString().slice(2, 8)}` });
    }
    return newData;
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <FlatList
      ref={infListRef}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      onRefresh={fetchMoreData}
      refreshing={loading}
      ListFooterComponent={loading && <ActivityIndicator style={styles.loader} />}
      onBeginReached={handleBeginReached}
      onBeginReachedThreshold={0.1}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loader: {
    marginVertical: 20,
  },
});

export default InfiniteList;
