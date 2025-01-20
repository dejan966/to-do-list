import { Link } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

const Navigation = () => {
  return (
    <Flex
      top="5"
      height="8vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      flexDir="row"
      justifyContent='flex-end'
    >
      <Flex >
        <Link fontWeight="semibold" mr="4" href="/">
          Home
        </Link>
        <Link fontWeight="semibold" mr="4" href="/todos">
          List Items
        </Link>
      </Flex>
    </Flex>
  );
};

export default Navigation;
