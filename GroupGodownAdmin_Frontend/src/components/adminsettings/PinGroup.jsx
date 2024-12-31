import React from "react";
import { Outlet, Link } from "react-router-dom";
import baselinks from "../../../baselinks.json";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));

const baseUri = oBaseUri.DefaultbaseUri;

const perPageitem = oBaseUri.records;

function PinGroup() {
  return (
    <>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 ps-12 pe-12">
        <Link
          to=""
          className="flex flex-col gap-2 border-4 pt-9 pb-9 rounded-lg text-center hover:bg-gray-100"
        >
          <span className=" font-bold ">Pinned Groups</span>
          <span>Count</span>
        </Link>

        <Link
          to="normalgroupstable"
          className="flex flex-col gap-2 border-4 pt-9 pb-9 rounded-lg text-center hover:bg-gray-100"
        >
          <span className=" font-bold ">Normal Groups</span>
          <span>Count</span>
        </Link>
      </div>
      <Outlet />
    </>
  );
}

export default PinGroup;
