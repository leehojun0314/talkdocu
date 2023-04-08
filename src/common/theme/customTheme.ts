import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { lightPalette } from "./colors";
import { ScreenType } from "./screen";
import { lightTypographyOptions } from "./Typography";

export const lightTheme = createTheme({
  palette: {
    secondary: {
      main: "#B13FDC", // 사용할 컬러 값
    },
  },
  typography: lightTypographyOptions,
  breakpoints: {
    values: {
      xs: 0,
      sm: ScreenType.sm + 1,
      md: ScreenType.md + 1,
      lg: ScreenType.lg + 1,
      xl: ScreenType.xl + 1,
    },
  },
  shape: {
    borderRadius: 8,
  },

  components: {
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
        elevation: 0,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          "& .MuiButton-label": {
            fontSize: "16px",
          },
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
        sizeLarge: {
          padding: "12px",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});

export enum ThemeTypes {
  Light,
  Dark,
}

export const useThemeHook = () => {
  const [theme, setTheme] = useState(lightTheme);
  const palette = theme.palette;

  const colorMode = useMemo(
    () => (theme: ThemeTypes) => setTheme(lightTheme),
    []
  );

  return {
    theme,
    palette,
    colorMode,
  };
};
