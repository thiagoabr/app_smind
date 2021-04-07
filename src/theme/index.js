import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.purple,
      paper: colors.common.white
    },
    primary: {
      main: '#D8BFD8'// colors.indigo[500]
    },
    secondary: {
      main: '#D8BFD8'// colors.indigo[500]
    },
    text: {
      primary: '#483D8B', // colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography
});

export default theme;
