import Image from 'next/image'
import { Link } from "@chakra-ui/react"
import styles from "@styles/page.module.css";
import { Box, Flex } from '@chakra-ui/react';

const Navigation = () => {
    return (
        <Flex
            top='5'
            height='10vh'
            boxShadow='0 4px 12px 0 rgba(0, 0, 0, 0.05)'
            flexDir='row'
            justifyContent='space-between'
        >
            <Link href='/'>
                <Image src='/window.svg' alt='Window' width={63} height={37} />
            </Link>
            <Flex alignItems='center' justifyContent='center'>
                <Link fontWeight='semibold' mr='4' href='/'>
                    Home
                </Link>
                <Link fontWeight='semibold' mr='4' href='/todos'>
                    List Items
                </Link>
            </Flex>
        </Flex>
    )
}

export default Navigation
