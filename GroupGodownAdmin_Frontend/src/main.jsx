import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import ReportedGroups from "./components/reportedgroups/ReportedGroups.jsx";
import Reports from "./components/reports/Reports.jsx";
import AddRemoveApplicationType from "./components/adminsettings/AddRemoveApplicationType.jsx";
import AddRemoveCategory from "./components/adminsettings/AddRemoveCategory.jsx";
import AddRemoveGroup from "./components/adminsettings/AddRemoveGroup.jsx";
import GroupReportSetting from "./components/adminsettings/GroupReportSetting.jsx";
import MakeAdmin from "./components/adminsettings/MakeAdmin.jsx";
import PinGroup from "./components/adminsettings/PinGroup.jsx";
import AllGroupsTable from "./components/dashboard/tables/AllGroupsTable.jsx";
import ReportedGroupsTable from "./components/dashboard/tables/ReportedGroupsTable.jsx";
import ActiveGroupsTable from "./components/dashboard/tables/ActiveGroupsTable.jsx";
import UnreportedGroupsTable from "./components/dashboard/tables/UnreportedGroupsTable.jsx";
import PinnedGroupsTable from "./components/adminsettings/PinnedGroupsTable.jsx";
import NormalGroupsTable from "./components/adminsettings/NormalGroupsTable.jsx";
import Login from "./components/login/Login.jsx";
import UploadGroups from "./components/adminsettings/uploadgroups.jsx";
import AddBlog from "./components/adminsettings/AddBlog.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Dashboard />}>
          <Route path="" element={<AllGroupsTable />} />
          <Route path="reportedgroupstable" element={<ReportedGroupsTable />} />
          <Route
            path="unreportedgroupstable"
            element={<UnreportedGroupsTable />}
          />
          <Route path="activegroupstable" element={<ActiveGroupsTable />} />
        </Route>
        <Route path="reportedgroups" element={<ReportedGroups />} />
        <Route
          path="addremoveapplicationtype"
          element={<AddRemoveApplicationType />}
        />
        <Route path="addremovecategory" element={<AddRemoveCategory />} />
        <Route path="addremovegroup" element={<AddRemoveGroup />} />
        <Route path="groupreportsetting" element={<GroupReportSetting />} />
        <Route path="makeAdmin" element={<MakeAdmin />} />
        <Route path="addBlog" element={<AddBlog />} /> 
        <Route path="pingroup" element={<PinGroup />}>
          <Route path="" element={<PinnedGroupsTable />} />
          <Route path="normalgroupstable" element={<NormalGroupsTable />} />
        </Route>
        <Route path="reports" element={<Reports />} />
        <Route path="uploadgroups" element={<UploadGroups />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
