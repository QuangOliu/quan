import { lazy } from "react";
import { Navigate } from "react-router-dom";
import IoT from "../views/IoT.js";

const dataHome = {
  img: "/assets/images/anhavt.jpg",
  hello: `Hello, I'm Quân B20DCCN549`,
  typing: [
    "Hi, I'm  <span style=color:red>Quân</span>",
    "I'm <span style=color:red>22</span> years old",
    "My SID <span style=color:red>B20DCCN549</span>",
    "My phone <span style=color:red>012345678</span>",
    "<span style=color:red>Love You <3</span>",
  ],
  about: "I am currently a fourth-year student at PTIT, majoring in IT.",
  social: [
  ],
  CV: "#",
};

const CustomLayout = lazy(() => import("../layouts/CustomLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/MyAbout.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const History = lazy(() => import("../views/ui/historyTurn.js"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <CustomLayout />,
    children: [
      { path: "/", element: <Navigate to='/iot' /> },
      { path: "/iot", exact: true, element: <IoT /> },
      { path: "/table", exact: true, element: <Tables /> },
      { path: "/history", exact: true, element: <History /> },
      { path: "/about", exact: true, element: <About data={dataHome} /> },
      { path: "/alerts", exact: true, element: <Alerts /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/badges", exact: true, element: <Badges /> },
      { path: "/buttons", exact: true, element: <Buttons /> },
      { path: "/cards", exact: true, element: <Cards /> },
      { path: "/grid", exact: true, element: <Grid /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
    ],
  },
];

export default ThemeRoutes;
