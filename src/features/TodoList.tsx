'use client'

import { useState } from 'react'
import { TodoItem as TodoItemType } from '@/features/todoModels'
import {  Input, Table } from '@chakra-ui/react'
import { completeTodo } from '@/server/todos'
import { Toaster, toaster } from '@/components/ui/toaster'
import getSafeError from '@/utils/safeError'
const TodoList = ({ todos }: { todos: TodoItemType[] }) => {
    return (
        <Table.Root interactive>
            <Table.Body>
                    {todos.length > 0 ? 
                        todos.map((todo) => <TodoItem key={todo.id} todo={todo} />) : 
                        <Table.Cell>No todos yet</Table.Cell>
                    }
            </Table.Body>
        </Table.Root>
    )
}

export default TodoList

const TodoItem = ({ todo }: { todo: TodoItemType }) => {
    const [todoName, setTodoName] = useState(todo.name)
    const [completed, setCompleted] = useState(todo.completed)

    const handleIsComplete = async () => {
        try {
            await completeTodo(todo.id, completed)
            setCompleted(!completed)
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
    return (
        <>
            <Toaster />
            <Table.Row>
                <Table.Cell>
                    <input
                        name='completed'
                        type='checkbox'
                        defaultChecked={completed} 
                        onClick={handleIsComplete}
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
                    />
                </Table.Cell>
            </Table.Row>   
        </>
    )
}
