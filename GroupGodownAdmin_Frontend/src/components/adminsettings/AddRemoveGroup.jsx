import React, { useState, useEffect, useMemo, useCallback } from "react";
import useDataFetch from "../../useDataFetch";
import axios from "axios";
import languagesData from "../../../lang.json";
import { data } from "autoprefixer";
import baselinks from "../../../baselinks.json";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function AddRemoveGroup() {
  const [open, setOpen] = useState(false);
  const [groupIdToDelete, setGroupIdToDelete] = useState(null);

  const oBaseUri = JSON.parse(JSON.stringify(baselinks));
  const baseUri = oBaseUri.DefaultbaseUri;
  const countryUri = oBaseUri.countryUri;
  const perPageitem = oBaseUri.records;
  const langData = JSON.parse(JSON.stringify(languagesData));

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = perPageitem;

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // const handleClickOpen = (groupId) => {
  //   setOpen(true);
  //   console.log(groupId);
  //   setGroupIdToDelete(groupId);
  // };

  const handleClickOpen = useCallback((groupId) => {
    setOpen(true);
    setGroupIdToDelete(groupId);
  }, []);

  // const handleClose = () => {
  //   setOpen(false);
  //   setGroupIdToDelete(null);
  // };

  const handleClose = useCallback(() => {
    setOpen(false);
    setGroupIdToDelete(null);
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

  /////////////////////////////////////////////////////////////////////////

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
  const [jwtToken, setJwtToken] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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

      console.log(requestData);

      // Make the API call using Axios
      const response = await axios.post(
        `${baseUri}api/Groups?catId=${selectedCategory}&appid=${selectedApplicationType}`,
        requestData
      );

      if (response.status === 200) {
        const resData = JSON.parse(JSON.stringify(response.data));

        if (resData.message != null) {
          console.log(resData);
          alert(resData.message);
          console.log("Already exists");
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
        }
      }

      if (response.data === "Group not valid") {
        console.log(response.data);
        alert("Group link not valid");
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.location = "/";
      }
      // Handle error response
      console.error("API call failed:", error);
      // You can also handle errors by showing an error message to the user
    }
  };

  /////////////////////////////////////////////////////////////////////////

  const [groups, setGroups] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (token) {
      setJwtToken(token);
    }
  }, []);

  useEffect(() => {
    fetchDataFromAPI();
  }, []); // Empty dependency array to run the effect only once

  // Function to fetch data from the API
  const fetchDataFromAPI = async () => {
    try {
      const apiUrl = `${baseUri}api/Groups/id/Groups`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGroups(data.reverse());
      setError(null);
    } catch (error) {
      setError(error);
      console.error("Error fetching initial API data:", error);
    }
  };

  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  //   setCurrentPage(1);
  // };

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }, []);

  // const filteredData = groups.filter((item) =>
  //   item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredData = useMemo(() => {
    return groups.filter((item) => 
    item.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },[groups,searchQuery]);

  // const numPages =
  //   Math.ceil(filteredData.length / itemsPerPage) < 1
  //     ? 1
  //     : Math.ceil(filteredData.length / itemsPerPage);

  const numPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage) < 1
      ? 1
      : Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData, itemsPerPage]);
  ///////////////////////////////////////////////////

  const deleteGroup = useCallback(async () => {
      // alert("Delete Button Clicked");
      //console.log(`Delete Button Clicked ${groupId}`)
  
      if (!groupIdToDelete) return;
  
      try {
        const authToken = sessionStorage.getItem("bearerToken");
        console.log(authToken);
        console.log(groupIdToDelete);
        if (!authToken) {
          throw new Error("Token Not Found");
        }
        const response = await axios.delete(
          `${baseUri}api/Groups/${groupIdToDelete}`,
          // `https://localhost:7135/api/Groups/${groupId}`,
          // { id: groupIdToDelete },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        if (response.status === 200) {
          console.log(response); // Log the response from the server
          alert("Group deleted successfully"); // Notify the user
          setOpen(false);
          setGroupIdToDelete(null);
          fetchDataFromAPI();
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        // Handle errors, e.g., display an error message to the user
        alert("Error deleting group. Please try again.");
      }
    },[baseUri, groupIdToDelete, fetchDataFromAPI]);

  //////////////////////////////////////////////////

  return (
    <>
      <h1 className="p-2 font-bold text-2xl text-center pb-4">Add Group </h1>
      <form className="w-full" onSubmit={handleFormSubmit}>
        <div className="addgroup-main-div p-4">
          <div className="sub-div">
            <div className="mb-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Add Group Link
              </label>
              <input
                type="text"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
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
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
              {/* {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))} */}
              {categories
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort categories alphabetically by name
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {selectedCategoryError && (
              <div className="invalid-feedback">{selectedCategoryError}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
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
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {selectedCountryError && (
              <div className="invalid-feedback">{selectedCountryError}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
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
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2">
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
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tags
            </label>
            <input
              type="text"
              id="tagsInput"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Group Description
            </label>
            <input
              id="groupInformationInput"
              type="text"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
            {/* <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Search
            </button> */}
          </div>
        </div>
      </form>
      {/* <div className="mt-6">
        <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Add
        </button>
        <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Search
        </button>
      </div> */}

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
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                      >
                        Sr.no.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3  text-xs font-medium text-gray-500 uppercase"
                      >
                        Category Name
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
                        Group Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                      >
                        Group Link
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
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
                            {/* <td className="py-3 ps-4">
                              <div className="flex items-center h-5">
                                <input
                                  id={`hs-table-pagination-checkbox-${serialNumber}`}
                                  type="checkbox"
                                  className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                />
                                <label
                                  htmlFor={`hs-table-pagination-checkbox-${serialNumber}`}
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
                              {group.catName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              Whatsapp
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              {group.groupName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              <a href="#">{group.groupLink}</a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                              <button
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                // onClick={() => deleteGroup(group.groupId)}
                                // onClick={handleClickOpen}
                                onClick={() => handleClickOpen(group.groupId)}
                              >
                                Remove
                              </button>
                              <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle id="alert-dialog-title">
                                  {"Remove Group"}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    Do you really want to delete the group?
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={handleClose}>No</Button>
                                  <Button onClick={deleteGroup} autoFocus>
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
                <nav className="flex items-center space-x-1">
                  <button
                    type="button"
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 page-link"
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
                    length: numPages,
                  }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 page-link ${
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
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 page-link"
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1 <= numPages ? currentPage + 1 : numPages
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
    </>
  );
}

export default AddRemoveGroup;
