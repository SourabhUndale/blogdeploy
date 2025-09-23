import React, { useState, useEffect, useMemo, useCallback } from "react";
import useDataFetch from "../../useDataFetch";
import axios from "axios";
import languagesData from "../../../lang.json";
import baselinks from "../../../baselinks.json";
import * as XLSX from "xlsx";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));
const baseUri = oBaseUri.DefaultbaseUri;
const perPageitem = oBaseUri.records;

async function fetchData() {
  let headersList = {
    Accept: "*/*",
  };

  try {
    let response = await fetch(`${baseUri}odata/Groups?$expand=Reports,Application,Category`, {
      method: "GET",
      headers: headersList,
    });

    const res = await response.json();
    return res ? res.value : [];
  } catch (error) {
    //console.error('Error fetching data:', error);
    return [];
  }
}

async function searchData(catId, appId) {
  let headersList = {
    Accept: "*/*",
  };

  let filterString = '';

  if (catId) {
    filterString += `catId eq ${catId}`;
  }

  if (appId) {
    if (filterString) filterString += ' and ';
    filterString += `appId eq ${appId}`;
  }

  try {
    let response = await fetch(
      `${baseUri}odata/Groups?$expand=Reports,Application,Category${filterString ? `&$filter=${filterString}` : ''}`,
      {
        method: "GET",
        headers: headersList,
      }
    );

    const res = await response.json();
    return res ? res.value : [];
  } catch (error) {
    //console.error('Error searching data:', error);
    return [];
  }
}

function Reports() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryError, setSelectedCountryError] = useState("");
  const [selectedApplicationTypeError, setSelectedApplicationTypeError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(perPageitem);
  const [goToPage, setGoToPage] = useState("");

  const { data: categories, loading: categoriesLoading } = useDataFetch(
    `${baseUri}api/Category`,
    []
  );

  const { data: applicationtype, loading: applicationTypesLoading } = useDataFetch(
    `${baseUri}api/Application`,
    []
  );

  useEffect(() => {
    async function getData() {
      const result = await fetchData();
      setData(result);
    }
    getData();
  }, []);

  const handleSearchClick = async () => {
    const catId = document.getElementById("categories").value;
    const appId = document.getElementById("application").value;

    if (!catId && !appId) {
      setSelectedCountryError("Please select a category");
      setSelectedApplicationTypeError("Please select an application type");
      return;
    }

    setSelectedCountryError("");
    setSelectedApplicationTypeError("");

    const result = await searchData(catId, appId);
    setData(result);
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }, []);

  const filteredData = (data || []).filter((item) =>
    item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemsPerPageChange = useCallback((event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset current page when changing items per page
  }, []);

  const numPages = useMemo(() => {
    return Math.ceil((filteredData || []).length / itemsPerPage) < 1
      ? 1
      : Math.ceil((filteredData || []).length / itemsPerPage);
  }, [filteredData, itemsPerPage]);

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

  const exportToExcel = () => {
    const headers = [
      "Serial Number",
      "Category ID",
      "Application ID",
      "Group Name",
      "Group Link",
      "Number of Reports",
    ];
    const dataToExport = (filteredData || []).map((group, index) => {
      return [
        index + 1,
        group.Category.catName,
        group.Application.appName,
        group.groupName,
        group.groupLink,
        group.Reports.length,
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Groups Data");
    XLSX.writeFile(workbook, "groups_data.xlsx");
  };

  return (
    <>
      <div>
        <h1 className="p-2 font-bold text-2xl text-center pb-4">Reports </h1>
        <div>
          <label
            htmlFor="categories"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Category Name
          </label>
          <select
            id="categories"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled selected>Select</option>
            {categories.map((cat) => (
              <option key={cat.catId} value={cat.catId}>
                {cat.catName}
              </option>
            ))}
          </select>
          {selectedCountryError && <p className="text-red-500">{selectedCountryError}</p>}
          
          <label
            htmlFor="application"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-3"
          >
            Application Type
          </label>
          <select
            id="application"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled selected>Select</option>
            {applicationtype.map((application) => (
              <option key={application.id} value={application.id}>
                {application.name}
              </option>
            ))}
          </select>
          {selectedApplicationTypeError && <p className="text-red-500">{selectedApplicationTypeError}</p>}
        </div>
        <div className="p-4">
          <button
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={handleSearchClick}
          >
            Search
          </button>
          <button
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={exportToExcel}
          >
            Export
          </button>
        </div>
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
                <div className="py-3 px-4">
                  <div className="relative max-w-xs">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search"
                      className="border border-gray-300 rounded-lg p-2.5 w-full"
                    />
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase">Serial Number</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase">Category ID</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase">Application ID</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase">Group Name</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase">Group Link</th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium text-white uppercase">Number of Reports</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(filteredData || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((group, index) => {
                      const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{serialNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{group.Category.catName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{group.Application.appName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{group.groupName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{group.groupLink}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{group.Reports.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="py-1 px-4">
                  <nav className="flex flex-wrap items-center justify-between w-full">
                    {/* Left: Pagination */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        onClick={() => handlePageChange(currentPage - 1 > 0 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                      >
                        <span aria-hidden="true">«</span>
                        <span className="sr-only">Previous</span>
                      </button>
                      {getPagination().map((page, idx) =>
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
                      )}
                      <button
                        type="button"
                        className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        onClick={() => handlePageChange(currentPage + 1 <= numPages ? currentPage + 1 : numPages)}
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

export default Reports;

