import { linearProgressClasses } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

export const GRAY = {
  '50': '#f5f5f5',
  '100': '#e4e6ea',
  '200': '#d3d5d9',
  '300': '#b1b3b8',
  '400': '#8c8c8d',
  '500': '#505051',
  '600': '#424242',
  '700': '#3a3b3c',
  '750': '#303233',
  '800': '#242526',
  '900': '#1c1d21',
  '950': '#18191a',
} as const;

export const BLURPLE = {
  '300': '#7D95E3',
  '400': '#6573CF',
  '500': '#5868CB',
  '700': '#43498e',
} as const;

declare module '@mui/material/styles/createPalette' {
  interface TypeText {
    tertiary: string;
  }
  interface TypeBackground {
    secondary: string;
  }
}

interface Props<OwnerState = unknown> {
  theme: Theme;
  ownerState: OwnerState;
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  colorSchemes: {
    light: {
      palette: {
        text: {
          tertiary: BLURPLE['300'],
        },
        background: {
          secondary: GRAY['50'],
        },
        divider: GRAY['100'],
      },
    },
    dark: {
      palette: {
        primary: {
          main: GRAY['100'],
        },
        text: {
          primary: GRAY['100'],
          secondary: GRAY['300'],
          tertiary: BLURPLE['300'],
        },
        background: {
          default: GRAY['950'],
          paper: GRAY['800'],
          secondary: GRAY['700'],
        },
        divider: GRAY['700'],
      },
    },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          // Mobile (first priority)
          padding: '80px 10px 150px 10px',

          // Tablet
          [theme.breakpoints.up('sm')]: {
            padding: '102.5px 24px 150px 24px',
          },

          // Desktop
          [theme.breakpoints.up('md')]: {
            paddingTop: 120,
          },

          // Larger devices
          [theme.breakpoints.up('lg')]: {
            paddingTop: 150,
          },
        }),
        maxWidthSm: ({ theme }: Props) => ({
          [theme.breakpoints.up('md')]: {
            maxWidth: 680,
          },
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation: {
          boxShadow: `
            0 0 #0000,
            0 0 #0000,
            0 4px 6px -1px rgba(0,0,0,.1),
            0 2px 4px -2px rgba(0,0,0,.1)
          `,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          backgroundImage: 'none',
          borderRadius: '8px',

          ...theme.applyStyles('light', {
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
            border: `1px solid ${GRAY[100]}`,
          }),
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          textTransform: 'none',
          color: theme.palette.text.primary,
        }),
        contained: ({ theme }: Props) => ({
          backgroundColor: 'rgb(0, 0, 0, 0.04)',
          '&:hover': {
            backgroundColor: 'rgb(0, 0, 0, 0.07)',
            boxShadow: 'none',
          },
          boxShadow: 'none',

          ...theme.applyStyles('dark', {
            backgroundColor: 'rgb(255, 255, 255, 0.04)',
            '&:hover': { backgroundColor: 'rgb(255, 255, 255, 0.07)' },
          }),
        }),
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            borderRadius: 7,
          },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          '&.Mui-focused': {
            color: theme.palette.text.secondary,
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: GRAY[400],
              ...theme.applyStyles('dark', {
                borderColor: GRAY[100],
              }),
              borderWidth: 1,
            },
          },
        }),
        notchedOutline: ({ theme }: Props) => ({
          borderColor: GRAY[200],
          ...theme.applyStyles('dark', {
            borderColor: GRAY[600],
          }),
        }),
      },
    },

    MuiInput: {
      styleOverrides: {
        underline: ({ theme }: Props) => ({
          '&:before': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '&:after': {
            borderBottom: `2px solid ${theme.palette.primary.dark}`,
          },
          '&&:hover:before': {
            borderBottom: `2px solid ${theme.palette.primary.dark}`,
          },
        }),
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          color: theme.palette.common.black,
          ...theme.applyStyles('dark', {
            color: theme.palette.text.primary,
          }),
        }),
      },
    },

    MuiMenu: {
      styleOverrides: {
        list: ({ theme }: Props) => ({
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          padding: 4,
          ...theme.applyStyles('dark', {
            borderColor: theme.palette.divider,
          }),
        }),
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          borderRadius: 4,
          transition: 'background-color 0.15s cubic-bezier(.4,0,.2,1)',

          '&:hover': {
            backgroundColor: 'rgb(0, 0, 50, 0.04)',
            ...theme.applyStyles('dark', {
              backgroundColor: 'rgb(205, 205, 255, 0.1)',
            }),
          },
        }),
      },
    },

    MuiTab: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          fontSize: 16,
          textTransform: 'none',

          [theme.breakpoints.up('sm')]: {
            minWidth: 160,
          },
        }),
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }: Props) => ({
          backgroundColor: theme.palette.background.paper,
          '--Paper-overlay': 'none !important',
        }),
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          '--Paper-overlay': 'none !important',
        },
        colorPrimary: ({ theme }: Props) => ({
          backgroundColor: theme.palette.background.default,
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.default,
          }),
        }),
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.default,
          }),
        }),
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          [`&.${linearProgressClasses.colorPrimary}`]: {
            ...theme.applyStyles('light', {
              backgroundColor: '#fafafa',
            }),
          },
          [`& .${linearProgressClasses.bar}`]: {
            ...theme.applyStyles('light', {
              backgroundColor: '#e4e4e7',
            }),
          },
        }),
      },
    },

    MuiAlert: {
      styleOverrides: {
        icon: {
          '& .MuiSvgIcon-root': {
            fill: GRAY['50'],
          },
        },
      },
    },
  },
});
