import { useMemo, useState } from 'react';

import { Box, Button, Flex, Heading, HStack, Icon, IconButton, Input, Textarea, VStack } from '@chakra-ui/react';
import { Plus, Trash } from '@phosphor-icons/react';
import { createFileRoute, Link } from '@tanstack/react-router';

import { createMeme } from '../../api';
import { MemeEditor } from '../../components/meme-editor';

import type { MemePictureProps } from '../../types/props';

export const Route = createFileRoute('/_authentication/create')({
  component: CreateMemePage,
});

type Picture = {
  file: File;
  url: string;
};

function CreateMemePage() {
  const [picture, setPicture] = useState<null | Picture>(null);
  const [description, setDescription] = useState<string>('');
  const [texts, setTexts] = useState<MemePictureProps['texts']>([]);

  const handleDrop = (file: File) => {
    setPicture({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const handleAddCaptionButtonClick = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.random() * 400,
        y: Math.random() * 225,
      },
    ]);
  };

  const handleDeleteCaptionButtonClick = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!picture) {
      return;
    }

    const formData = new FormData();
    formData.append('Picture', picture!.file);
    formData.append('Description', description);
    texts.forEach((text, index) => {
      formData.append(`Texts[${index}][Content]`, text.content);
      formData.append(`Texts[${index}][X]`, Math.floor(text.x).toString());
      formData.append(`Texts[${index}][Y]`, Math.floor(text.y).toString());
    });

    await createMeme(formData);

    document.location.href = '/';
  };

  const memePicture = useMemo(() => {
    if (!picture) {
      return undefined;
    }

    return {
      editMode: true,
      pictureUrl: picture.url,
      texts,
      updateTexts: setTexts,
    };
  }, [picture, texts]);

  return (
    <Flex height="full" width="full">
      <Box flexGrow={1} height="full" overflowY="auto" p={4}>
        <VStack align="stretch" spacing={5}>
          <Box>
            <Heading as="h2" mb={2} size="md">
              Upload your picture
            </Heading>
            <MemeEditor memePicture={memePicture} onDrop={handleDrop} />
          </Box>
          <Box>
            <Heading as="h2" mb={2} size="md">
              Describe your meme
            </Heading>
            <Textarea
              onChange={e => setDescription(e.target.value)}
              placeholder="Type your description here..."
              value={description}
            />
          </Box>
        </VStack>
      </Box>
      <Flex boxShadow="lg" flexDir="column" height="full" minW="250" width="30%">
        <Heading as="h2" mb={2} p={4} size="md">
          Add your captions
        </Heading>
        <Box flexGrow={1} height={0} overflowY="auto" p={4}>
          <VStack>
            {texts.map((text, index) => (
              <Flex width="full">
                <Input
                  key={index}
                  mr={1}
                  onChange={e => {
                    setTexts(texts.map((t, i) => (i === index ? { ...t, content: e.target.value } : t)));
                  }}
                  value={text.content}
                />
                <IconButton
                  aria-label="Delete caption"
                  icon={<Icon as={Trash} />}
                  onClick={() => handleDeleteCaptionButtonClick(index)}
                />
              </Flex>
            ))}
            <Button
              colorScheme="cyan"
              isDisabled={memePicture === undefined}
              leftIcon={<Icon as={Plus} />}
              onClick={handleAddCaptionButtonClick}
              size="sm"
              variant="ghost"
              width="full"
            >
              Add a caption
            </Button>
          </VStack>
        </Box>
        <HStack p={4}>
          <Button as={Link} colorScheme="cyan" size="sm" to="/" variant="outline" width="full">
            Cancel
          </Button>
          <Button
            color="white"
            colorScheme="cyan"
            isDisabled={memePicture === undefined}
            onClick={handleSubmit}
            size="sm"
            width="full"
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
