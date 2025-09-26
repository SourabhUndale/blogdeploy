import React, { useState, useEffect, useMemo, useCallback } from "react";
import useDataFetch from "../../useDataFetch";
import api from "../../utils/api"; // Use the custom Axios instance
import languagesData from "../../../lang.json";
import countryData from "../../../country-by-abbreviation.json"
import { data } from "autoprefixer";
import baselinks from "../../../baselinks.json";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { isValidToken, redirectToLogin } from '../../utils/auth';

function AddRemoveGroup() {
  const [open, setOpen] = useState(false);
  const [groupIdToDelete, setGroupIdToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'soft' or 'hard'
  const navigate = useNavigate();

  const oBaseUri = JSON.parse(JSON.stringify(baselinks));
  const baseUri = oBaseUri.DefaultbaseUri;
  const countryUri = oBaseUri.countryUri;
  const perPageitem = oBaseUri.records;
  const langData = JSON.parse(JSON.stringify(languagesData));
  const coutriesData = JSON.parse(JSON.stringify(countryData));

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(perPageitem);
  const [goToPage, setGoToPage] = useState("");

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleClickOpen = useCallback((groupId, type) => {
    setOpen(true);
    setGroupIdToDelete(groupId);
    setDeleteType(type);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setGroupIdToDelete(null);
    setDeleteType(null);
  }, []);

  const handleItemsPerPageChange = useCallback((event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset current page when changing items per page
  }, []);

  const { data: apiResponse, loading: countriesLoading } = useDataFetch(
    countryUri,
    []
  );

  const countries = apiResponse?.result || [];

  const { data: categories, loading: categoriesLoading } = useDataFetch(
    `${baseUri}api/Category`,
    []
  );

  const { data: applicationtype, loading: applicationTypesLoading } =
    useDataFetch(`${baseUri}api/Application`, []);


  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedApplicationType, setSelectedApplicationType] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const [tags, setTags] = useState("");
  const [groupInformation, setGroupInformation] = useState("");

  const [groupLinkError, setGroupLinkError] = useState("");
  const [selectedCategoryError, setSelectedCategoryError] = useState("");
  const [selectedCountryError, setSelectedCountryError] = useState("");
  const [selectedLanguageError, setSelectedLanguageError] = useState("");
  const [selectedApplicationTypeError, setSelectedApplicationTypeError] =
    useState("");
  // const [jwtToken, setJwtToken] = useState(); // Remove this line

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isValidToken()) {
      redirectToLogin();
      return;
    }

    let formIsValid = true;

    if (!groupLink) {
      setGroupLinkError("Please enter the group link");
      formIsValid = false;
    } else {
      setGroupLinkError("");
    }

    if (!selectedCategory) {
      setSelectedCategoryError("Please select a category");
      formIsValid = false;
    } else {
      setSelectedCategoryError("");
    }

    if (!selectedCountry) {
      setSelectedCountryError("Please select a country");
      formIsValid = false;
    } else {
      setSelectedCountryError("");
    }

    if (!selectedLanguage) {
      setSelectedLanguageError("Please select a language");
      formIsValid = false;
    } else {
      setSelectedLanguageError("");
    }

    if (!selectedApplicationType) {
      setSelectedApplicationTypeError("Please select an application type");
      formIsValid = false;
    } else {
      setSelectedApplicationTypeError("");
    }

    if (!formIsValid) {
      return;
    }

    // Handling the submit click

    try {
      // Prepare data for the API call
      const requestData = {
        groupLink: groupLink,
        country: selectedCountry,
        language: selectedLanguage,
        groupDesc: groupInformation, // Assuming groupInformation is the group description
        groupRules: "", // You may need to add a separate input for group rules
        tags: tags,
      };

      

      // Make the API call using Axios
      const response = await api.post(
        `${baseUri}groups?catId=${selectedCategory}&appid=${selectedApplicationType}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('bearerToken')}`,
          },
        }
      );

      if (response.status === 200) {
        const resData = JSON.parse(JSON.stringify(response.data));

        if (resData.message != null) {
          //console.log(resData);
          alert(resData.message);
          //console.log("Already exists");
        }

        if (resData.message === null) {
          alert("New group added");

          setGroupLink("");
          setSelectedCategory("");
          setSelectedCountry("");
          setSelectedLanguage("");
          setSelectedApplicationType("");
          setTags("");
          setGroupInformation("");
          fetchDataFromAPI(); // Refresh data after successful addition
        }
      }

      if (response.data === "Group not valid") {
        //console.log(response.data);
        alert("Group link not valid");
      }
    } catch (error) {
      // The Axios interceptor will handle 401 errors globally
      //console.error("API call failed:", error);
      // You can also handle errors by showing an error message to the user
    }
  };


  const [groups, setGroups] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    // const token = sessionStorage.getItem("bearerToken"); // Remove this block
    // if (token) {
    //   setJwtToken(token);
    // }
  }, []);

  useEffect(() => {
    fetchDataFromAPI();
  }, []); // Empty dependency array to run the effect only once

  // Function to fetch data from the API
  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${baseUri}odata/Groups?$expand=Reports,Application,Category`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGroups(data.value.reverse()); // Accessing the 'value' array
      setError(null);
    } catch (error) {
      setError(error);
      //console.error("Error fetching initial API data:", error);
    }
  };

  

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }, []);



  const filteredData = useMemo(() => {
    return groups.filter((item) => 
    item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },[groups,searchQuery,itemsPerPage]);

  const numPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage) < 1
      ? 1
      : Math.ceil(filteredData.length / itemsPerPage);
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


  const softDeleteGroup = useCallback(async () => {
    if (!isValidToken()) {
      redirectToLogin();
      return;
    }
      if (!groupIdToDelete) return;
  
      try {
        const authToken = sessionStorage.getItem("bearerToken");
        //console.log(authToken);
        //console.log(groupIdToDelete);
        if (!authToken) {
          throw new Error("Token Not Found");
        }
        const response = await api.delete(
          `${baseUri}groups/${groupIdToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        if (response.status === 200) {
          //console.log(response); // Log the response from the server
          alert("Group deleted successfully"); // Notify the user
          setOpen(false);
          setGroupIdToDelete(null);
          setDeleteType(null);
          fetchDataFromAPI();
          setGroups(groups.filter(group => group.groupId !== groupIdToDelete));
        }
      } catch (error) {
        //console.error("Error deleting group:", error);
        // Handle errors, e.g., display an error message to the user
        alert("Error deleting group. Please try again.");
      }
    },[baseUri, groupIdToDelete, fetchDataFromAPI, setGroups, groups]);

  const hardDeleteGroup = useCallback(async () => {
    if (!isValidToken()) {
      redirectToLogin();
      return;
    }
    if (!groupIdToDelete) return;

    try {
      const authToken = sessionStorage.getItem("bearerToken");
      //console.log(authToken);
      //console.log(groupIdToDelete);
      if (!authToken) {
        throw new Error("Token Not Found");
      }
      const response = await api.delete(
        `${baseUri}groups/harddelete/${groupIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        //console.log(response); // Log the response from the server
        alert("Group hard deleted successfully"); // Notify the user
        setOpen(false);
        setGroupIdToDelete(null);
        setDeleteType(null);
        fetchDataFromAPI();
        setGroups(groups.filter(group => group.groupId !== groupIdToDelete));
      }
    } catch (error) {
      //console.error("Error hard deleting group:", error);
      alert("Error hard deleting group. Please try again.");
    }
  }, [groupIdToDelete, fetchDataFromAPI, setGroups, groups]);

  return (
    <>
      <h1 className="p-2 font-bold text-2xl text-center pb-4">Add Group </h1>
      <form className="w-full" onSubmit={handleFormSubmit}>
        <div className="addgroup-main-div p-4">
          <div className="sub-div">
            <div className="mb-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                Add Group Link
              </label>
              <input
                type="text"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 text-black-500 dark:text-black-400appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                  groupLinkError ? "is-invalid" : ""
                }`}
                placeholder=" "
                value={groupLink}
                onChange={(e) => {
                  setGroupLink(e.target.value);
                  setGroupLinkError("");
                }}
                required
              />
              {groupLinkError && (
                <div className="invalid-feedback">{groupLinkError}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Select Category
            </label>
            <select
              name="Category"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                selectedCategory ? "is-invalid" : ""
              }`}
              value={selectedCategory}
              onChange={(e) => {
                const selectedcat = e.target.value;
                const newCat = selectedcat === "Select" ? "" : selectedcat;
                setSelectedCategory(newCat);
                setSelectedCategoryError("");
              }}
            >
              <option>Select</option>
              {categories
                .sort((a, b) => a.catName.localeCompare(b.catName)) // Sort categories alphabetically by name
                .map((category) => (
                  <option key={category.catId} value={category.catId}>
                    {category.catName}
                  </option>
                ))}
            </select>
            {selectedCategoryError && (
              <div className="invalid-feedback">{selectedCategoryError}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2">
              Select Country
            </label>
            <select
              name="Country"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                selectedCountryError ? "is-invalid" : ""
              }`}
              value={selectedCountry}
              onChange={(e) => {
                const selectedCon = e.target.value;
                const newCon = selectedCon === "Select" ? "" : selectedCon;
                setSelectedCountry(newCon);
              }}
            >
              <option>Select</option>
            
                {countryData.map(({ abbreviation, country }) => (
                <option key={abbreviation} value={country}>
                  {country}
                </option>  

              ))}

            

            </select>
            {selectedCountryError && (
              <div className="invalid-feedback">{selectedCountryError}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2">
              Select Language
            </label>
            <select
              name="Language"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                selectedLanguageError ? "is-invalid" : ""
              }`}
              value={selectedLanguage}
              onChange={(e) => {
                const selectedLang = e.target.value;
                const newLang = selectedLang === "Select" ? "" : selectedLang;
                setSelectedLanguage(newLang);
              }}
            >
              <option>Select</option>
              {Object.entries(langData).map(([code, name]) => (
                <option key={code} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {selectedLanguageError && (
              <div className="invalid-feedback">{selectedLanguageError}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2">
              Select Application Type
            </label>
            <select
              name="Type"
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
          ${selectedApplicationTypeError ? "is-invalid" : ""}`}
              value={selectedApplicationType}
              onChange={(e) => {
                const selectedApptype = e.target.value;
                const newApptype =
                  selectedApptype === "Application" ? "" : selectedApptype;
                setSelectedApplicationType(newApptype);
              }}
            >
              <option>Select</option>
              {applicationtype.map((applications) => (
                <option key={applications.id} value={applications.id}>
                  {applications.name}
                </option>
              ))}
            </select>
            {selectedApplicationTypeError && (
              <div className="invalid-feedback">
                {selectedApplicationTypeError}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Tags
            </label>
            <input
              type="text"
              id="tagsInput"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 text-black-500 dark:text-black-400appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Group Description
            </label>
            <input
              id="groupInformationInput"
              type="text"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 text-black-500 dark:text-black-400appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={groupInformation}
              onChange={(e) => setGroupInformation(e.target.value)}
              placeholder=" "
            />
          </div>

          <div className="mt-6">
            <button
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              type="submit"
            >
              Add
            </button>
          </div>
        </div>
      </form>

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
                        Sr.no.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-white uppercase"
                      >
                        Category Name
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
                        Group Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-white uppercase"
                      >
                        Group Link
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-white uppercase"
                      >
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredData
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((group, index) => {
                        const serialNumber =
                          (currentPage - 1) * itemsPerPage + index + 1;

                        return (
                          <tr key={index}>
                          
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {serialNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {group.Category.catName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {group.Application.appName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {group.country}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {group.Language}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              {group.groupName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              <a href={`${group.groupLink}`} target="_blank" rel="noopener noreferrer">{group.groupLink}</a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                              <button
                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={() => navigate(`/adminsettings/updategroup/${group.groupId}`)}
                              >
                                Update
                              </button>
                              <button
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={() => handleClickOpen(group.groupId, 'soft')}
                              >
                                Remove
                              </button>
                              <button
                                className="text-white bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={() => handleClickOpen(group.groupId, 'hard')}
                              >
                                Hard Delete
                              </button>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle id="alert-dialog-title">
                                  {deleteType === 'hard' ? "Hard Delete Group" : "Remove Group"}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    {deleteType === 'hard' ? "Do you really want to permanently delete the group?" : "Do you really want to delete the group?"}
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose}>No</Button>
                                  <Button onClick={deleteType === 'hard' ? hardDeleteGroup : softDeleteGroup} autoFocus>
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
    </>
  );
}

export default AddRemoveGroup;
