'use client'

import { useState } from 'react'
import { TodoItem as TodoItemType } from '@/features/todoModels'
import {  Input, Table } from '@chakra-ui/react'
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

    return (
        <Table.Row>
            <Table.Cell>
                <Input
                    border="none"
                    name='name'
                    type='text'
                    value={todoName}
                    onChange={(e) => setTodoName(e.target.value)}
                />
            </Table.Cell>
        </Table.Row>
    )
}
