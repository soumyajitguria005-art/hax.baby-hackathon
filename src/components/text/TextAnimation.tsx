import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const item = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

export interface TextAnimationProps {
  children: React.ReactNode;
  delay?: number;
  divideBy?: "word" | "letter";
  className?: string;
  textClassName?: string;
}

export const TextAnimation: React.FC<TextAnimationProps> = ({
  children,
  delay = 0,
  divideBy = "word",
  className = "",
  textClassName = "",
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const listener = () => setReducedMotion(media.matches);
    try {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } catch {
      media.addListener?.(listener);
      return () => media.removeListener?.(listener);
    }
  }, []);

  if (typeof children !== "string") {
    if (typeof children === "number" || typeof children === "boolean") {
      children = String(children);
    } else {
      return <span className={className}>{children}</span>;
    }
  }

  const text = children as string;

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  const parts = divideBy === "letter" ? text.split("") : text.split(" ");
  const stagger = divideBy === "letter" ? 0.02 : 0.05;

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden relative"
          style={{ verticalAlign: "top" }}
        >
          <motion.span
            variants={item}
            className={cn("inline-block will-change-transform", textClassName)}
          >
            {divideBy === "letter"
              ? part === " "
                ? "\u00A0"
                : part
              : part + "\u00A0"}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default TextAnimation;
