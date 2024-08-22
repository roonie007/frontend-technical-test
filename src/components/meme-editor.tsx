import { useDropzone } from 'react-dropzone';

import { AspectRatio, Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { Image, Pencil } from '@phosphor-icons/react';

import { MemePicture } from './meme-picture';

import type { MemeEditorProps, MemePictureProps } from '../types/props';

function renderNoPicture() {
  return (
    <Flex alignItems="center" flexDir="column" height="full" justifyContent="center" width="full">
      <Icon as={Image} boxSize={16} color="black" />
      <Text>Select a picture</Text>
      <Text color="gray.400" fontSize="sm">
        or drop it in this area
      </Text>
    </Flex>
  );
}

function renderMemePicture(memePicture: MemePictureProps, open: () => void) {
  return (
    <Box
      __css={{
        '& .change-picture-button': {
          display: 'none',
        },
        '&:hover .change-picture-button': {
          display: 'inline-block',
        },
      }}
      height="full"
      position="relative"
      width="full"
    >
      <MemePicture {...memePicture} />
      <Button
        className="change-picture-button"
        color="white"
        colorScheme="cyan"
        left="50%"
        leftIcon={<Icon as={Pencil} boxSize={4} />}
        onClick={open}
        position="absolute"
        top="50%"
        transform="translate(-50%, -50%)"
      >
        Change picture
      </Button>
    </Box>
  );
}

export const MemeEditor: React.FC<MemeEditorProps> = ({ memePicture, onDrop }) => {
  const { getInputProps, getRootProps, open } = useDropzone({
    accept: { 'image/jpg': ['.jpg'], 'image/png': ['.png'] },
    noClick: memePicture !== undefined,
    onDrop: (files: File[]) => {
      if (files.length === 0) {
        return;
      }
      onDrop(files[0]);
    },
  });

  return (
    <AspectRatio ratio={16 / 9}>
      <Box
        {...getRootProps()}
        border={!memePicture ? '1px dashed' : undefined}
        borderColor="gray.300"
        borderRadius={9}
        position="relative"
        px={1}
        width="full"
      >
        <input {...getInputProps()} />
        {memePicture ? renderMemePicture(memePicture, open) : renderNoPicture()}
      </Box>
    </AspectRatio>
  );
};
