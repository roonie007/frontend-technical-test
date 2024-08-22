import { Box, Text, useDimensions } from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Draggable from 'react-draggable';
import { MemePictureProps } from '../types/props';

const REF_WIDTH = 800;
const REF_HEIGHT = 450;
const REF_FONT_SIZE = 36;

export const MemePicture: React.FC<MemePictureProps> = ({
  pictureUrl,
  texts: rawTexts,
  dataTestId = '',
  editMode,
  updateTexts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef, true);
  const boxWidth = dimensions?.borderBox.width;

  const [idPrefix] = useState(Math.random().toString(36).substring(7));

  const { height, fontSize, texts } = useMemo(() => {
    if (!boxWidth) {
      return { height: 0, fontSize: 0, texts: rawTexts };
    }

    return {
      height: (boxWidth / REF_WIDTH) * REF_HEIGHT,
      fontSize: (boxWidth / REF_WIDTH) * REF_FONT_SIZE,
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
      width="full"
      height={height}
      ref={containerRef}
      backgroundColor="gray.100"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
      overflow="hidden"
      position="relative"
      borderRadius={8}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <LazyLoadImage src={pictureUrl} style={{ height: '100%' }} data-testid={dataTestId} />

      {texts.map((text, index) => (
        <Draggable key={index} onStop={() => handleDragStop(index)} disabled={!editMode}>
          <Text
            key={index}
            id={getElementId(index)}
            position="absolute"
            left={text.x}
            top={text.y}
            fontSize={fontSize}
            color="white"
            fontFamily="Impact"
            fontWeight="bold"
            userSelect="none"
            textTransform="uppercase"
            style={{ WebkitTextStroke: '1px black' }}
            data-testid={`${dataTestId}-text-${index}`}
          >
            {text.content}
          </Text>
        </Draggable>
      ))}
    </Box>
  );
};
