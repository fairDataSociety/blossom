import '@mui/material/styles/createPalette'
declare module '@mui/material/styles' {
  interface Palette {
    border: Palette['primary']
    tertiary: Palette['primary']
  }
  interface PaletteOptions {
    border: PaletteOptions['primary']
    tertiary: PaletteOptions['primary']
  }
}
