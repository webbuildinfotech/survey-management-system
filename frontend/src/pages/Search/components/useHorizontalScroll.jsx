import { useRef } from 'react';

export const useHorizontalScroll = () => {
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const container = scrollRef.current;
    if (container) {
      container.scrollLeft += e.deltaY;
    }
  };

  const handleMouseDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;

    const startX = e.pageX - container.offsetLeft;
    const startScrollLeft = container.scrollLeft;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = startScrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    scrollRef,
    onWheel: handleWheel,
    onMouseDown: handleMouseDown
  };
};