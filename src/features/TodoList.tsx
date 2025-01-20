'use client';

import { useState } from 'react';
import { TodoItem as TodoItemType } from '@/features/todoModels';
import { Button, HStack, Input, Kbd, Stack, Table, VStack } from '@chakra-ui/react';
import { completeTodo, deleteTodo, editTodo } from '@/server/todos';
import { Toaster, toaster } from '@/components/ui/toaster';
import getSafeError from '@/utils/safeError';
import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from '@/components/ui/action-bar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@/components/ui/pagination';
import SearchTodoForm from './SearchTodoForm';
import { CheckedState } from '@zag-js/checkbox';

const TodoList = ({ todos }: { todos: TodoItemType[] }) => {
  const [searchString, setSearchString] = useState('');

  /**
   * checkbox variables
   */

  // see if any of todos are completed
  const [selection, setSelection] = useState<string[]>(
    todos
      .filter((todo) => todo.completed == true)
      .map((todo) => {
        return todo.id;
      }),
  );

  // check if any item is selected
  const hasSelection = selection.length > 0;

  // check if all items are selected - false means every item is selected
  const indeterminate = hasSelection && selection.length < todos.length;

  /**
   * Pagination
   */

  // number of items per page
  const pageSize = 9;

  // current page
  const [page, setPage] = useState(1);

  // index start
  const startRange = (page - 1) * pageSize;

  // index end
  const endRange = startRange + pageSize;

  // change in db whether it's check or not
  const handleIsComplete = async (
    todo: TodoItemType,
    changes: {
      checked: CheckedState;
    },
  ) => {
    try {
      await completeTodo(todo.id, todo.completed);
      setSelection((prev) =>
        changes.checked ? [...prev, todo.id] : selection.filter((id) => id !== todo.id),
      );
    } catch (error) {
      toaster.create({
        title: getSafeError(error).name,
        type: 'error',
      });
    }
  };

  // check/uncheck all items at once in db
  const handleMultipleIsComplete = async (changes: { checked: CheckedState }) => {
    try {
      todos.map(async (todo) => await completeTodo(todo.id, todo.completed));
      setSelection(changes.checked ? todos.map((todo) => todo.id) : []);
    } catch (error) {
      toaster.create({
        title: getSafeError(error).name,
        type: 'error',
      });
    }
  };

  // css styling for checked items
  const decoration = (value: boolean) => {
    if (!value) {
      return 'none';
    } else {
      return 'line-through';
    }
  };

  // delete selected item/items in db
  const deleteItems = (ids: string[]) => {
    try {
      deleteTodo(ids);
      if (ids.length === 1) {
        toaster.create({
          title: 'Item successfully deleted',
          type: 'success',
        });
      } else if (ids.length > 1) {
        toaster.create({
          title: 'Items successfully deleted',
          type: 'success',
        });
      }

      const sCopy = ids.slice(0);

      sCopy.reverse().forEach((se) => {
        const element = selection.indexOf(se);
        selection.splice(element, 1);
      });
    } catch (error) {
      toaster.create({
        title: getSafeError(error).name,
        type: 'error',
      });
    }
  };

  return (
    <>
      <Toaster />
      <VStack align="start" my="2">
        <SearchTodoForm searchString={searchString} setSearchString={setSearchString} />
      </VStack>
      <hr />
      <Stack width="full" gap="5">
        <Table.Root interactive>
          <Table.Header>
            <Table.Row height={9}>
              <Table.ColumnHeader>
                <Checkbox
                  top="1"
                  aria-label="Select row"
                  checked={indeterminate ? 'indeterminate' : selection.length > 0}
                  onCheckedChange={(changes) => {
                    handleMultipleIsComplete(changes);
                  }}
                />
              </Table.ColumnHeader>
              <Table.ColumnHeader>Item</Table.ColumnHeader>
              <Table.ColumnHeader>Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {searchString
              ? todos
                  .filter((todo) => todo.name.toLowerCase().includes(searchString.toLowerCase()))
                  .map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      handleIsComplete={handleIsComplete}
                      selection={selection}
                      decoration={decoration}
                    />
                  ))
              : todos
                  .slice(startRange, endRange)
                  .map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      handleIsComplete={handleIsComplete}
                      selection={selection}
                      decoration={decoration}
                    />
                  ))}
          </Table.Body>
        </Table.Root>
        <PaginationRoot
          count={todos.length}
          pageSize={pageSize}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack wrap="wrap">
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
        <ActionBarRoot open={hasSelection}>
          <ActionBarContent>
            <ActionBarSelectionTrigger>{selection.length} selected</ActionBarSelectionTrigger>
            <ActionBarSeparator />
            <Button colorPalette="red" size="sm" onClick={() => deleteItems(selection)}>
              Delete <Kbd>⌫</Kbd>
            </Button>
          </ActionBarContent>
        </ActionBarRoot>
      </Stack>
    </>
  );
};

export default TodoList;

const TodoItem = ({
  todo,
  handleIsComplete,
  selection,
  decoration,
}: {
  todo: TodoItemType;
  handleIsComplete: (
    todo: TodoItemType,
    changes: {
      checked: CheckedState;
    },
  ) => void;
  selection: string[];
  decoration: (comp: boolean) => string;
}) => {
  const [todoName, setTodoName] = useState(todo.name);

  const handleEdit = async (todoId: string, todoName: string) => {
    try {
      await editTodo(todoId, todoName);
      toaster.create({
        title: 'Item successfully updated',
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
    <>
      <Table.Row>
        <Table.Cell>
          <Checkbox
            top="1"
            aria-label="Select row"
            checked={selection.includes(todo.id)}
            onCheckedChange={(changes) => {
              handleIsComplete(todo, changes);
            }}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            textDecoration={decoration(todo.completed)}
            border="none"
            name="name"
            type="text"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
            disabled={!selection.includes(todo.id)}
          />
        </Table.Cell>
        <Table.Cell>
          <Button
            colorPalette="green"
            onClick={() => {
              handleEdit(todo.id, todoName);
            }}
            disabled={!selection.includes(todo.id)}
          >
            Edit
          </Button>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
