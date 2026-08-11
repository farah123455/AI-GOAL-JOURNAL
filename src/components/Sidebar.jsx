import { NavLink } from 'react-router-dom';

const links = [
  {
    to: '/dashboard',
    label: 'Dashboard',
  },
  {
    to: '/journal',
    label: 'Journal',
  },
  {
    to: '/goals',
    label: 'Goals',
  },
  {
    to: '/profile',
    label: 'Profile',
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-white md:block">

      <nav className="flex flex-col gap-2 p-4">

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-card px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-moss-100 text-moss-700'
                  : 'text-ink/70 hover:bg-line/50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}