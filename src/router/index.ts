import { useRoutes } from 'react-router-dom';
import mainRoutes from 'router/mainRoutes';

export default function ThemeRoutes() {
  return useRoutes([mainRoutes]);
}
