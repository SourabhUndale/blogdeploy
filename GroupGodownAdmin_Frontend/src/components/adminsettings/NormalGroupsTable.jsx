import React, { useState, useEffect, useCallback, useMemo } from "react";
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
      `${baseUri}odata/Groups?$expand=Reports,Application,Category&$filter=Pin eq false`,
      {
        method: "GET",
        headers: headersList,
      }
    );
  
    const res = await response.json();
    //console.log(res);
    return res ? res.value : [];
  } catch (error) {
    if(error.response.status === 401)
    {
      window.location = '/';
    }
    //console.error("Error",error);
  }
}

function NormalGroupsTable() {

  const [open, setOpen] = useState(false);
  const [groupIdToPin, setGroupIdToPin] = useState(null); 

  const [data, setData] = useState([]);
  const [jwtToken, setJwtToken] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(perPageitem);

  const handleClickOpen = (groupId) => {
    setOpen(true);
    setGroupIdToPin(groupId)
  };

  const handleClose = () => {
    setOpen(false);
    setGroupIdToPin(null);
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

  const pinGroup = async () => {
    try{
      const response = await axios.put(
        `${baseUri}groups/Pin?id=${groupIdToPin}`,
        {id : groupIdToPin},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      //console.log(groupIdToPin);

      if(response.data)
      {
        // alert("Group Pinned"); // Removed alert
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
      //console.error("Error",error);
    }
  }

  // //console.log(data);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = useCallback((event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset current page when changing items per page
  }, []);

  const handleGoToPageChange = (e) => {
    setGoToPage(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
    setGoToPage("");
  };

  const handleGoToPageKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const numPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage) < 1
      ? 1
      : Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData, itemsPerPage]);

  // Helper to generate pagination array
  const getPagination = useCallback(() => {
    const pages = [];
    if (numPages <= 3) {
      for (let i = 1; i <= numPages; i++) pages.push(i);
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === numPages) {
        pages.push(numPages - 2, numPages - 1, numPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  }, [numPages, currentPage]);

  return (
    <>
      <div className="mt-5">
        <h1 className="p-2 font-semibold text-lg">Normal Groups</h1>
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
                    
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Sr.no.
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Group Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Group Links
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Group Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Country
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Language
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Application Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Reports Count
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Pin/Unpin Group
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((normalGroups, index) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + index + 1;
                          return (
                            <tr key={index}>
                           
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                                {serialNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {normalGroups.groupName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                <a className="text-black" href={normalGroups.groupLink} target="_blank" rel="noopener noreferrer">{normalGroups.groupLink}</a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {normalGroups.Category.catName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {normalGroups.country}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {normalGroups.Language}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {normalGroups.Application.appName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {normalGroups.Reports.length}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                <button
                                  type="button"
                                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                  // onClick={handleClickOpen}
                                  onClick={() => handleClickOpen(normalGroups.groupId)}
                                >
                                  Pin
                                </button>
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Confirm Pin Group"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Do you really want to pin this group?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose}>
                                      No
                                    </Button>
                                    <Button onClick={pinGroup} autoFocus>
                                      Yes
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="py-1 px-4">
                  <nav className="flex flex-wrap items-center justify-between w-full">
                    {/* Left: Pagination */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
                      {getPagination().map((page, idx) =>
                        page === "..." ? (
                          <span key={"ellipsis-" + idx} className="px-2">...</span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            className={`min-w-[40px] flex justify-center items-center text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none ${
                              currentPage === page ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                            disabled={currentPage === page}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
                    </div>
                    {/* Right: Go to page and dropdown */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={goToPage}
                        onChange={handleGoToPageChange}
                        onKeyDown={handleGoToPageKeyDown}
                        placeholder="Go to page"
                        className="w-20 p-2 border rounded text-sm text-gray-800 focus:ring-1 focus:ring-gray-600"
                      />
                      <button
                        type="button"
                        onClick={handleGoToPage}
                        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Go
                      </button>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="p-2.5 border rounded text-sm text-gray-800 focus:ring-1 focus:ring-gray-600"
                      >
                        {[10, 20, 30, 40, 50].map((perPageOption) => (
                          <option key={perPageOption} value={perPageOption}>
                            {perPageOption} per page
                          </option>
                        ))}
                      </select>
                    </div>
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

export default NormalGroupsTable;
