'use client'

import { useState } from 'react'
import { TodoItem as TodoItemType } from '@/features/todoModels'
import {  Button, HStack, Input, Kbd, Stack, Table } from '@chakra-ui/react'
import { completeTodo, deleteTodo, editTodo } from '@/server/todos'
import { Toaster, toaster } from '@/components/ui/toaster'
import getSafeError from '@/utils/safeError'
import { ActionBarContent, ActionBarRoot, ActionBarSelectionTrigger, ActionBarSeparator } from '@/components/ui/action-bar'
import { Checkbox } from '@/components/ui/checkbox'
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from '@/components/ui/pagination'

const TodoList = ({ todos }: { todos: TodoItemType[] }) => {
    const [selection, setSelection] = useState<string[]>([])
    const hasSelection = selection.length > 0
    const indeterminate = hasSelection && selection.length < todos.length

    // pagination
    const pageSize = 9
    const [page, setPage] = useState(1)
    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize

    const handleIsComplete = async (todo: TodoItemType, changes: any) => {
        try {
            await completeTodo(todo.id, todo.completed)
            setSelection((prev) =>
                changes.checked
                  ? [...prev, todo.id]
                  : selection.filter((id) => id !== todo.id),
            )
        } catch (error) {
            toaster.create({
                title: getSafeError(error).name,
                type: "error"
            })
        }
    }
    
    const handleMultipleIsComplete = async (changes: any) => {
        try {
            todos.map(async (todo) => (
                await completeTodo(todo.id, todo.completed)
            ))
            setSelection(
                changes.checked ? todos.map((todo) => todo.id) : [],
            )
        } catch (error) {
            toaster.create({
                title: getSafeError(error).name,
                type: "error"
            })
        }
    }

    const decoration = (value: boolean) => {
        if(!value) {
            return 'none'
        } else {
            return 'line-through'
        }
    }

    const deleteItems = (ids: string[]) => {
        try {
            deleteTodo(ids);
            if(ids.length === 1) {
                toaster.create({
                    title: "Item successfully deleted",
                    type: "success"
                })
            } else if(ids.length > 1) {
                toaster.create({
                    title: "Items successfully deleted",
                    type: "success"
                })
            }

            const sCopy = ids.slice(0)

            sCopy.reverse().forEach((se) => {
                const element = selection.indexOf(se)
                selection.splice(element, 1)
            })
            
        } catch (error) {
            toaster.create({
                title: getSafeError(error).name,
                type: "error"
            })
        }
    }

    return (
        <>
            <Toaster />
            <Stack width="full" gap="5">
                <Table.Root interactive>
                    <Table.Header>
                        <Table.Row height={9}>
                            <Table.ColumnHeader>
                                <Checkbox
                                    top="1"
                                    aria-label="Select row"
                                    checked={indeterminate ? "indeterminate" : selection.length > 0}
                                    onCheckedChange={(changes) => {
                                        handleMultipleIsComplete(changes)
                                    }}
                                />
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>
                                Item
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>
                                Action
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {todos.length > 0 ? 
                            todos.slice(startRange, endRange).map((todo) => (
                                <TodoItem 
                                    key={todo.id} 
                                    todo={todo} 
                                    handleIsComplete={handleIsComplete} 
                                    selection={selection} 
                                    decoration={decoration}
                                />
                            )
                        ) : 
                            (
                                <Table.Row>
                                    <Table.Cell>No todos yet</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                </Table.Root>
                <PaginationRoot count={todos.length} pageSize={pageSize} page={page} onPageChange={(e) => setPage((e.page))}>
                    <HStack wrap="wrap">
                        <PaginationPrevTrigger />
                        <PaginationItems />
                        <PaginationNextTrigger />
                    </HStack>
                </PaginationRoot>
                <ActionBarRoot open={hasSelection}>
                    <ActionBarContent>
                    <ActionBarSelectionTrigger>
                        {selection.length} selected
                    </ActionBarSelectionTrigger>
                    <ActionBarSeparator />
                    <Button colorPalette="red" size="sm" onClick={() => deleteItems(selection)}>
                        Delete <Kbd>⌫</Kbd>
                    </Button>
                    </ActionBarContent>
                </ActionBarRoot>
            </Stack>
            
        </>
    )
}

export default TodoList

const TodoItem = ({ todo, handleIsComplete, selection, decoration }: { 
    todo: TodoItemType, 
    handleIsComplete: (
        todo: TodoItemType,
        changes: any
      ) => void,
    selection: string[],
    decoration: (
        comp: boolean
    ) => string,
}) => {
    const [todoName, setTodoName] = useState(todo.name)

    
    const handleEdit = async (todoId: string, todoName: string) => {
        try {
            await editTodo(todoId, todoName)
            toaster.create({
                title: "Item successfully updated",
                type: "success"
            })
        } catch (error) {
            toaster.create({
                title: getSafeError(error).name,
                type: "error"
            })
        }
    }

    return (
        <>
            <Table.Row>
                <Table.Cell>
                    <Checkbox
                        top="1"
                        aria-label="Select row"
                        checked={selection.includes(todo.id)}
                        onCheckedChange={(changes) => {handleIsComplete(todo, changes)}}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        textDecoration={decoration(todo.completed)}
                        border="none"
                        name='name'
                        type='text'
                        value={todoName}
                        onChange={(e) => setTodoName(e.target.value)}
                        disabled={!selection.includes(todo.id)}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Button colorPalette="green" onClick={() => {handleEdit(todo.id, todoName)}} disabled={!selection.includes(todo.id)}>
                        Edit
                    </Button>
                </Table.Cell>
            </Table.Row>
        </>
    )
}
