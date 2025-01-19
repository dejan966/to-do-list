import AddTodoForm from "@/features/AddTodoForm"
import { Container, VStack } from "@chakra-ui/react"
import TodoList from '@/features/TodoList'
import { getTodos } from '@/server/todos'

const TodosPage = async () => {
    const todos = await getTodos()
    return (
        <Container m='4' gap='40px'>
            <VStack pb="4">
                <AddTodoForm />
            </VStack>
            <hr />
            <TodoList todos={todos} />
        </Container>
    )
}

export default TodosPage
