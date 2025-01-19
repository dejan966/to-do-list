'use client'

import { Button, HStack, Input } from '@chakra-ui/react'
import { useState } from 'react'

const AddTodoForm = () => {
    const [name, setName] = useState('')
    const action = async (formData: FormData) => {
        console.log(name);
    }

    return (
        <form action={action}>
            <HStack>
                <Input
                    borderColor='gray.600'
                    name='name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button type='submit' disabled={name.trim() === ''}>
                    Add
                </Button>
            </HStack>      
        </form>    
    )
}

export default AddTodoForm
