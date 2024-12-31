// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import useDataFetch from "../../useDataFetch";
// import axios from "axios";
// import languagesData from "../../../lang.json";
// import { data } from "autoprefixer";
// import baselinks from "../../../baselinks.json";
// import * as XLSX from "xlsx";

// const oBaseUri = JSON.parse(JSON.stringify(baselinks));
// const baseUri = oBaseUri.DefaultbaseUri;
// const perPageitem = oBaseUri.records;

// async function fetchData() {
//   let headersList = {
//     Accept: "*/*",
//   };

//   let response = await fetch(`${baseUri}odata/Groups?$expand=Reports,Application,Category`, {
//     method: "GET",
//     headers: headersList,
//   });

//   const res = await response.json();
//   console.log(res);
//   return res ? res.value : [];
// }



// async function searchData() {
//   const catId = document.getElementById("categories").value;
//   const appId = document.getElementById("application").value;

//   let headersList = {
//     Accept: "*/*",
//   };

//   let filterString = '';

//   if (catId) {
//     filterString += `catId eq ${catId}`;
//   }

//   if (appId) {
//     if (filterString) filterString += ' and ';
//     filterString += `appId eq ${appId}`;
//   }

//   let response = await fetch(
//     `${baseUri}odata/Groups?$expand=Reports,Application,Category${filterString ? `&$filter=${filterString}` : ''}`,
//     {
//       method: "GET",
//       headers: headersList,
//     }
//   );

//   const res = await response.json();
//   return res ? res.value : [];
// }

// function Reports() {
//   const [data, setData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCountryError, setSelectedCountryError] = useState("");
//   const [selectedApplicationTypeError, setSelectedApplicationTypeError] =
//     useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(perPageitem);

//   const { data: categories, loading: categoriesLoading } = useDataFetch(
//     `${baseUri}api/Category`,
//     []
//   );

//   const { data: applicationtype, loading: applicationTypesLoading } =
//     useDataFetch(`${baseUri}api/Application`, []);

//   useEffect(() => {
//     async function getData() {
//       const result = await fetchData();
//       setData(result);
//     }
//     getData();
//   }, []);

//   // const handleSearchClick = async () => {
//   //   var catId = document.getElementById("categories").value;
//   //   var appId = document.getElementById("application").value;

//   //   const result = await searchData(catId, appId);
//   //   setData(result);
//   // };

//   const handleSearchClick = async () => {
//     const result = await searchData();
//     setData(result);
//   };

  

//   const handlePageChange = useCallback((page) => {
//     setCurrentPage(page);
//   }, []);

//   const handleSearchChange = useCallback((event) => {
//     setSearchQuery(event.target.value);
//     setCurrentPage(1);
//   }, []);

//   const filteredData = data.filter((item) =>
//     item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleItemsPerPageChange = useCallback((event) => {
//     setItemsPerPage(parseInt(event.target.value));
//     setCurrentPage(1); // Reset current page when changing items per page
//   }, []);

//   const numPages = useMemo(() => {
//     return Math.ceil(filteredData.length / itemsPerPage) < 1
//       ? 1
//       : Math.ceil(filteredData.length / itemsPerPage);
//   }, [filteredData, itemsPerPage]);

//   // export the data in excel
//   const exportToExcel = () => {
//     const headers = [
//       "Serial Number",
//       "Category ID",
//       "Application ID",
//       "Group Name",
//       "Group Link",
//       "Number of Reports",
//     ];
//     const dataToExport = filteredData.map((group, index) => {
//       return [
//         index + 1,
//         group.Category.catName,
//         group.Application.appName,
//         group.groupName,
//         group.groupLink,
//         group.Reports.length,
//       ];
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Groups Data");
//     XLSX.writeFile(workbook, "groups_data.xlsx");
//   };

//   return (
//     <>
//       <div>
//         <h1 className="p-2 font-bold text-2xl text-center pb-4">Reports </h1>
//         <div>
//           <label
//             htmlFor="categories"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Category Name
//           </label>
//           <select
//             id="categories"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           >
//             <option disabled selected>
//               Select
//             </option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           <label
//             htmlFor="application"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3"
//           >
//             Application Type
//           </label>
//           <select
//             id="application"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           >
//             <option disabled selected>
//               Select
//             </option>
//             {applicationtype.map((application) => (
//               <option key={application.id} value={application.id}>
//                 {application.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="p-4">
//           <button
//             className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//             onClick={handleSearchClick}
//           >
//             Search
//           </button>
//           <button
//             className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
//             onClick={exportToExcel}
//           >
//             Export
//           </button>
//         </div>
//         <div className="flex flex-col">
//           <div className="-m-1.5 overflow-x-auto">
//             <div className="p-1.5 min-w-full inline-block align-middle">
//               <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
//                 <div className="py-3 px-4">
//                   <div className="relative max-w-xs">
//                     <label className="sr-only">Search</label>
//                     <input
//                       type="text"
//                       name="hs-table-with-pagination-search"
//                       id="hs-table-with-pagination-search"
//                       className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
//                       placeholder="Search for items"
//                       value={searchQuery}
//                       onChange={handleSearchChange}
//                     />
//                     <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
//                       <svg
//                         className="h-4 w-4 text-gray-400"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <circle cx="11" cy="11" r="8" />
//                         <path d="m21 21-4.3-4.3" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
//                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                       {filteredData
//                         .slice(
//                           (currentPage - 1) * itemsPerPage,
//                           currentPage * itemsPerPage
//                         )
//                         .map((item, index) => (
//                           <tr key={index}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
//                               {index + 1}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                               {item.Category.catName}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                               {item.Application.appName}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                               {item.groupName}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                               <a
//                                 href={item.groupLink}
//                                 target="_blank"
//                                 className="text-blue-500 hover:underline"
//                               >
//                                 {item.groupLink}
//                               </a>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                               {item.Reports.length}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="py-2 px-4">
//                   <nav
//                     className="hs-pagination hs-pagination-sm flex justify-center items-center"
//                     aria-label="Pagination"
//                   >
//                     <a
//                       className="hs-pagination-item hs-pagination-item-prev hs-pagination-item-border rounded-sm py-1.5 px-3 hs-pagination-disabled:border-gray-200 hs-pagination-disabled:bg-gray-100 hs-pagination-disabled:text-gray-500 hs-pagination-disabled:cursor-not-allowed dark:hs-pagination-disabled:bg-gray-800 dark:hs-pagination-disabled:border-gray-700 dark:hs-pagination-disabled:text-gray-400"
//                       href="#"
//                       onClick={() =>
//                         handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                       }
//                     >
//                       <span className="sr-only">Previous</span>
//                       <svg
//                         className="w-3 h-3"
//                         width="16"
//                         height="16"
//                         viewBox="0 0 16 16"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M8.00065 2.66675L3.33398 8.00008L8.00065 13.3334"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M12.666 8H3.33398"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </a>
//                     {[...Array(numPages)].map((_, index) => (
//                       <a
//                         key={index}
//                         className={`hs-pagination-item hs-pagination-item-current hs-pagination-item-border rounded-sm py-1.5 px-3 hs-pagination-active:text-blue-600 hs-pagination-active:border-blue-600 dark:hs-pagination-active:bg-gray-800 dark:hs-pagination-active:text-gray-400 ${
//                           currentPage === index + 1
//                             ? "text-blue-600 border-blue-600"
//                             : ""
//                         }`}
//                         href="#"
//                         onClick={() => handlePageChange(index + 1)}
//                       >
//                         {index + 1}
//                       </a>
//                     ))}
//                     <a
//                       className="hs-pagination-item hs-pagination-item-next hs-pagination-item-border rounded-sm py-1.5 px-3 hs-pagination-disabled:border-gray-200 hs-pagination-disabled:bg-gray-100 hs-pagination-disabled:text-gray-500 hs-pagination-disabled:cursor-not-allowed dark:hs-pagination-disabled:bg-gray-800 dark:hs-pagination-disabled:border-gray-700 dark:hs-pagination-disabled:text-gray-400"
//                       href="#"
//                       onClick={() =>
//                         handlePageChange(
//                           currentPage < numPages ? currentPage + 1 : numPages
//                         )
//                       }
//                     >
//                       <span className="sr-only">Next</span>
//                       <svg
//                         className="w-3 h-3"
//                         width="16"
//                         height="16"
//                         viewBox="0 0 16 16"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M7.99935 13.3333L12.666 7.99996L7.99935 2.66663"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M3.33398 8H12.666"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </a>
//                   </nav>
//                 </div>
//                 <div className="flex items-center justify-between pt-3">
//                   <div className="flex items-center">
//                     <label
//                       htmlFor="itemsPerPage"
//                       className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-400"
//                     >
//                       Items per page:
//                     </label>
//                     <select
//                       id="itemsPerPage"
//                       value={itemsPerPage}
//                       onChange={handleItemsPerPageChange}
//                       className="py-2 px-3 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                       <option value={50}>50</option>
//                       <option value={100}>100</option>
//                     </select>
//                   </div>
//                   <div className="text-sm text-gray-700 dark:text-gray-400">
//                     Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                     {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
//                     of {filteredData.length} items
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Reports;

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
    console.error('Error fetching data:', error);
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
    console.error('Error searching data:', error);
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
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category Name
          </label>
          <select
            id="categories"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled selected>Select</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {selectedCountryError && <p className="text-red-500">{selectedCountryError}</p>}
          
          <label
            htmlFor="application"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3"
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
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Serial Number
                      </th>
                      <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Category ID
                      </th>
                      <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Application ID
                      </th>
                      <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Group Name
                      </th>
                      <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Group Link
                      </th>
                      <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Number of Reports
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(filteredData || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((group, index) => (
                      <tr key={index}>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">{group.Category.catName}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">{group.Application.appName}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">{group.groupName}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">{group.groupLink}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900 dark:text-white">{group.Reports.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded-lg p-2.5"
                    >
                      {[10, 20, 30, 50].map((number) => (
                        <option key={number} value={number}>
                          Show {number}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
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

