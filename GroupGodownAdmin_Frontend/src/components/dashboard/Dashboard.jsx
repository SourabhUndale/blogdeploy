import React from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <>
      {/* group tabs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Link
          to=""
          className="border-4 pt-9 pb-9 rounded-lg text-center hover:bg-gray-100"
        >
          All Groups
        </Link>

        <Link
          to="reportedgroupstable"
          className="border-4 pt-9 pb-9 rounded-lg text-center hover:bg-gray-100"
        >
          Reported Groups
        </Link>

        <Link
          to="unreportedgroupstable"
          className="border-4 pt-9 pb-9 rounded-lg text-center hover:bg-gray-100"
        >
          UnReported Groups
        </Link>

        <Link
          to="activegroupstable"
          className="border-4 pt-9 pb-9 rounded-lg text-center hover:bg-gray-100"
        >
          Active Groups
        </Link>
      </div>
      <Outlet />
    </>
  );
}

export default Dashboard;
