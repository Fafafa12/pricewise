"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";


const heroImage = [
  {imgUrl: '/assets/images/hero-1.svg', alt: 'Smart Watch'},
  {imgUrl: '/assets/images/hero-2.svg', alt: 'Bag'},
  {imgUrl: '/assets/images/hero-3.svg', alt: 'Lamp'},
  {imgUrl: '/assets/images/hero-4.svg', alt: 'Air Fryer'},
  {imgUrl: '/assets/images/hero-5.svg', alt: 'Chair'},
]
const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel 
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={10000}
        showArrows={false}
        showStatus={false}
      >
        {
          heroImage.map((image, index) => (
            <Image 
              key={image.alt}
              src={image.imgUrl}
              alt={image.alt}
              width={484}
              height={484}
              className="object-contain"
            />
          ))
        }
      </Carousel>

      <Image 
        src={"/assets/icons/hand-drawn-arrow.svg"}
        alt="Arrow"
        width={175}
        height={175}
        className="absolute max-xl:hidden -left-[15%] bottom-0 z-0"
      />

    </div>
  )
}

export default HeroCarousel