import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";

const links = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
];

const AdminLayout = () => (
  <div className="container px-4 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
    <aside className="bg-card border border-border rounded-lg shadow-card p-2 h-fit">
      <p className="px-3 py-2 text-xs uppercase font-semibold text-muted-foreground tracking-wide">Admin</p>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink end={l.end as any} to={l.to}
              className={({isActive}) =>
                `flex items-center gap-2 px-3 py-2 rounded text-sm ${isActive ? "bg-accent/15 text-accent font-semibold" : "hover:bg-muted"}`}>
              <l.icon size={16} />{l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
    <div><Outlet /></div>
  </div>
);
export default AdminLayout;
