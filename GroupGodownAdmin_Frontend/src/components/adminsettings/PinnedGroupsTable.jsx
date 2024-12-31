import React, { useState, useEffect } from "react";
import axios from "axios";
import baselinks from "../../../baselinks.json";
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));
const baseUri = oBaseUri.DefaultbaseUri;
const perPageitem = oBaseUri.records;

async function fetchData() {
  

  try {
    let headersList = {
      Accept: "*/*",
    };
  
    let response = await fetch(
      `${baseUri}odata/Groups?$expand=Reports,Application&$filter=Pin eq true`,
      {
        method: "GET",
        headers: headersList,
      }
    );
  
    const res = await response.json();
    return res ? res.value : [];
  } catch (error) {
    if(error.response.status === 401)
    {
      window.location = '/';
    }
    console.error("Error: ",error);
  }
}

function PinnedGroupsTable() {


  const [open, setOpen] = useState(false);
  const [groupIdTounpin, setGroupIdTounpin] = useState(null); 

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jwtToken, setJwtToken] = useState();

  const handleClickOpen = (groupId) => {
    setOpen(true);
    setGroupIdTounpin(groupId);
  };

  const handleClose = () => {
    setOpen(false);
    setGroupIdTounpin(null);
  };


  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (token) {
      setJwtToken(token);
    }
  }, []);

  useEffect(() => {
    async function getData() {
      const result = await fetchData();
      setData(result);
    }
    getData();
  }, []);

  const unpinGroup = async () => {
    try{
      const response = await axios.put(
        `${baseUri}api/Groups/Pin?id=${groupIdTounpin}`,
        {id : groupIdTounpin},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(groupIdTounpin)

      if(response.data)
      {
        alert("Group Unpinned");
        fetchData().then((result) => {
          setData(result);
        });
        setOpen(false);
      }
      else{

      }
    } catch(error){
      if(error.response.status === 401)
      {
        window.location = '/';
      }
      console.error("Error",error);
    }
  }

  // console.log(data);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = perPageitem;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) =>
    item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const numPages =
    Math.ceil(filteredData.length / itemsPerPage) < 1
      ? 1
      : Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <div className="mt-5">
        <h1 className="p-2 font-semibold text-lg">Pinned Groups</h1>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
                <div className="py-3 px-4">
                  <div className="relative max-w-xs">
                    <label className="sr-only">Search</label>
                    <input
                      type="text"
                      name="hs-table-with-pagination-search"
                      id="hs-table-with-pagination-search"
                      className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                      placeholder="Search for items"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {/* <th scope="col" className="py-3 px-4 pe-0">
                          <div className="flex items-center h-5">
                            <input
                              id="hs-table-pagination-checkbox-all"
                              type="checkbox"
                              className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                            />
                            <label
                              for="hs-table-pagination-checkbox-all"
                              className="sr-only"
                            >
                              Checkbox
                            </label>
                          </div>
                        </th> */}
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Sr.no.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Group Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Group Links
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Group Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Country
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Language
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Application Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Reports Count
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Pin/Unpin Group
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData
                      .slice(
                        (currentPage -1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((pinnedGroup,index) => {
                        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        return(
                          <tr key={index}>
                        {/* <td className="py-3 ps-4">
                          <div className="flex items-center h-5">
                            <input
                              id={`hs-table-pagination-checkbox-1${serialNumber}`}
                              type="checkbox"
                              className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                            />
                            <label
                              htmlFor={`hs-table-pagination-checkbox-1 ${serialNumber}`}
                              className="sr-only"
                            >
                              Checkbox
                            </label>
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        {serialNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {pinnedGroup.groupName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <a href="#">{pinnedGroup.groupLink}</a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {pinnedGroup.catId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {pinnedGroup.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {pinnedGroup.Language}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {pinnedGroup.Application.appName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {pinnedGroup.Reports.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          <button
                            type="button"
                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-rnormalGroupsed-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={() => handleClickOpen(pinnedGroup.groupId)}
                          >
                            Unpin
                          </button>
                          <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Pin Group"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Click on 'Yes' to pin group else 'No'
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose}>
                                      No
                                    </Button>
                                    <Button onClick={unpinGroup} autoFocus>
                                      Yes
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                        </td>
                      </tr>
                        )
                      })}
                      
                    </tbody>
                  </table>
                </div>
                <div className="py-1 px-4">
                  <nav className="flex items-center space-x-1">
                    <button
                      type="button"
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      onClick={() =>
                        handlePageChange(
                          currentPage - 1 > 0 ? currentPage - 1 : 1
                        )
                      }
                      disabled={currentPage === 1}
                    >
                      <span aria-hidden="true">«</span>
                      <span className="sr-only">Previous</span>
                    </button>
                    {Array.from({
                      length: numPages}).map((_, index) => (
                      <button
                        type="button"
                        className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      onClick={() =>
                        handlePageChange(
                          currentPage + 1 <= numPages
                            ? currentPage + 1
                            : numPages
                        )
                      }
                      disabled={currentPage === numPages}
                    >
                      <span className="sr-only">Next</span>
                      <span aria-hidden="true">»</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PinnedGroupsTable;
