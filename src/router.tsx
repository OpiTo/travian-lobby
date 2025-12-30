import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ModalManager } from './components/Modal';
import {
  HomePage,
  CalendarPage,
  NewsPage,
  NewsArticlePage,
  ImprintPage,
  GameRulesPage,
  NotFoundPage,
} from './pages';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ModalManager />
    </>
  );
};

/**
 * Create router with routes matching original lobby structure.
 * Routes:
 * - /:localeName - Home page (index)
 * - /:localeName/calendar - Gameworld calendar
 * - /:localeName/news - News list
 * - /:localeName/news/:articleId - News article
 * - /:localeName/imprint - Imprint/Legal
 * - /:localeName/gamerules - Game rules
 * - * - 404 Not found
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/:localeName',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'calendar', element: <CalendarPage /> },
      {
        path: 'news',
        element: <NewsPage />,
        children: [
          { path: ':articleId', element: <NewsArticlePage /> },
        ],
      },
      { path: 'imprint', element: <ImprintPage /> },
      { path: 'gamerules', element: <GameRulesPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

/**
 * AppRouter component
 * Provides the router to the app.
 */
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
