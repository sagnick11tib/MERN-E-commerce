import { useState } from "react";

type SliderProps = {
    images: string[];
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    bgColor?: string;
    showThumbnails?: boolean;
    onClick?: () => void;
  };

  export const Slider = ({
    images,
    objectFit = "cover",
    bgColor = "inherit",
    showThumbnails,
    onClick,
  }: SliderProps) => {
    
    const [activeImage, setActiveImage] = useState<number>(0);

    const Thumbnails = (
        <aside
          style={{
            height: "5rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {images.map((i, index) => (
            <img
              key={index}
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "0.25rem",
                objectFit: "cover",
                border: "1px solid  rgba(0,0,0,0.3)",
              }}
              src={i}
              alt={`Image-${index}`}
              onMouseOver={() => setActiveImage(index)}
            />
          ))}
        </aside>
      );

      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            backgroundColor: bgColor,
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              overflowX: "hidden",
              position: "relative",
            }}
          >
            {images.map((i, index) => (
              <img
                key={index}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit,
                  flex: "none",
                  transition: "all 0.3s",
                  transform: `translateX(-${activeImage * 100}%)`,
                }}
                src={i}
                onClick={() => onClick && onClick()}
              />
            ))}
          </div>
          {showThumbnails && Thumbnails}
        </div>
      );
  };