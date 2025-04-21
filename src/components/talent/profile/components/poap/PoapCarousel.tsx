
import React, { useState, useRef, useEffect } from "react";
import styles from "./PoapCarousel.module.css";

interface Poap {
  id: string | number;
  image_url: string;
  name: string;
  drop_id: string | number;
  minted_by: string;
  token_count: number;
  holders_count: number;
  transfer_count: number;
}

interface PoapCarouselProps {
  poaps: Poap[];
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({ poaps = [] }) => {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !el.firstChild) return;
    const onScroll = () => {
      const cardWidth = (el.firstChild as HTMLElement).offsetWidth + 12; // 12px gap
      const newIdx = Math.round(el.scrollLeft / cardWidth);
      setIdx(Math.max(0, Math.min(newIdx, poaps.length - 1)));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [poaps.length]);

  if (!poaps.length) return null;
  const p = poaps[idx];

  return (
    <div>
      <div ref={containerRef} className={styles.carousel}>
        {poaps.map((p, i) => (
          <div key={p.id} className={styles.card}>
            <img src={p.image_url} alt={p.name} className={styles.img} />
          </div>
        ))}
      </div>
      <div className={styles.details}>
        <h3>{p.name}</h3>
        <div className={styles.ids}>
          <span>DROP ID: #{p.drop_id}</span>
          <span>POAP ID: #{p.id}</span>
        </div>
        <div className={styles.minted}>
          MINTED BY: <strong>{p.minted_by}</strong>
        </div>
        <div className={styles.stats}>
          <div><span className={styles.dot} />{p.token_count}</div>
          <div><span className={styles.dot} />{p.holders_count}</div>
          <div><span className={styles.dot} />{p.transfer_count}</div>
        </div>
      </div>
    </div>
  );
};

export default PoapCarousel;
