import Head from 'next/head'
import { Box, Button, Text, Image, NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper, 
  FormControl,
  FormLabel,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDescription,
  useDisclosure} from '@chakra-ui/react'
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import Good from '../assets/Good.png'
import Bad from '../assets/Bad.png'
import abi from '@/abi/NFTPresaleAbi';
import { useAccount, useBalance, useContractReads, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { BigNumber } from 'ethers';

export default function Home() {
  const { address, isConnected } = useAccount()
  const [goodAddress, setGoodAddress] = useState({address: '0xab31e50f838c2c9A81f36CF3eC59de86E53C1a41', abi: abi});
  const [badAddress, setBadAddress] = useState({address: '0xD6A94655EfE87d36f16897BeF2D02e2E759723e4', abi: abi});
  const [nftType, setNftType] = useState(true);

  const [isAddressConnected, setIsAddressConnected] = useState(false);
  const [isLoadState, setIsLoadState] = useState(false);
  const [loadData, setloadState] = useState();
  const [error, setError] = useState();
  const [isDisabled, setIdDisabled] = useState(false);

  const { isOpen: errorisopen, onOpen: erroronopen, onClose: erroronclose } = useDisclosure()
  
  const [nftAmount, setNftAmount] = useState()

  const {data, isSuccess, refetch} = useContractReads({
    contracts: [
      {
        ...goodAddress,
        functionName: 'cost'
      },
      {
        ...goodAddress,
        functionName: 'totalSupply'
      },
      {
        ...goodAddress,
        functionName: 'maxSupply'
      },
      {
        ...goodAddress,
        functionName: 'balanceOf',
        args: [address]
      },
      {
        ...badAddress,
        functionName: 'cost'
      },
      {
        ...badAddress,
        functionName: 'totalSupply'
      },
      {
        ...badAddress,
        functionName: 'maxSupply'
      },
      {
        ...badAddress,
        functionName: 'balanceOf',
        args: [address]
      },
    ]
  })

  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  const { config: badconfig } = usePrepareContractWrite({
    ...badAddress,
    functionName: 'mint',
    args: [nftAmount],
    mode: 'recklesslyUnprepared',
    overrides: {
      from: address,
      value: nftAmount <= 0 || !isNumeric(nftAmount) ? BigNumber.from(0+"") : BigNumber.from(nftAmount * 0.24 * 10 ** 18 + "") ,
    }
  })

  const { config: goodconfig } = usePrepareContractWrite({
    ...goodAddress,
    functionName: 'mint',
    args: [nftAmount],
    mode: 'recklesslyUnprepared',
    overrides: {
        from: address,
        value: nftAmount <= 0 || !isNumeric(nftAmount) ? BigNumber.from(0+"") : BigNumber.from(nftAmount * 0.24 * 10 ** 18 + "") ,
      }
  })

  const { write: badwrite, isSuccess: badIsSuccess, isLoading: badIsLoading, isError: badIsError, error: badError } = useContractWrite(badconfig)
  const { write: goodwrite, isSuccess: goodIsSuccess, isLoading: goodIsLoading, isError: goodIsError, error: goodError } = useContractWrite(goodconfig)

  useEffect(() => {
    setIsAddressConnected(isConnected);
    setIsLoadState(isSuccess);
    setloadState(data)
  }, [isConnected, isSuccess])

  function disabled() {
      if(nftAmount <= 0){
        setError('Nft Amount must > 0')
        setIdDisabled(true);
      }else if(!goodwrite || !badwrite){
        setError('Insufficient Balance')
        setIdDisabled(true);
      }else{
        setError(null)
        setIdDisabled(false);
      }
  }

  useEffect(() => {
    disabled()
    refetch()
  })

  return (
    <Box background={'#000'} minH={'100vh'}>
      <Navbar/>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
        padding={'100px'}>
          <Box
            background={'#000'}
            border={'2px solid #00a6ce'}
            padding={'18px'}
            borderRadius={'10px'}
            display={'flex'}
            flexDir={'column'}
            justifyContent={'center'}>
              <Text fontWeight={700} fontSize={'25px'} color={'white'}>NFT Presale</Text>
              <Box display={'flex'} gap={'10px'} mt={'10px'}>
                <Button colorScheme={nftType ? 'cyan' : 'gray'} onClick={() => {setNftType(true)} }>SuperHero</Button>
                <Button colorScheme={nftType ? 'gray' : 'cyan'} onClick={() => setNftType(false)}>SuperVillans</Button>
              </Box>
              <Image src={nftType ? Good.src : Bad.src} height={'250px'} mt={'10px'} borderRadius={'10px'}/>
              {isAddressConnected && isLoadState ?
              <>
              <Text mt={'20px'} mb={'5px'} fontWeight={'600'} color={'white'}>{nftType ? `Already Sold: ${loadData?.[1]?.toString()}/${loadData?.[2]?.toString()}` : `Already Sold: ${loadData?.[5]?.toString()}/${loadData?.[6]?.toString()}` }</Text>
              <Progress value={nftType ? data?.[1]/data?.[2] * 100 : loadData?.[5]/loadData?.[6] * 100} borderRadius={'10px'}/>
              <Text fontWeight={500} fontSize={'20px'} mt={'20px'} display={'flex'} gap={'5px'} color={'white'}><Text color={'blue.300'}>Price:</Text> {nftType ? `${loadData?.[0]?.toString() / 10 ** 18} BNB` : `${loadData?.[4]?.toString() / 10 ** 18} BNB`}</Text>
              {error && <Alert status='error' m={'10px 0px'}>
                <AlertIcon/>
                <AlertTitle>Error !!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>}
              {goodError && <Alert status='error' m={'10px 0px'}>
                <AlertIcon/>
                <AlertTitle>Error !!</AlertTitle>
                <AlertDescription>{goodError?.message}</AlertDescription>
              </Alert>}
              {goodIsSuccess && <Alert status='success' m={'10px 0px'}>
                <AlertIcon/>
                <AlertTitle>Success !!</AlertTitle>
                <AlertDescription>Successfully Minted !</AlertDescription>
              </Alert>}
              {badError && <Alert status='error' m={'10px 0px'}>
                <AlertIcon/>
                <AlertTitle>Error !!</AlertTitle>
                <AlertDescription>{badError?.message}</AlertDescription>
              </Alert>}
              {badIsSuccess && <Alert status='success' m={'10px 0px'}>
                <AlertIcon/>
                <AlertTitle>Success !!</AlertTitle>
                <AlertDescription>Successfully Minted !</AlertDescription>
              </Alert>}
              <FormControl mt={'10px'}>
                <FormLabel color={'white'}>NFT Amount</FormLabel>
                <NumberInput>
                  <NumberInputField placeholder='Enter NFT amount' color={'white'} value={nftAmount} onChange={() => {if(event.target.value > 30){ setNftAmount(30); event.target.value = 30 }else{ setNftAmount(event.target.value); }}} min={0} max={30}/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Text mt={'10px'} display={'flex'} color={'white'} gap={'5px'}><Text color={'blue.300'} fontWeight={500}>Total:</Text> {nftAmount * data[4] < 0 ? 0 :  nftAmount * (data[0] / ( 10 ** 18))} BNB</Text>
              <Button width={'100%'} mt={'10px'} colorScheme='blue' isDisabled={isDisabled} onClick={() => {
                if(nftType){
                goodwrite()
               }else{
                badwrite()
               }
              }}>Buy</Button>
              <Text mt={'10px'} display={'flex'} color={'white'} gap={'5px'}><Text color={'blue.300'} fontWeight={500}>You Own:</Text> {nftType ? `${data?.[3]?.toString()} SuperHeros` : `${data?.[7]?.toString()} Villans`}</Text>
              <Button width={'100%'} mt={'10px'} colorScheme='pink' onClick={erroronopen}>Your NFTs</Button>
              </> : null}
              <Modal isOpen={errorisopen} onClose={erroronclose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excited Huh ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            We too... Wait for the reveal date
          </ModalBody>

          <ModalFooter>
            <Button varient='ghost' mr={3} onClick={erroronclose}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
          </Box>
      </Box>
    </Box>
  )
}
