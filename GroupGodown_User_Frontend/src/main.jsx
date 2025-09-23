import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Layout from "./Layout.jsx";
import AddGroup from "./components/AddGroup/AddGroup.jsx";
import Terms from "./components/Terms/Terms.jsx";
import Privacy from "./components/Privacy/Privacy.jsx";
import Contact from "./components/Contact/Contact.jsx";
import JoinGroup from "./components/Home/JoinGroup.jsx";
import GroupInvite from "./components/Home/GroupInvite.jsx";
import { HelmetProvider } from "react-helmet-async";
import FAQ from "./components/FAQ/FAQ.jsx";
import Blog from "./components/Blog/Blog.jsx";
import BlogDetail from "./components/Blog/BlogDetail.jsx";
import Disclaimer from "./components/Disclaimer/Disclaimer.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route>

    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="addgroup" element={<AddGroup />} />
      <Route path="terms" element={<Terms />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="disclaimer" element={<Disclaimer />} />
      <Route path="contact" element={<Contact />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="groupinvite/:id/:catId" element={<GroupInvite />} />
      <Route path="joingroup/:grouplink" element={<JoinGroup />} />
      {/* Modify the route for groupinvite to handle both scenarios */}
      <Route path="groupinvite" element={<GroupInvite />} />
      {/* Add a catch-all route to handle routes with query parameters */}
      <Route path="groupinvite/*" element={<GroupInvite />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:titleSlug" element={<BlogDetail />} />
      <Route path="/groups/country/:countryName" element={<Home />} />
      <Route path="/groups/language/:languageName" element={<Home />} />
      <Route path="/groups/category/:categoryName" element={<Home />} />
      <Route path="/groups/find" element={<Home />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);