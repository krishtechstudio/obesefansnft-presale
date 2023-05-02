import { Box, Image } from '@chakra-ui/react'
import logoblue from '../assets/logoblue.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {

    return (
        <Box
            background={'#000'}
            borderBottom={'2px solid #00a6ce'}
            padding={'10px 18px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}>
                <Image src={logoblue.src} height={'60px'}/>
                <ConnectButton/>
        </Box>
    )
}