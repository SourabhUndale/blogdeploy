import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api"; // Use the custom Axios instance
import { useNavigate } from "react-router-dom"; // Removed useParams
import languagesData from "../../../lang.json";
import countryData from "../../../country-by-abbreviation.json";
import baselinks from "../../../baselinks.json";
import { isValidToken, redirectToLogin } from '../../utils/auth';

function UpdateGroup() {
  // const { groupId } = useParams(); // Removed useParams
  const navigate = useNavigate();

  const oBaseUri = JSON.parse(JSON.stringify(baselinks));
  const baseUri = oBaseUri.DefaultbaseUri;
  const langData = JSON.parse(JSON.stringify(languagesData));
  const countriesData = JSON.parse(JSON.stringify(countryData));

  const [groups, setGroups] = useState([]); // To store all groups for the dropdown
  const [selectedGroupId, setSelectedGroupId] = useState(""); // To store the selected group's ID
  const [group, setGroup] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [jwtToken, setJwtToken] = useState(""); // Removed jwtToken state
  const [categoryId, setCategoryId] = useState("");
  const [applicationId, setApplicationId] = useState("");

  // Fetch JWT token on component mount
  useEffect(() => {
    // const token = sessionStorage.getItem("bearerToken");
    // if (token) {
    //   setJwtToken(token);
    // }
  }, []);

  // Fetch all groups for the dropdown
  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const apiUrl = `${baseUri}odata/Groups?$expand=Application,Category`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Sort groups by groupId in descending order to show newly added groups first
        const sortedGroups = (data.value || []).sort((a, b) => b.groupId - a.groupId);
        setGroups(sortedGroups);
      } catch (err) {
        //console.error("Error fetching all groups:", err);
        setError(err);
      }
    };

    fetchAllGroups();
  }, [baseUri]);

  // Fetch details of the selected group
  useEffect(() => {
    const fetchSelectedGroupDetails = async () => {
      if (!selectedGroupId) {
        setGroup({});
        setSelectedLanguage("");
        setSelectedCountry("");
        setGroupDescription("");
        setTags("");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiUrl = `${baseUri}odata/Groups?$filter=groupId eq ${selectedGroupId}&$expand=Reports,Application,Category`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const fetchedGroup = data.value[0];
        //console.log(fetchedGroup);
        setGroup(fetchedGroup);
        setSelectedLanguage(fetchedGroup.Language);
        setSelectedCountry(fetchedGroup.country);
        setGroupDescription(fetchedGroup.groupDesc);
        setTags(fetchedGroup.tags);
        setCategoryId(fetchedGroup.catId || ""); // Safely extract categoryId
        setApplicationId(fetchedGroup.appId || ""); // Safely extract applicationId
      } catch (err) {
        setError(err);
        //console.error("Error fetching group data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedGroupDetails();
  }, [selectedGroupId, baseUri]);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isValidToken()) {
        redirectToLogin();
        return;
      }

      if (!selectedGroupId) {
        alert("Please select a group to update.");
        return;
      }

      try {
        const requestData = {
          Language: selectedLanguage,
          country: selectedCountry,
          groupDesc: groupDescription,
          tags: tags,
          GroupImage: group.GroupImage, // Include the existing image URL
          groupLink: group.groupLink, // Add groupLink to requestData
          groupRules: group.groupRules, // Add groupRules to requestData
        };

        const response = await api.put(
          `${baseUri}groups/${selectedGroupId}?catId=${categoryId}&appId=${applicationId}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("bearerToken")}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Group updated successfully!");
          navigate("/adminsettings/pingroup/normalgroupstable"); // Redirect after successful update
        }
      } catch (err) {
        //console.error("Error updating group:", err);
        alert("Error updating group. Please try again.");
      }
    },
    [baseUri, selectedGroupId, selectedLanguage, selectedCountry, groupDescription, tags, navigate, categoryId, applicationId, group.GroupImage, group.groupLink, group.groupRules]
  );

  if (loading && selectedGroupId) {
    return <div>Loading group details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="p-2 font-bold text-2xl text-center pb-4">Update Group</h1>
      <form className="w-full" onSubmit={handleFormSubmit}>
        <div className="addgroup-main-div p-4">
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Select Group to Update
            </label>
            <select
              name="group"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={loading} // Disable dropdown while loading
            >
              <option value="">{loading ? "Loading Groups..." : "Select a Group"}</option>
              {groups.map((g) => (
                <option key={g.groupId} value={g.groupId}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Group Name (Read-only)
                </label>
                <input
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-gray-100 border-0 border-b-2 border-gray-300"
                  value={group.groupName || ""}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Group Image (Read-only)
                </label>
                <input
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-gray-100 border-0 border-b-2 border-gray-300"
                  value={group.GroupImage || ""}
                  readOnly
                />
                {(group && group.GroupImage) && (
                  <div className="mt-4">
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Image Preview:</p>
                    <img
                      src={group.GroupImage}
                      alt="Group Image Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if fallback also fails
                        e.target.src = '/whatsapp_group_placeholder.png'; // Local placeholder
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Group Link (Read-only)
                </label>
                <input
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-gray-100 border-0 border-b-2 border-gray-300"
                  value={group.groupLink || ""}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2">
                  Select Language
                </label>
                <select
                  name="Language"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select</option>
                  {Object.entries(langData).map(([code, name]) => (
                    <option key={code} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2">
                  Select Country
                </label>
                <select
                  name="Country"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Select</option>
                  {countriesData.map(({ abbreviation, country }) => (
                    <option key={abbreviation} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Group Description
                </label>
                <textarea
                  id="groupDescriptionInput"
                  rows="4"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder=" "
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                  Tags
                </label>
                <input
                  type="text"
                  id="tagsInput"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder=" "
                />
              </div>

              <div className="mt-6">
                <button
                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  type="submit"
                >
                  Update Group
                </button>
              </div>
            
        </div>
      </form>
    </div>
  );
}

export default UpdateGroup;
