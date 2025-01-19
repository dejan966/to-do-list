import AddTodoForm from "@/features/AddTodoForm"
import { Container, Flex, VStack } from "@chakra-ui/react"

const TodosPage = async () => {
    return (
        <Container m='4'>
            <VStack>
                <AddTodoForm />
            </VStack>
        </Container>
    )
}

export default TodosPage
