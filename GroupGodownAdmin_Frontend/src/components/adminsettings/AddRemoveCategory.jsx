import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../utils/api"; // Use the custom Axios instance
import baselinks from "../../../baselinks.json";
import { isValidToken, redirectToLogin } from '../../utils/auth';

const oBaseUri = JSON.parse(JSON.stringify(baselinks));

const baseUri = oBaseUri.DefaultbaseUri;

const perPageitem = oBaseUri.records;

async function fetchData() {
  
  try {
    // No need for headersList here, Axios can handle common headers
    const response = await api.get(`${baseUri}api/Category`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('bearerToken')}`,
      },
    });
  
    // Axios automatically parses JSON, so no need for response.json()
    return response.data;
  
  } catch (error) {
    // The Axios interceptor will handle 401 errors globally
    
    return [];
  }
}

function AddRemoveCategory() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [goToPage, setGoToPage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(perPageitem);

  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (token) {
      // setJwtToken(token); // Remove this line
    }
  }, []);

  useEffect(() => {
    async function getData() {
      const result = await fetchData();
      setData(result);
    }
    getData();
  }, []);

  const addCategory = async () => {
    if (!isValidToken()) {
      redirectToLogin();
      return;
    }
    const categoryNameInput = document.getElementById("catName");
    let categoryName = categoryNameInput.value.trim();
    // //console.log(categoryName);

    if (!categoryName || /^\s*$/.test(categoryName)) {
      alert("Category name cannot be empty");
      return; // Exit function early
    }

    try {
      const response = await api.post(
        `${baseUri}api/Category`,
        { name: categoryName },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('bearerToken')}`,
          },
        }
      );

      setData([...data, response.data]);
      categoryNameInput.value = "";
      alert("New Category Added");
      
      // return response;
    } catch (error) {
      if(error.response.status === 401)
      {
        window.location = '/';
      }
      
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // //console.log(data);

  // Search for category
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.catName.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <>
      <div>
        <h1 className="p-2 font-bold text-2xl text-center pb-4">
          Add Category{" "}
        </h1>
        <div className="max-w-md mx-auto mt-4">
          <div className="relative z-0 w-full mb-5 group">
            <input
              // disabled
              type="number"
              name="floating_email"
              id="catNum"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={data.length + 1}
            />
            <label
              for="catNum"
              className="peer-focus:font-medium absolute text-sm text-black-500 dark:text-black-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Category ID
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="appName"
              id="catName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 text-black-500 dark:text-black-400 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            />
            <label
              for="catName"
              className="peer-focus:font-medium absolute text-sm text-black-500 dark:text-black-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Category Name
            </label>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-8 flex justify-around">
          <button
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={addCategory}
          >
            Add
          </button>
       
        </div>

        <div className="flex flex-col mt-7">
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
                          Category ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-white uppercase"
                        >
                          Category Name
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((category, index) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + index + 1;
                          return (
                            <tr key={index}>
                       
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {serialNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                {category.catName}
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
                        className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-600"
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

export default AddRemoveCategory;
