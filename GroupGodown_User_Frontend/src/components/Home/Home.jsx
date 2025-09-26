import React, { useState, useEffect } from "react";
import "./Home.css";
import { useLocation, useParams } from "react-router-dom"; // Now added
import { Link, json } from "react-router-dom";
import useDataFetch from "../../useDataFetch";
import { useNavigate } from "react-router-dom";
import link from "../../../link.json";
import languagesData from "../../../lang.json";
import { Helmet } from "react-helmet-async";
import Loader from "../Loader/Loader"; // Import the Loader component
import replacelogo from "/ggLogo.jpeg"
import metaImage from "../data/ggLogo.jpeg"
import countriesData from "../../../country-by-abbreviation.json"

export default function Home() {
  // All hooks at the top
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const { categoryName, countryName, languageName } = useParams();
  const encodedFilters = searchParams.get('filters');

  const obaseUri = JSON.parse(JSON.stringify(link));
  const baseUri = obaseUri.DefaultbaseUri;
  // const countryUri = obaseUri.countryUri;
  const langData = JSON.parse(JSON.stringify(languagesData));
  const countryData = JSON.parse(JSON.stringify(countriesData));
  const defualtgroupImg = obaseUri.defaultgroupImg;


  const { data: categories, loading: categoriesLoading } = useDataFetch(
    `${baseUri}api/Category`,
    []
  );

  const { data: applicationtype, loading: applicationTypesLoading } =
    useDataFetch(`${baseUri}api/Application`, []);

  const { data: pinnedGroupResponse, loading: pinnedLoading } = useDataFetch(
    `${baseUri}odata/Groups?$expand=category`,
    []
  );

  const currentUrl = window.location.href;

  const shareOnWhatsApp = (groupId, groupCat) => {
    const message = encodeURIComponent(
      `Join our WhatsApp group: ${currentUrl}groupinvite?id=${groupId}&catId=${groupCat}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareOnInstagram = (gruopId, groupCat) => {
    // Construct the Instagram message with the WhatsApp group link
    const message = encodeURIComponent(
      `Join our WhatsApp group: ${(gruopId, groupCat)}`
    );

    // Open Instagram website in a new window with the pre-filled message
    window.open(
      `https://www.instagram.com/direct/new/?text=${message}`,
      "_blank"
    );
  };

  const shareOnTelegram = (gruopId, groupCat) => {
    // Replace [your Telegram group link here] with your actual Telegram group link
    const message = encodeURIComponent(
      `Join our Telegram group: ${(gruopId, groupCat)}`
    );
    window.open(`https://t.me/share/url?url=${message}`, "_blank");
  };

  const pinnedGroup = pinnedGroupResponse ? pinnedGroupResponse.value : [];

  const pinnedGroups = pinnedGroup
    ? pinnedGroup.filter((group) => group.Pin === true)
    : [];


  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedApplicationType, setSelectedApplicationType] = useState(searchParams.get('appid') || "");

  const [groups, setGroups] = useState([]);
  // const [search, setSearch] = useState("");

  const [error, setError] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [jumpToPage, setJumpToPage] = useState("");

  const handleGroupClick = (groupId, catId) => {
    //alert('Join Clicked');
    window.open(`/groupinvite?id=${groupId}&catId=${catId}`, "_blank");
    //navigate(`/groupinvite/${groupId}/${catId}`);
  };

  const adsenseClient = link.adsenseClient;
  const adsenseSlot = link.adsenseSlot;

  useEffect(() => {
    fetchDataFromAPI();
    if (searchQuery !== null || categoryName || countryName || languageName || location.search) {
      fetchDataFromAPI();
    }
  }, [searchQuery, categoryName, countryName, languageName, location.search]);

  useEffect(() => {
    if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const fetchDataFromAPI = async () => {
    
    setLoading(true); // Start loading
  
    const transformData = (data) => {
      return data.map((group) => ({
        groupId: group.groupId,
        groupName: group.groupName,
        groupLink: group.groupLink,
        groupImage: group.GroupImage,
        catName: group.catName || "Default Category", // Use default value if catName is not available
        catId: group.catId,
        country: group.country,
        language: group.Language, // Ensure that "Language" matches the case of your fetched data
        groupDesc: group.groupDesc,
        groupRules: group.groupRules,
        tags: group.tags,
        message: group.message || null, // Use default value if message is not available
      }));
    };
  
    try {
      const currentSearchParams = new URLSearchParams(location.search);
      let paramCatId = currentSearchParams.get('catId');
      let paramCountry = currentSearchParams.get('country');
      let paramLang = currentSearchParams.get('lang');
      let paramAppId = currentSearchParams.get('appid');
      
      if (encodedFilters) {
        try {
          const decoded = atob(encodedFilters);
          const filterObject = JSON.parse(decoded);
          paramCatId = filterObject.catId || paramCatId;
          paramCountry = filterObject.country || paramCountry;
          paramLang = filterObject.lang || paramLang;
          paramAppId = filterObject.appid || paramAppId;
        } catch (e) {
          console.error("Error decoding or parsing filters:", e);
        }
      }

      if (searchQuery) {
        // Prepend the cors-anywhere proxy URL
        const apiUrl = `https://search.api.techkmr.com/search/${encodeURIComponent(searchQuery)}`;
      
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setGroups(transformData(data.sort((a, b) => parseInt(b.groupId) - parseInt(a.groupId)))); // Sort newest to oldest by groupId
        
        setError(null);
        setCurrentPage(1); // Reset to first page after search
      } else if (categoryName || countryName || languageName || paramCatId || paramCountry || paramLang || paramAppId) {
        // Determine the base URL
        let apiUrl;
        const queryParts = [];

        if (categoryName || countryName || languageName) {
          apiUrl = `${baseUri}groups`;
          if (categoryName) {
            const formattedCategoryName = categoryName.replace(/\//g, '-');
            apiUrl += `/category/${formattedCategoryName}`;
          }
          else if (countryName) { apiUrl += `/country/${countryName}`; }
          else if (languageName) { apiUrl += `/language/${languageName}`; }
        } else {
          apiUrl = `${baseUri}groups/find`;
        }

        if (paramCatId) { queryParts.push(`catId=${paramCatId}`); }
        if (paramCountry) { queryParts.push(`country=${paramCountry}`); }
        if (paramLang) { queryParts.push(`lang=${paramLang}`); }
        if (paramAppId) { queryParts.push(`appid=${paramAppId}`); }

        if (queryParts.length > 0) {
          apiUrl += `?${queryParts.join('&')}`;
        }
   
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGroups(data.sort((a, b) => parseInt(b.groupId) - parseInt(a.groupId))); // Sort newest to oldest by groupId
        
        setError(null);
        setCurrentPage(1);

      } else {
        const apiUrl = `${baseUri}groups/find`;
      
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setGroups(data.sort((a, b) => parseInt(b.groupId) - parseInt(a.groupId))); // Sort newest to oldest by groupId
        
        setError(null);
        setCurrentPage(1); // Reset to first page after fetching all groups
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false); // End loading
    }
  };
  
  const findgroupClick = async () => {
    setLoading(true);
    // navigate("/groups/find"); // Removed this navigation
    try {
      let categoryIdForApi = selectedCategory; // Assume selectedCategory is catId by default
      
      if (selectedCategory && selectedCategory !== "") {
        const selectedCategoryObject = categories.find(cat => {
          
          return cat.catId === parseInt(selectedCategory); // Explicitly convert to integer
        });
        
        if (selectedCategoryObject) {
          
          categoryIdForApi = selectedCategoryObject.catId;
        } else {
          console.warn(`Category with id ${selectedCategory} not found.`);
        }
      }
      const filterObject = {
        catId: categoryIdForApi,
        country: selectedCountry,
        lang: selectedLanguage,
        appid: selectedApplicationType,
      };
      const encoded = btoa(JSON.stringify(filterObject));

      navigate(`/groups/find?filters=${encoded}`);
      // No need to fetch directly here, useEffect will handle it
      setError(null);
      setCurrentPage(1); // Reset to first page after finding groups
    } catch (error) {
      setError(error);
      console.error("Error performing find group operation:", error); // Updated log message
    } finally {
      setLoading(false);
    }
  };


  const handleGoToPage = () => {
    const page = parseInt(jumpToPage);
    const totalPages = Math.ceil(groups.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpToPage(""); // Clear the input after jumping
    } else {
      alert("Hmm... looks like that page isn't available.");
    }
  };

  const linkClick = async (Cat, Con, Lan, Apptype) => {
    setLoading(true);
    try {
      // Construct API URL and navigation path
      let apiUrl = `${baseUri}groups`;
      let navigatePath = "/groups";
      const queryParams = [];

      if (Cat && Cat !== "") {
        const formattedCat = Cat.replace(/\//g, '-');
        apiUrl += `/category/${formattedCat}`;
        navigatePath += `/category/${formattedCat}`;
      }
      if (Con && Con !== "") {
        apiUrl += `/country/${Con}`;
        navigatePath += `/country/${Con}`;
      }
      if (Lan && Lan !== "") {
        apiUrl += `/language/${Lan}`;
        navigatePath += `/language/${Lan}`;
      }
      if (Apptype && Apptype !== "") {
        queryParams.push(`appid=${Apptype}`);
      }

      if (queryParams.length > 0) {
        apiUrl += `?${queryParams.join('&')}`;
        navigatePath += `?${queryParams.join('&')}`;
      }

      // Navigate first, then fetch data
      navigate(navigatePath);
      
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGroups(data);
      setError(null);
      setCurrentPage(1); // Reset to first page after link click
    } catch (error) {
      setError(error);
      console.error("Error fetching API data:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (description) => {
    return description.length > 25
      ? description.substring(0, 25) + "..."
      : description;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loader />; // Render the Loader component while loading
  }

  return (
    <>
      <Helmet>
        <title>Join Unlimited WhatsApp groups | WA group links | groupgodown</title>
         {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Join Unlimited WhatsApp groups | WA group links | groupgodown"/>
        <meta property="og:site_name" content="Group Godown"/>
        <meta property="og:url" content="https://www.groupgodown.com/"/>
        <meta property="og:description" content="Join the best WhatsApp groups to connect with like-minded people! Discover how to promote your WhatsApp group and increase group members easily. Explore top groups today!" />
        <meta property="og:type" content="website"/>
        <meta property="og:image" content={`{https://www.groupgodown.com/}${metaImage}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Join Unlimited WhatsApp groups on Group Godown" />
        <meta property="og:locale" content="en_US" />

        {/* SEO Meta Tags */}
        <meta name="description" content="Explore a wide range of WhatsApp group links on groupgodown.com, including Girls WhatsApp groups, Indian groups, share market groups, and more. Join and connect with like-minded individuals across the World." />
	      <meta name="keywords" content="WhatsApp group link, Girls WhatsApp group link, WhatsApp group link girl India, India WhatsApp group link, Indian WhatsApp group link, Join WhatsApp group, Share market WhatsApp group link, WP group link, WhatsApp earning group, YouTube subscribe WhatsApp group" />
        
        {/* Verification + Canonical */}
        <meta name="google-site-verification" content="zqo3k0SHL5mAOnoSgEDnirh5Pf53vEmkczx2967yUEM" />
        <link rel="canonical" href="https://www.groupgodown.com/" />


        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join Unlimited WhatsApp groups | WA group links | groupgodown" />
        <meta name="twitter:description" content="Join the best WhatsApp groups to connect with like-minded people! Discover how to promote your WhatsApp group and increase group members easily. Explore top groups today!" />
        <meta name="twitter:image" content={`{https://www.groupgodown.com/}${metaImage}`} />
        <meta name="twitter:image:alt" content="Join Unlimited WhatsApp groups on Group Godown" />
        
      </Helmet>

      <div className="home-main-div">
        <div className="add-btn-div">
          <Link className="btn btn-success" to="/addgroup">
            + Add Groups
          </Link>
        </div>
        <div className="select-div">
          <div>
            <label>Any Category</label>
            <select
              name="Category"
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                const selectedcat = e.target.value;
                const newCat =
                  selectedcat === "Category" ? "" : selectedcat;
                setSelectedCategory(newCat);
              }}
            >
              <option>Category</option>
              
              {categories
                .sort((a, b) => (a.name || '').localeCompare(b.name || '')) // Sort categories alphabetically
                .map((category) => (
                  <option key={category.catId} value={category.catId}>
                    {category.catName}
                  </option>
                ))}
            </select>
          </div>
        
          <div>
            <label>Any Country</label>
            <select
              name="Country"
              className="form-select"
              value={selectedCountry}
              onChange={(e) => {
                const selectedCon = e.target.value;
                const newCon = selectedCon === "Country" ? "" : selectedCon;
                setSelectedCountry(newCon);
              }}
            >
              <option>Country</option>
              {countryData.map(({ abbreviation, country }) => (
                <option key={abbreviation} value={country}>
                  {country}
                </option>
              ))}
            </select> 
          </div>

          <div>
            <label>Any Language</label>
            <select
              name="Language"
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => {
                const selectedLang = e.target.value;
                const newLang =
                  selectedLang === "Language" ? "" : selectedLang;
                setSelectedLanguage(newLang);
              }}
            >
              <option>Language</option>
              {Object.entries(langData).map(([code, name]) => (
                <option key={code} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Application Type</label>
            <select
              name="Type"
              className="form-select"
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
          </div>
          <button className="btn btn-primary" onClick={findgroupClick}>
            Find Group
          </button>
        </div>

        {/* <h4 className="mb-0">Pinned Group</h4> */}

        {/* ///////////////////////////////////////////////////////////// */}

        {/* pinned group div */}
        <div
          id="carouselExampleControls"
          className="carousel slide card_w"
          data-bs-ride="carousel"
        >
          <div className="d-flex mb-2 mt-2 justify-content-between">
            <h4>Most Famous Groups</h4>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm p-0"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="btn btn-primary btn-sm p-0"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <div className="carousel-inner">
            {pinnedGroups.map((pinData, index) => (
              <div className={`carousel-item ${index === 0 ? "active" : ""} `}>
                <div className="card bg-primary bg-gradient bg-opacity-10 mb-4">
                  <div className="card-body">
                    <img
                      src={pinData.GroupImage}
                      onError={(e) => {
                        e.target.src = replacelogo; // Replace with your default image URL
                      }}
                      width={"6%"}
                      alt="Group Image"
                      className="rounded-circle"
                    />
                    <div className="heading-div">
                      <h5>
                        <Link
                          to={`/groupinvite?id=${pinData.groupId}&catId=${pinData.Category.catId}`}
                          className="text-decoration-none text-black fs-5 fw-bold mb-0 underline"
                          
                          onClick={() => {
                            //event.preventDefault(); // Removed to allow default Link behavior
                            handleGroupClick(
                              pinData.groupId,
                              pinData.Category.catId
                            ); // Keep for any other side effects if needed
                          }}
                        >
                          {pinData.groupName}
                        </Link>
                      </h5>
                      <div>
                        <a
                          href={`/groups/category/${pinData.Category.catName}`}
                          className="text-decoration-none text-secondary underline"
                          onClick={(e) => {
                            e.preventDefault();
                            linkClick(pinData.Category.catName, "", "", "");
                          }}
                        >
                          <i class="bi bi-list"></i> {pinData.Category.catName}
                        </a>
                        <a
                          href={`/groups/country/${pinData.country}`}
                          className="text-decoration-none text-secondary underline"
                          onClick={(e) => {
                            e.preventDefault();
                            linkClick("", pinData.country, "", "");
                          }}
                        >
                          <i class="bi bi-globe"></i> {pinData.country}
                        </a>
                        <a
                          href={`/groups/language/${pinData.Language}`}
                          className="text-decoration-none text-secondary underline"
                          onClick={(e) => {
                            e.preventDefault();
                            linkClick("", "", pinData.Language, "");
                          }}
                        >
                          <i class="bi bi-translate"></i> {pinData.Language}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-right ps-4 pe-4">
                      <Link
                        to={`/groupinvite?id=${pinData.groupId}&catId=${pinData.Category.catId}`}
                        className="text-black text-decoration-none underline"
                        onClick={() => {
                          //event.preventDefault(); // Removed to allow default Link behavior
                          handleGroupClick(pinData.groupId, pinData.Category.catId);
                        }}
                      >
                        {" "}
                        {pinData.groupDesc}
                      </Link>
                    </p>
                    <ul className="list-group list-group-horizontal ">
                      {/* Add your list items here */}
                      <li className="list-group-item  rounded-pill ms-1 text-primary fw-bold ">
                        {pinData.tags}
                      </li>
                    </ul>
                    <hr />
                  </div>
                  <div className="ps-4 pe-4 d-flex justify-content-between">
                    <Link
                      className="text-decoration-none text-black fw-bold fs-5 underline"
                      onClick={() => {
                        event.preventDefault();
                        handleGroupClick(
                          pinData.groupId,
                          pinData.Category.catId
                        );
                      }}
                    >
                      Join Group
                    </Link>
                    <p className="social-icons-p d-flex align-items-center fs-5">
                      Share on :{" "}
                      <div className="social-icons-div ">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Join our WhatsApp group: ${window.location.href}groupinvite?id=${pinData.groupId}&catId=${pinData.Category.catId}`)}`}
                          onClick={() => {
                            shareOnWhatsApp(
                              pinData.groupId,
                              pinData.Category.catId
                            );
                            // shareOnWhatsApp(hello,helloff);
                          }}
                        >
                          <i className="bi bi-whatsapp text-success"></i>
                        </a>
                        <a
                          href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(`Join our WhatsApp group: ${window.location.href}groupinvite?id=${pinData.groupId}&catId=${pinData.Category.catId}`)}`}
                          onClick={() => {
                            shareOnInstagram(
                              pinData.groupId,
                              pinData.Category.catId
                            );
                          }}
                          //  onClick={shareOnInstagram(pinData.groupLink)}
                        >
                          <i
                            className="bi bi-instagram"
                            style={{ color: "rgb(214 0 255)" }}
                          ></i>
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.href}groupinvite?id=${pinData.groupId}&catId=${pinData.Category.catId}`)}`}
                          onClick={() => {
                            shareOnTelegram(
                              pinData.groupId,
                              pinData.Category.catId
                            );
                          }}
                        >
                          <i className="bi bi-telegram"></i>
                        </a>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ///////////////////////////////////////////////////////////// */}

        {/* <div> */}
        {groups
          //  .filter((group) => {
          //   return search.toLowerCase() === ''
          //    ? group
          //    : group.tags.toLowerCase().includes(search);
          // })
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

          .map((group, index) => (
            <React.Fragment key={group.groupId}>
              <div className="card card_w">
                <div className="card-body">
                  <img
                    //src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-group-icon-png-image_5097424.jpg"
                    src={group.groupImage}
                    onError={(e) => {
                      e.target.src = replacelogo; // Replace with your default image URL
                    }}
                    width={"6%"}
                    className="rounded-circle"
                  />
                  <div className="heading-div">
                    <h5>
                      <a
                        href={`/groupinvite?id=${group.groupId}&catId=${group.category.catId}`}
                        className="text-black text-decoration-none fw-bold underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleGroupClick(group.groupId, group.category.catId);
                        }}
                      >
                        {group.groupName}
                      </a>
                    </h5>
                    <div>
                      <a
                        href={`/groups/category/${group.category.catName}`}
                        className="text-decoration-none text-secondary underline"
                        onClick={(e) => {
                          e.preventDefault();
                          linkClick(group.category.catName, "", "", "");
                        }}
                      >
                        <i class="bi bi-list"></i> {group.category.catName}
                      </a>
                      <a
                        href={`/groups/country/${group.country}`}
                        className="text-decoration-none text-secondary underline"
                        onClick={(e) => {
                          e.preventDefault();
                          linkClick("", group.country, "", "");
                        }}
                      >
                        <i class="bi bi-globe"></i> {group.country}
                      </a>
                      <a
                        href={`/groups/language/${group.language}`}
                        className="text-decoration-none text-secondary underline"
                        onClick={(e) => {
                          e.preventDefault();
                          linkClick("", "", group.language, "");
                        }}
                      >
                        <i class="bi bi-translate"></i> {group.language}
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-right ps-4 pe-4">
                    <a
                      href={`/groupinvite?id=${group.groupId}&catId=${group.category.catId}`}
                      className="text-decoration-none text-black underline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleGroupClick(group.groupId, group.category.catId);
                      }}
                    >
                      {truncateDescription(group.groupDesc)}
                    </a>
                    {group.groupDesc.length > 25 && (
                      <Link
                        to={`/groupinvite?id=${group.groupId}&catId=${group.category.catId}`}
                        className="text-decoration-none underline"
                        onClick={() => {
                          //event.preventDefault(); // Removed to allow default Link behavior
                          handleGroupClick(group.groupId, group.category.catId);
                        }}
                      >
                        Read more
                      </Link>
                    )}
                  </p>

                  {group.tags && (
                    <ul
                      className="list-group list-group-horizontal"
                      style={{ overflow: "auto" }}
                    >
                      {/* Splitting the group.tags string and mapping over the resulting array */}
                      {group.tags.split(",").map((tag, index) => (
                        // Using index as key, assuming tags are unique or have a unique identifier
                        <li
                          key={index}
                          className="list-group-item py-1 px-2 rounded-pill ms-1 text-primary fw-bold"
                          // style={{overflow: 'auto'}}
                        >
                          {tag.trim()}
                        </li>
                      ))}
                    </ul>
                  )}

                  <hr />
                </div>
                <div className="ps-4 pe-4 d-flex justify-content-between">
                  {/* <a href="/groupinvite">Join Group </a> */}

                  <a
                    href={`/joingroup/${group.groupLink.substring(group.groupLink.lastIndexOf("/") + 1)}?groupName=${encodeURIComponent(group.groupName)}`}
                    className="text-decoration-none text-black fw-bold fs-5 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGroupClick(group.groupId, group.category.catId);
                    }}
                  >
                    Join Group
                  </a>

                  <p className="social-icons-p d-flex align-items-center fs-5">
                    Share on :{" "}
                    <div className="social-icons-div ">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Join our WhatsApp group: ${window.location.href}groupinvite?id=${group.groupId}&catId=${group.catId}`)}`}
                        onClick={() => {
                          shareOnWhatsApp(group.groupId, group.catId);
                        }}
                      >
                        <i className="bi bi-whatsapp text-success"></i>
                      </a>
                      <a
                        href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(`Join our WhatsApp group: ${window.location.href}groupinvite?id=${group.groupId}&catId=${group.catId}`)}`}
                        onClick={() => {
                          shareOnInstagram(group.groupId, group.catId);
                        }}
                      >
                        <i
                          className="bi bi-instagram"
                          style={{ color: "rgb(214 0 255)" }}
                        ></i>
                      </a>
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.href}groupinvite?id=${group.groupId}&catId=${group.catId}`)}`}
                        onClick={() => {
                          shareOnTelegram(group.groupId, group.catId);
                        }}
                      >
                        <i className="bi bi-telegram"></i>
                      </a>
                    </div>
                  </p>
                </div>
              </div>
              
              {/* Ad after every 2 groups */}
              {(index + 1) % 2 === 0 && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
                  <ins className="adsbygoogle"
                    style={{ display: 'block', width: '100%', maxWidth: 728, minHeight: 90 }}
                    data-ad-client={adsenseClient}
                    data-ad-slot={adsenseSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                </div>
              )}
            </React.Fragment>
          ))}
        {/* </div> */}

        <div className="card card_w mt-4 bg-transparent pagination-card">
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
            <nav aria-label="...0">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({
                  length: Math.min(Math.ceil(groups.length / itemsPerPage), 4), // Display maximum of 4 page numbers
                }).map((_, index) => {
                  let pageNumber;
                  const totalPages = Math.ceil(groups.length / itemsPerPage);
                  if (currentPage <= 2) {
                    pageNumber = index + 1; // Display the first four page numbers
                  } else if (
                    currentPage >= totalPages - 1 && totalPages > 3
                  ) {
                    pageNumber = 
                      totalPages - 3 + index; // Display the last four page numbers
                  } else {
                    pageNumber = currentPage - 1 + index; // Display page numbers around the current page
                  }
                  pageNumber = Math.max(1, pageNumber); // Ensure pageNumber is at least 1
                  return (
                    <li
                      key={index}
                      className={`page-item ${
                        pageNumber === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
                <li
                  className={`page-item ${
                    currentPage === Math.ceil(groups.length / itemsPerPage) ||
                    groups.length === 0
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
            {/* // Final */}

            {/* Newest Page navbar */}
            <div className="d-flex align-items-center">
              <input
                type="number"
                className="form-control w-80 me-2 align-middle"
                placeholder="Jump to page"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleGoToPage}>
                Go
              </button>
            </div>
          </div>
        </div>

      </div>
     

<div className="home-main-div">
  <div className="card_w">
    <div className="card-body">
      <div className="homepage-container">
        <header>
          <h1>Join the Best WhatsApp Groups in India, USA, and Worldwide | GroupGodown.com</h1>
        </header>
        <section className="intro-section">
          <p>
            Group Godown is the perfect place to find out active WhatsApp groups from around the world.
            Whether you're interested in general WhatsApp groups, Girls WhatsApp groups, or Indian groups, we've got you covered.
            Explore and join groups that match your interests, such as Share market WhatsApp group discussions, earning opportunities, 
            YouTube subscribe WhatsApp group, and more.
          </p>
        </section>
        <section className="why-choose-us">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>
              <strong>Active Groups Only:</strong> We ensure that every group link listed is currently active. Deleted groups or revoked links are quickly removed.
              <br />
              (हम सुनिश्चित करते हैं कि सूचीबद्ध प्रत्येक समूह लिंक वर्तमान में सक्रिय है। हटाए गए समूह या निरस्त लिंक को तुरंत हटा दिया जाता है।)
            </li>
            <li>
              <strong>Easy Reporting:</strong> If you find any issues with the groups, such as deleted or revoked links, please report them to us.
              We will act quickly to resolve any problems and update the listings.
              <br />
              (यदि आपको समूहों में कोई समस्या मिलती है, जैसे कि हटाए गए या निरस्त किए गए लिंक, तो कृपया हमें इसकी रिपोर्ट करें। 
              हम किसी भी समस्या को हल करने और लिस्टिंग को अपडेट करने के लिए तुरंत कार्रवाई करेंगे।)
            </li>
          </ul>
        </section>
        <section className="how-it-works">
          <h2>How It Works?</h2>
          <ol>
            <li>
              <strong>Search & Discover:</strong> Use our search function to find groups based on your interests or needs. Whether you're looking for market discussions, 
              social groups, or specialized communities, we make it easy to discover what you're looking for.
            </li>
            <li>
              <strong>Join & Engage:</strong> Once you find a group that suits your needs, simply click the link to join. Start engaging with like-minded individuals 
              and make the most of your WhatsApp experience.
            </li>
            <li>
              <strong>Stay Updated:</strong> Our team constantly monitors and updates the group listings to ensure you have access to the most active and relevant groups. 
              Check back regularly for new opportunities and groups.
            </li>
          </ol>
        </section>

        {/* New section added below */}
        <section className="enhance-promotion">
          <h2>Enhance Your WhatsApp Groups Free Promotion and Easy Link Sharing</h2>
          <p>
            Our platform allows you to <a href="/addgroup" >Add WhatsApp Group Links</a>, 
            <a href="/addgroup">Submit WhatsApp Group</a> Invites, and easily <a href="/addgroup">Promote WhatsApp Group</a> Activities. 
            Use our Free WhatsApp Group Promo tools to increase your WhatsApp Group link visibility. 
            Create WhatsApp Group Links, <span style={{ color: 'red' }}>Join WhatsApp Groups, and <a href="/addgroup">Increase Group Members</a>.</span> 
          </p>
        </section>
      </div>
    </div>
  </div>
</div>
   
    </>
  );
}

