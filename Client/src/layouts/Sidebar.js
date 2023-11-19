import { Button, Nav, NavItem } from "reactstrap";
import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

// const navigation = [
//   {
//     title: "Dashboard",
//     href: "/",
//     icon: "bi bi-speedometer2",
//   },
//   {
//     title: "Alert",
//     href: "/alerts",
//     icon: "bi bi-bell",
//   },
//   {
//     title: "Badges",
//     href: "/badges",
//     icon: "bi bi-patch-check",
//   },
//   {
//     title: "Buttons",
//     href: "/buttons",
//     icon: "bi bi-hdd-stack",
//   },
//   {
//     title: "Cards",
//     href: "/cards",
//     icon: "bi bi-card-text",
//   },
//   {
//     title: "Grid",
//     href: "/grid",
//     icon: "bi bi-columns",
//   },
//   {
//     title: "Table",
//     href: "/table",
//     icon: "bi bi-layout-split",
//   },
//   {
//     title: "Forms",
//     href: "/forms",
//     icon: "bi bi-textarea-resize",
//   },
//   {
//     title: "Breadcrumbs",
//     href: "/breadcrumbs",
//     icon: "bi bi-link",
//   },
//   {
//     title: "About",
//     href: "/about",
//     icon: "bi bi-people",
//   },
// ];

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: "bi bi-speedometer2",
  },
  {
    title: "History",
    href: "/history",
    icon: "bi bi-layout-split",
  },
  {
    title: "Table",
    href: "/table",
    icon: "bi bi-layout-split",
  },
  {
    title: "About",
    href: "/about",
    icon: "bi bi-people",
  },
];

const Sidebar = () => {
  const [on, setOn] = useState(true);
  const showMobilemenu = () => {
    setOn(!on);
  };
  let location = useLocation();

  return (
    <div>
      <span className="p-3">
        <Button close onClick={() => showMobilemenu()}></Button>
      </span>
      <div className={on ? "" : "d-none w-0"}>
        <Nav vertical className='sidebarNav'>
          {navigation.map((navi, index) => (
            <NavItem key={index} className='sidenav-bg'>
              <Link to={navi.href} className={location.pathname === navi.href ? "text-primary nav-link py-3" : "nav-link text-secondary py-3"}>
                <i className={navi.icon}></i>
                <span className='ms-3 d-inline-block'>{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
