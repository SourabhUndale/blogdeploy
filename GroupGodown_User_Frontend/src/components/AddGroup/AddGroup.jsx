import React, { useState, useEffect } from "react";
import "./AddGroup.css";
import useDataFetch from "../../useDataFetch";
import axios from "axios";
import link from "../../../link.json";
import { json, redirect, useNavigate } from "react-router-dom";
import languagesData from "../../../lang.json";
import countriesData from "../../../country-by-abbreviation.json"
import { Helmet } from "react-helmet-async";
import metaImage from "../data/ggLogo.jpeg"

function AddGroup() {
  const obaseUri = JSON.parse(JSON.stringify(link));
  const langData = JSON.parse(JSON.stringify(languagesData));
  const countryData = JSON.parse(JSON.stringify(countriesData));
  const baseUri = obaseUri.DefaultbaseUri;
  const navigate = useNavigate(); // Initialize useHistory

  const { data: categories, loading: categoriesLoading } = useDataFetch(
    `${baseUri}api/Category`,
    []
  );

  const {
    data: applicationtype,
    loading: applicationTypesLoading,
  } = useDataFetch(`${baseUri}api/Application`, []);

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
  const [
    selectedApplicationTypeError,
    setSelectedApplicationTypeError,
  ] = useState("");

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

      // Make the API call using Axios
      const response = await axios.post(
        `${baseUri}api/Groups?catId=${selectedCategory}&appid=${selectedApplicationType}`,
        requestData
      );

      // You can add any additional logic here, e.g., show a success message, redirect, etc.

      if (response.status === 200) {
        const resData = JSON.parse(JSON.stringify(response.data));
        // setModalMessage(response.data);
        // setShowModal(true);
        if (resData.message != null) {
          // Group Already Exists
          alert(resData.message);
          navigate("/groupinvite/" + resData.groupId + "/" + selectedCategory);
        }

        if (resData.message === null) {
          alert("New group added");
          window.location.href = "/";
        }
      }

      if (response.data === "Group not valid") {
        // setModalMessage(`Error: ${response.status}`);
        // setShowModal(true);
        alert("Group link not valid");
      }
    } catch (error) {
      // Handle error response
      console.error("API call failed:", error);
      // You can also handle errors by showing an error message to the user
    }
  };

  return (
    <>
      <Helmet>
        <title>Add WhatsApp Group Links | Promote & Increase Members</title>

        <meta property="og:title" content="Add WhatsApp Group Links | Promote & Increase Members"/>
        <meta property="og:site_name" content="Group Godown"/>
        <meta property="og:url" content="https://www.groupgodown.com/"/>
        <meta property="og:description" content="Join the best WhatsApp groups to connect with like-minded people! Discover how to promote your WhatsApp group and increase group members easily. Explore top groups today!" />
        <meta property="og:type" content="website"/>
        <meta property="og:image" content={metaImage}></meta>
        <meta property="og:locale" content="en_US" />
        <meta name="description" content="Submit WhatsApp group invites for free promo! Boost group link visibility, promote your group, and increase members effortlessly." />
        <meta name="keywords" content="Add WhatsApp Group Links, Submit WhatsApp Group Invites, Promote WhatsApp Group, Free WhatsApp Group Promo tool, WhatsApp Group link visibility, Increase Group Members" />
        <link rel="canonical" href="https://www.groupgodown.com/addgroup/" />
        <meta
          name="google-site-verification"
          content="zqo3k0SHL5mAOnoSgEDnirh5Pf53vEmkczx2967yUEM"
        />
      </Helmet>

      <form onSubmit={handleFormSubmit}>
        <div className="addgroup-main-div p-4">
          <div className="sub-div">
            <div className="mb-3">
              <label for="exampleFormControlInput1" className="form-label">
                Add Your Group
              </label>
              <input
                type="text"
                id="groupLinkInput"
                className={`form-control ${groupLinkError ? "is-invalid" : ""}`}
                value={groupLink}
                onChange={(e) => {
                  setGroupLink(e.target.value);
                  setGroupLinkError("");
                }}
              />
              {groupLinkError && (
                <div className="invalid-feedback">{groupLinkError}</div>
              )}
              <div id="passwordHelpBlock" className="form-text">
                Ex. https://chat.app.com/HJDK98132asSlndFIZP
              </div>
            </div>
            <div>
              <label className="form-label">Select Category</label>
              <select
                name="Category"
                className={`form-select ${
                  selectedCategoryError ? "is-invalid" : ""
                }`}
                value={selectedCategory}
                onChange={(e) => {
                  const selectedcat = e.target.value;
                  const newCat =
                    selectedcat === "Any Category" ? "" : selectedcat;
                  setSelectedCategory(newCat);
                  setSelectedCategoryError("");
                }}
              >
                <option>Any Category</option>
                {/* {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))} */}
                {categories
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort categories alphabetically
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
            <div>
              <label className="form-label">Select Country</label>
              <select
                name="Country"
                className={`form-select ${
                  selectedCountryError ? "is-invalid" : ""
                }`}
                value={selectedCountry}
                onChange={(e) => {
                  const selectedCon = e.target.value;
                  const newCon =
                    selectedCon === "Any Country" ? "" : selectedCon;
                  setSelectedCountry(newCon);
                }}
              >
                <option>Any Country</option>
                {/* {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))} */}

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
            <div>
              <label className="form-label">Select Language</label>
              <select
                name="Language"
                className={`form-select ${
                  selectedLanguageError ? "is-invalid" : ""
                }`}
                value={selectedLanguage}
                onChange={(e) => {
                  const selectedLang = e.target.value;
                  const newLang =
                    selectedLang === "Any Language" ? "" : selectedLang;
                  setSelectedLanguage(newLang);
                }}
              >
                <option>Any Language</option>
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
            <div>
              <label className="form-label">Select Application Type</label>
              <select
                name="Type"
                className={`form-select ${
                  selectedApplicationTypeError ? "is-invalid" : ""
                }`}
                value={selectedApplicationType}
                onChange={(e) => {
                  const selectedApptype = e.target.value;
                  const newApptype =
                    selectedApptype === "Application" ? "" : selectedApptype;
                  setSelectedApplicationType(newApptype);
                }}
              >
                <option>Application</option>
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
              <input
                type="text"
                id="tagsInput"
                className="form-control"
                placeholder="Enter Tags by Comma(,) Separated (Optional)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div id="passwordHelpBlock" className="form-text">
                Ex:- Business, Study, Comedy, Movie (Up to 100 words)
              </div>
            </div>
            <div className="mb-3">
              <textarea
                id="groupInformationInput"
                className="form-control"
                placeholder="Enter Group Information and Rules (Optional)"
                rows="3"
                value={groupInformation}
                onChange={(e) => setGroupInformation(e.target.value)}
              ></textarea>
              <div id="passwordHelpBlock" className="form-text">
                Ex:- Funny, Jokes, City, State(Up to 500 words)
              </div>
              <p>Note:- Your Group is Visible to Public Worldwide (Everyone)</p>
              <button type="submit" className="btn btn-success submit-btn">
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* {showModal && <CustomModel message={modalMessage} onClose={handleModalClose}/>} */}
      </form>

      <div className="px-5 bg-light py-4 m-4">
        <h1>
          Join and Promote the Best WhatsApp Groups Worldwide – Easy Links and
          Free Promotion!
        </h1>
        <p>
          You can find all the WhatsApp Group Links you need here. You are in
          the right spot! We make it simple to Promote WhatsApp Group and Share
          <span className="text-success"> WhatsApp Group link</span>. You can
          also get WhatsApp Group invite to connect with people around the
          world.
        </p>
        <h3>Why choose Group Godown?</h3>
        <p>
          Group Godown makes it easy for you to{" "}
          <a href="https://www.groupgodown.com/"><span className="text-success"> Join WhatsApp Groups</span></a>, and
          Increase group members. Our site makes it easy to find and share
          groups that are active and interesting.
        </p>

        <h4>Key Features:</h4>
        <ul>
          <li>
            <span className="fw-bold">Free WhatsApp Group Promo :</span> Promote
            Your <span className="text-success"> WhatsApp Group Link</span> for
            Free! Attract new members to your group and make it visible.
          </li>
          <li>
            <span className="fw-bold">Create WhatsApp Group Link :</span> Learn
            how to create your WhatsApp Group Link, so that others can easily
            join your group.
          </li>
          <li>
            <span className="fw-bold">Active Group listings :</span> We update
            our group links to ensure that all WhatsApp Group Link work and are
            useful. Find groups that are relevant to your interests, join them,
            and then share the links.
          </li>
          <li>
            <span className="fw-bold">Find groups by Interest :</span> We have
            something to offer everyone, whether you are looking for a WhatsApp
            Group Links Girl India or an{" "}
            <span className="text-success"> India WhatsApp group link</span>.
            Our site allows you to find groups based on your interests, from
            
            <a href="https://www.groupgodown.com/">
              <span className="text-success">
                {" "}
                Indian WhatsApp Group Link
              </span>{" "}
            </a>
            
            through{" "}
            <a href="https://www.groupgodown.com/">
              {" "}
              Share market WhatsApp Group Link
            </a>
            . Join a{" "}
            <a href="https://www.groupgodown.com/"><span className="text-success">WhatsApp Earning Group</span></a>
            or{" "}
            <span className="text-success"> WP Group link</span> that suits your
            interests.
          </li>
        </ul>
        <h4>Popular Categories:</h4>
        <ul>
          <li>
            <span className="fw-bold text-success">
              Girls WhatsApp Group link :
            </span>{" "}
            Join group for girls to chat, connect and share.
          </li>
          <li>
            <a href="https://www.groupgodown.com/">
              <span className="fw-bold text-success">
                Indian WhatsApp Group Link :
              </span>{" "}
            </a>
            
            Search for groups on Indian culture and news using the Indian{" "}
            <span className="text-success">WhatsApp Group link.</span>
          </li>
          <li>
            <span className="fw-bold text-success">
              Share market WhatsApp group link :
            </span>{" "}
            Ideal for discussing the stock exchange and sharing tips.
          </li>
          <li>
            <span className="fw-bold text-success">
              YouTube Subscribe WhatsApp Group :
            </span>{" "}
            Increase your YouTube channel's subscribers by joining WhatsApp
            groups that focus on mutual subscriptions.
          </li>
        </ul>
        <h4>How to Join and Promote WhatsApp Groups:</h4>
        <ul>
          <li>
            Use Search Tool: Use this search tool to find groups using keywords
            such as "
            <span className="text-success">
              Share Market WhatsApp Group Link
            </span>
            " ,<a href="https://www.groupgodown.com/">Girls WhatsApp Group Link</a>
            .
          </li>
          <li>
            Click To Join: Once you have found a group that you are interested
            in, click on the WhatsApp Groups button to join.
          </li>
          <li>
            Share your group: Use this platform to Submit WhatsApp Group
            information and Promote WhatsApp Group free of charge, so that you
            can Increase group members.
          </li>
        </ul>
        <h3>Group Godown keeps you updated with the latest news:</h3>
        <p>
          Our group listings are always updated to ensure you have the most
          active and best groups. Visit us often to see the latest WhatsApp
          Group Link and WhatsApp Group Invite. Don't forgot to share{" "}
          <span className="text-success"> WhatsApp Group Link</span>.
        </p>
        <p className="fst-italic fw-bold">
          Group Godown is your one-stop shop for all the best WhatsApp groups in
          the world.
        </p>
      </div>
    </>
  );
}

export default AddGroup;