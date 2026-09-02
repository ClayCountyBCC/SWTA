import SearchPage from './features/search/SearchPage';
import { ThemeProvider } from './theme/ThemeProvider';

function App({ initialAppearance }) {
  return (
    <ThemeProvider initialAppearance={initialAppearance}>
      <SearchPage />
    </ThemeProvider>
  );
}

export default App;
