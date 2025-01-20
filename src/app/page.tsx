import { Heading, Text, VStack } from '@chakra-ui/react';

export default function Home() {
  return (
    <VStack p="10">
      <Heading p="10px">To Do List app</Heading>
      <Text>
        This app is about showcasing a to do list. It can be usefull for when you go shopping for
        example. You can add new items to the list, cross them out when you have the item in your
        shopping cart and even search desired items. Additionally you can alse edit the item or
        delete the item.
      </Text>
    </VStack>
  );
}
