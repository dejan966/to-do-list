'use client';

import { Button, HStack, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { addTodo } from '../server/todos';
import { Toaster, toaster } from '../components/ui/toaster';
import getSafeError from '../utils/safeError';

const AddTodoForm = () => {
  const [name, setName] = useState('');

  // add item to db
  const action = async (formData: FormData) => {
    try {
      await addTodo(formData);
      setName('');
      toaster.create({
        title: 'Item successfully added',
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: getSafeError(error).name,
        type: 'error',
      });
    }
  };

  return (
    <form action={action}>
      <HStack>
        <Input
          borderColor="gray.600"
          placeholder="Item"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="flushed"
        />
        <Button type="submit" disabled={name.trim() === ''}>
          Add
        </Button>
      </HStack>
      <Toaster />
    </form>
  );
};

export default AddTodoForm;
