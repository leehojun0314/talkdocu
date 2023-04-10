import useMediaQuery from "@mui/material/useMediaQuery";

export enum ScreenType {
  xs = 376,
  sm = 576, // Mobile
  md = 768, //isMedium
  lg = 1024, // isLarge
  xl = 1200, // Tablet
  xxl = 1440, // Laptop
}

export const Mq = {
  xs: `(max-width:${ScreenType.xs}px)`,
  sm: `(max-width:${ScreenType.sm}px)`,
  md: `(max-width:${ScreenType.md}px)`,
  lg: `(max-width:${ScreenType.lg}px)`,
  xl: `(max-width:${ScreenType.xl}px)`,
  xxl: `(max-width:${ScreenType.xxl}px)`,
};

export const useCustomMediaQuery = () => {
  const isExtraSmall = useMediaQuery(Mq.xs);
  const isSmall = useMediaQuery(Mq.sm);
  const isMedium = useMediaQuery(Mq.md);
  const isLarge = useMediaQuery(Mq.lg);
  const isTablet = useMediaQuery(Mq.xl);
  const isLaptop = useMediaQuery(Mq.xxl);

  return {
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    isLaptop,
  };
};
