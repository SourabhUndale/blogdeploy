import { useState } from "react";
import "./App.css";
import SideBar from "./components/navbar/SideBar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import ReportedGroupsTable from "./components/dashboard/tables/ReportedGroupsTable";
import AddRemoveGroup from "./components/adminsettings/AddRemoveGroup";
import AddRemoveCategory from "./components/adminsettings/AddRemoveCategory";
import AddRemoveApplicationType from "./components/adminsettings/AddRemoveApplicationType";
import PinGroup from "./components/adminsettings/PinGroup";
import MakeAdmin from "./components/adminsettings/MakeAdmin";
import AddBlog from "./components/adminsettings/AddBlog";
import GroupReportSetting from "./components/adminsettings/GroupReportSetting";
import NormalGroupsTable from "./components/adminsettings/NormalGroupsTable";
import PinnedGroupsTable from "./components/adminsettings/PinnedGroupsTable";
import UploadGroups from "./components/adminsettings/uploadgroups";
import Reports from "./components/reports/Reports";
import UpdateGroup from "./components/adminsettings/UpdateGroup";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<SideBar />}>
            <Route index element={<Dashboard />} />
            <Route path="home" element={<Dashboard />} />
            <Route path="reportedgroups" element={<ReportedGroupsTable />} />
            <Route path="reports" element={<Reports />} />
            <Route path="uploadgroups" element={<UploadGroups />} />

            {/* Admin Settings */}
            <Route path="adminsettings">
              <Route index element={<AddRemoveGroup />} />
              <Route path="addremovegroup" element={<AddRemoveGroup />} />
              <Route
                path="addremovecategory"
                element={<AddRemoveCategory />}
              />
              <Route
                path="addremoveapplicationtype"
                element={<AddRemoveApplicationType />}
              />
              <Route path="pingroup" element={<PinGroup />}>
                <Route index element={<PinnedGroupsTable />} />
                <Route path="normalgroupstable" element={<NormalGroupsTable />} />
                <Route
                  path="pinnedgroupstable"
                  element={<PinnedGroupsTable />}
                />
              </Route>
              <Route path="makeAdmin" element={<MakeAdmin />} />
              <Route path="addBlog" element={<AddBlog />} />
              <Route
                path="groupreportsetting"
                element={<GroupReportSetting />}
              />
              <Route path="updategroup" element={<UpdateGroup />} />
              <Route path="updategroup/:groupId" element={<UpdateGroup />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
