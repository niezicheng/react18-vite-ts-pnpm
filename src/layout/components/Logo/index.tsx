import { useContext } from 'react';
import { Link } from 'react-router-dom';
import LayoutContext from 'layout/LayoutContext';
import logo from 'assets/react.svg';

export default function LayoutLogo() {
  const { collapsed } = useContext(LayoutContext);

  return (
    <Link className='logo' to='/'>
      <img style={{ width: 30, height: 30 }} alt='logo' src={logo} />
      {!collapsed && <div className='logo_text'>React Admin</div>}
    </Link>
  );
}
