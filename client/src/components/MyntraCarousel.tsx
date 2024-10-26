import React, { useState, useRef, useEffect, useCallback, MouseEvent } from "react";

type MyntraCarouselPropsType = {
  images: string[];
  darkMode?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  setIsOpen: (isOpen: boolean) => void;
  PrevButton: React.FC<{ onClick: () => void }>;
  NextButton: React.FC<{ onClick: () => void }>;
};

export const MyntraCarousel = ({
  images,
  darkMode = false,
  objectFit = "cover",
  setIsOpen,
  PrevButton,
  NextButton,
}: MyntraCarouselPropsType) => {
    
  const [activeImage, setActiveImage] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const border = darkMode ? "1px solid #fff" : "1px solid black";

  const incrementHandler = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const decrementHandler = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const mouseMoveHandler = useCallback((e: globalThis.MouseEvent) => {
    const y = e.clientY;
    containerRef.current?.scrollTo({ top: y });
  }, []);

  const closeHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (!containerRef.current) return;

    const containerDimension = containerRef.current.getBoundingClientRect();

    if (
      e.clientX < containerDimension.left ||
      e.clientX > containerDimension.right ||
      e.clientY < containerDimension.top ||
      e.clientY > containerDimension.bottom
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", mouseMoveHandler);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", mouseMoveHandler);
      }
    };
  }, [mouseMoveHandler]);

  const ImagesList = (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "absolute",
        top: "1rem",
        left: "1rem",
      }}
    >
      {images.map((image, idx) => (
        <button
          key={idx}
          style={{
            border: idx === activeImage ? border : "1px solid rgba(0,0,0,0.3)",
            outline: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => setActiveImage(idx)}
        >
          <img
            style={{
              width: "2rem",
              height: "2.5rem",
              objectFit: "contain",
            }}
            src={image}
            alt={`Thumbnail-${idx}`}
          />
        </button>
      ))}
    </aside>
  );

  const NavigationButton = (
    <article
      style={{
        display: "flex",
        width: "95%",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
      }}
    >
      <PrevButton onClick={decrementHandler} />
      <NextButton onClick={incrementHandler} />
    </article>
  );

  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 200,
      }}
      onClick={closeHandler}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          height: "100vh",
          position: "relative",
          margin: "auto",
          boxShadow: darkMode ? "0 0 5px black" : "0 0 5px white",
          overflow: "auto",
          cursor: "s-resize",
          scrollbarWidth: "none",
          backgroundColor: darkMode ? "black" : "#fff",
        }}
        ref={containerRef}
      >
        <img
          src={images[activeImage]}
          style={{
            width: "100%",
            minHeight: "100vh",
            objectFit,
          }}
          alt={`Carousel Image-${activeImage}`}
        />
        <div
          style={{
            position: "fixed",
            top: 0,
            width: "95%",
            maxWidth: "950px",
            height: "100vh",
          }}
        >
          {ImagesList}
          {NavigationButton}
        </div>
      </div>
    </section>
  );
};

export default MyntraCarousel;

