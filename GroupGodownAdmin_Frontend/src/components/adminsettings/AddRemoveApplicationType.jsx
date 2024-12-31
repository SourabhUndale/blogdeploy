import React, { useEffect, useState } from "react";
import axios from "axios";
import baselinks from "../../../baselinks.json";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));

const baseUri = oBaseUri.DefaultbaseUri;

const perPageitem = oBaseUri.records;


async function fetchData() {
  

  try {
    let headersList = {
      Accept: "*/*",
    };
  
    let response = await fetch(`${baseUri}api/application`, {
      method: "GET",
      headers: headersList,
    });
  
    const res = await response.json();
    return res;
  } catch (error) {
    if(error.response.status === 401)
    {
      window.location = '/';
    }
    console.error("Error:", error);
  }
}


function AddRemoveApplicationType() {

  const [data, setData] = useState([]);
  const [jwtToken, setJwtToken] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem('bearerToken');
    if(token)
    {
      setJwtToken(token);
    }
  },[]);

  useEffect(() => {
    async function getData() {
      const result = await fetchData();
      setData(result);
    }
    getData();
  }, []);

  const addApplication = async () => {
    const applicationNameInput = document.getElementById("appName");
    let applicationName = applicationNameInput.value.trim();
    // console.log(categoryName);
  

    if(!applicationName || /^\s*$/.test(applicationName))
    {
      alert("Application type can not be empty");
      return
    }

    try {
      const response = await axios.post(
        `${baseUri}api/application`,
        { name: applicationName },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setData([...data,response.data]);
      applicationNameInput.value = '';
      alert("New Application Type Added");
      console.log(response);
      // return response;
    } catch (error) {
      if(error.response.status === 401)
      {
        window.location = '/';
      }
      console.error("Error:", error);
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = perPageitem;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // console.log(data);

  // Search for category
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }

  const filteredData = data.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const numPages = Math.ceil(filteredData.length / itemsPerPage) < 1 ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <div>
        <h1 className="p-2 font-bold text-2xl text-center pb-4">
          Add Application Type{" "}
        </h1>
        <div className="max-w-md mx-auto mt-4">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="appNum"
              id="appNum"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
              value={data.length + 1}
            />
            <label
              for="appNum"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Application ID
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="appName"
              id="appName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            />
            <label
              for="appName"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Application Type
            </label>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-8 flex justify-around">
          <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={addApplication}>
            Add
          </button>
          {/* <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Search
          </button> */}
          {/* <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Update
          </button> */}
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
                           className="px-6 py-3  text-xs font-medium text-gray-500 uppercase"
                        >
                          Application ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                        >
                          Application Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredData
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((appType, index) => {
                          const serialNumber =
                            (currentPage - 1) * itemsPerPage + index + 1;
                          return (
                        <tr key={index}>
                        {/* <td className="py-3 ps-4">
                          <div className="flex items-center h-5">
                            <input
                              id="hs-table-pagination-checkbox-1"
                              type="checkbox"
                              className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                            />
                            <label
                              for="hs-table-pagination-checkbox-1"
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
                          {appType.name}
                        </td>
                      </tr>
                          );
                      })}
                      
                    </tbody>
                  </table>
                </div>
                <div className="py-1 px-4">
                  <nav className="flex items-center space-x-1">
                    <button
                      type="button"
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      onClick={() => handlePageChange(currentPage - 1 > 0 ? currentPage -1 : 1)}
                      disabled={currentPage === 1}
                    >
                      <span aria-hidden="true">«</span>
                      <span className="sr-only">Previous</span>
                    </button>
                    {Array.from({
                      length: numPages
                    }).map((_,index) => (
                      <button
                      type="button"
                      className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      aria-current={
                        currentPage === index + 1 ? "page" : undefined
                      }
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                    ))}
                    

                    <button
                      type="button"
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      onClick={() => handlePageChange(currentPage + 1 <= numPages ? currentPage + 1: numPages)}
                      disabled={
                        currentPage === numPages
                      }
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

export default AddRemoveApplicationType;
