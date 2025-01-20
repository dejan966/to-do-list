'use server'

import { TodoItem, TodoItemSchema, TodoItemsSchema } from '@/features/todoModels'
import prismadb from '@/lib/prismadb'
import { revalidatePath } from 'next/cache'

export const getTodos = async () => {
    const data = await prismadb.item.findMany({ orderBy: { id: 'asc' }})
    return await TodoItemsSchema.parseAsync(data)
}

export const addTodo = async (formData: FormData) => {
    const name = formData.get('name')

    if (!name || typeof name !== 'string') {
        return
    }

    const data = await prismadb.item.create({ data: { name } })

    // Validate response
    await TodoItemSchema.parseAsync(data)

    // Revalidate cache
    revalidatePath('/todos')
}

export const editTodo = async (todoId: string, todoName: string) => {
    const data = await prismadb.item.update({
        where: { id: todoId },
        data: { name: todoName },
    })

    // Validate response
    await TodoItemSchema.parseAsync(data)

    // Revalidate cache
    revalidatePath('/todos')
}

export const deleteTodo = async (todoIds: string[]) => {
    await prismadb.item.deleteMany({
        where: { id: {in: todoIds} },
    })

    const deletedItems = await prismadb.item.findMany({
        where:{
            id: {in: todoIds}
        }
    })

    // Validate response
    deletedItems.map(async (item: TodoItem) => (
        await TodoItemSchema.parseAsync(item)
    ))

    // Revalidate cache
    revalidatePath('/todos')
}

export const completeTodo = async (todoId: string, completed: boolean) => {
    const data = await prismadb.item.update({
        where: { id: todoId },
        data: { completed: !completed },
    })

    // Validate response
    await TodoItemSchema.parseAsync(data)

    // Revalidate cache
    revalidatePath('/todos')
}
