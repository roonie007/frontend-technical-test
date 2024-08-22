import { useMemo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Box, Text, useDimensions } from '@chakra-ui/react';

import type { MemePictureProps } from '../types/props';

const REF_WIDTH = 800;
const REF_HEIGHT = 450;
const REF_FONT_SIZE = 36;

export const MemePicture: React.FC<MemePictureProps> = ({
  dataTestId = '',
  editMode,
  pictureUrl,
  texts: rawTexts,
  updateTexts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef, true);
  const boxWidth = dimensions?.borderBox.width;

  const [idPrefix] = useState(Math.random().toString(36).substring(7));

  const { fontSize, height, texts } = useMemo(() => {
    if (!boxWidth) {
      return { fontSize: 0, height: 0, texts: rawTexts };
    }

    return {
      fontSize: (boxWidth / REF_WIDTH) * REF_FONT_SIZE,
      height: (boxWidth / REF_WIDTH) * REF_HEIGHT,
      texts: rawTexts.map(text => ({
        ...text,
        x: (boxWidth / REF_WIDTH) * text.x,
        y: (boxWidth / REF_WIDTH) * text.y,
      })),
    };
  }, [boxWidth, rawTexts]);

  const getElementId = (index: number) => `${idPrefix}-text-${index}`;

  function calculateElementPositionrelativeToContainer(element: HTMLElement) {
    const containerRect = containerRef.current!.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      x: elementRect.left - containerRect.left,
      y: elementRect.top - containerRect.top,
    };
  }

  function handleDragStop(index: number) {
    if (!updateTexts) {
      return;
    }

    const element = document.getElementById(getElementId(index));
    if (!element) {
      return;
    }

    const position = calculateElementPositionrelativeToContainer(element);
    const newTexts = [...rawTexts];
    newTexts[index] = { ...newTexts[index], x: position.x, y: position.y };
    updateTexts(newTexts);
  }

  return (
    <Box
      backgroundColor="gray.100"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
      borderRadius={8}
      height={height}
      overflow="hidden"
      position="relative"
      ref={containerRef}
      style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      width="full"
    >
      <LazyLoadImage data-testid={dataTestId} src={pictureUrl} style={{ height: '100%' }} />

      {texts.map((text, index) => (
        <Draggable disabled={!editMode} key={index} onStop={() => handleDragStop(index)}>
          <Text
            color="white"
            data-testid={`${dataTestId}-text-${index}`}
            fontFamily="Impact"
            fontSize={fontSize}
            fontWeight="bold"
            id={getElementId(index)}
            key={index}
            left={text.x}
            position="absolute"
            style={{ WebkitTextStroke: '1px black' }}
            textTransform="uppercase"
            top={text.y}
            userSelect="none"
          >
            {text.content}
          </Text>
        </Draggable>
      ))}
    </Box>
  );
};
