'use server'

import { TodoItemSchema, TodoItemsSchema } from '@/features/todoModels'
import prismadb from '@/lib/prismadb'
import { revalidatePath } from 'next/cache'

export const getTodos = async () => {
    const data = await prismadb.item.findMany()
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
