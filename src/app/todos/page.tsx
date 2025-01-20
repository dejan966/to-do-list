import AddTodoForm from '@/features/AddTodoForm';
import { Container, VStack, Text } from '@chakra-ui/react';
import TodoList from '@/features/TodoList';
import { getTodos } from '@/server/todos';

const TodosPage = async () => {
  const todos = await getTodos();
  return (
    <Container m="4" gap="40px">
      <VStack pb="4">
        <AddTodoForm />
      </VStack>
      {todos.length > 0 ? <TodoList todos={todos} /> : <Text>No todos yet</Text>}
    </Container>
  );
};

export default TodosPage;
