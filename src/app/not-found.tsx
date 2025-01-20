import { Heading, Text, VStack, Link, Button } from '@chakra-ui/react';

export default function NotFound() {
    return (
        <VStack p="10">
            <Heading>The page you&aposre looking could not be be found.</Heading>
            <Text>Please return to the home page</Text>
            <Button w='16' size="lg"><Link href='/'>Home</Link></Button>
        </VStack>
    )
}