'use client';

import { HStack, Input } from '@chakra-ui/react';

const SearchTodoForm = ({
  searchString,
  setSearchString,
}: {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <form>
      <HStack>
        <Input
          borderColor="gray.600"
          placeholder="Search"
          name="name"
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </HStack>
    </form>
  );
};

export default SearchTodoForm;
