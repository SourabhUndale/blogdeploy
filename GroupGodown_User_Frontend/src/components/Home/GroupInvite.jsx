import React, { useEffect, useState } from "react";
import "./Home.css";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; 
import useDataFetch from "../../useDataFetch";
import link from "../../../link.json";
import axios from "axios";
import Loader from "../Loader/Loader";
import replacelogo from "/ggLogo.jpeg";
  
function GroupInvite() {
  // All hooks at the top
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const catId = searchParams.get("catId");
  const obaseUri = JSON.parse(JSON.stringify(link));
  const baseUri = obaseUri.DefaultbaseUri;
  const defualtgroupImg = obaseUri.defaultgroupImg;
  const { data: singlegroup, loading: singleGroupLoading } = useDataFetch(`${baseUri}odata/Groups(${id})?$expand=Category`, []);
  
  const { data: relatedData } = useDataFetch(
    `${baseUri}odata/Groups?$filter=Category/catId eq ${catId}&$expand=Category`,
    []
  );
  
  const [reasonCategory, setReasonCategory] = useState("");
  const [reasonCategoryError, setreasonCategoryError] = useState("");
  const [reasonDetailsError, setreasonDetailsError] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");
  const adsenseClient = link.adsenseClient;
  const adsenseSlot = link.adsenseSlot;
  const navigate = useNavigate();
  const [visibleGroups, setVisibleGroups] = useState(4);

  // Helper to ensure absolute URLs
  const getAbsoluteImageUrl = (relativePath) => {
    if (!relativePath) return '';
    if (relativePath.startsWith('http') || relativePath.startsWith('//')) {
      return relativePath; // Already absolute
    }
    // For backend-served images, prepend baseUri
    return `${baseUri.endsWith('/') ? baseUri : baseUri + '/'}${relativePath.startsWith('/') ? relativePath.substring(1) : relativePath}`;
  };

  const absoluteGroupImage = getAbsoluteImageUrl(singlegroup?.groupImage);
  
  useEffect(() => {
    if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (singleGroupLoading) {
    return <Loader />;
  }

  if (!singlegroup || !singlegroup.Category) {
    return <div className="p-5 text-center">Group not found or category missing.</div>;
  }

  const shareOnInstagram = (inWhatsapp) => {
    const currentUrl = window.location.href;
    const instaMessage = `Check out this link: ${currentUrl}`;
    return `https://www.instagram.com/direct/new/?text=${instaMessage}`;
  };

  const shareOnWhatsApp = (whWhatsapp) => {
    const currentUrl = window.location.href;
    const whatsappMessage = `Check out this link: ${currentUrl}`;

    const message = encodeURIComponent(
      `Join our WhatsApp group: ${whatsappMessage}`
    );
    return `https://wa.me/?text=${message}`;
  };

  const shareOnTelegram = (teWhatsapp) => {
    // Replace [your Telegram group link here] with your actual Telegram group link

    const currentUrl = window.location.href;
    const TelegramMessage = `Check out this link: ${currentUrl}`;

    //const message = encodeURIComponent(`Join our Telegram group: ${teWhatsapp}`);
    return `https://t.me/share/url?url=${TelegramMessage}`;
  };

  const handleGroupClick = (groupId, catId) => {
    //alert('Join Clicked');
    window.open(`/groupinvite?id=${groupId}&catId=${catId}`, "_blank");
    window.scrollTo(0,0);
  };

  const truncateDescription = (description) => {
    return description && description.length > 25
      ? description.substring(0, 25) + "..."
      : description;
  };

  const resetReasonCategory = () => {
    setReasonCategory("");
  };

  const handlereportGroup = async (groupId) => {
    

    let formIsValid = true;

    


    if (reasonDetails === "") {
      setreasonDetailsError("Please enter the report reason");
      // Set an error state or display an error message for the reason details field
      formIsValid = false;
    } else {
      setreasonDetailsError("");
    }

    if (reasonCategory.trim() === "" || reasonCategory === "Report For") {
      setreasonCategoryError("Please select the report reason");
      formIsValid = false;
    } else {
      setreasonCategoryError("");
    }

    if (!formIsValid) {
      // Optionally, display a general error message indicating that all fields are required
      return;
    }

    try {
      const response = await axios.post(`${baseUri}api/Report?groupId=${groupId}`, {
          reportReason: reasonCategory,
          reportDesc: reasonDetails
      });
      setReasonDetails("");
      event.preventDefault();
      resetReasonCategory();
      alert("Group Reported");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-5">

       {/* Add dynamic Open Graph meta tags */}
       <Helmet>
      
        <title>
          {`${singlegroup?.groupName || 'Loading...'} | Join WhatsApp Group | ${
            window.location.hostname.replace(/^www\./, '').split('.')[0].replace(/^\w/, c => c.toUpperCase())
          }`}
        </title>
        <meta name="description" content={singlegroup?.groupDesc || 'Join and share WhatsApp groups from various categories, countries, and languages.'} />
        <meta property="og:title" content={singlegroup?.groupName || 'Group Godown'} />
        <meta property="og:site_name" content="Group Godown" />
        <meta property="og:url" content="https://www.groupgodown.com/"/>
        <meta property="og:type" content="artical" />
        <meta
          property="og:description"
          content={singlegroup?.groupDesc || 'Loading group description...'} 
        />
        <meta property="og:image" content={absoluteGroupImage || `{https://www.groupgodown.com/}${replacelogo}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content={singlegroup?.groupName || 'Group Image'} />
        <meta property="og:locale" content="en_US" />
      </Helmet>

      <div className="d-flex justify-content-center flex-column border border-3 bg-light rounded">
        <div className="d-flex flex-column gap-2 align-items-center p-3">
          <img
            src={absoluteGroupImage}
            onError={(e) => {
              e.target.src = replacelogo; // Replace with your default image URL
            }}
            width={"10%"}
            className="rounded-circle"
            alt={singlegroup?.groupName || 'Group Image'}
          />
          <h1 className="text-decoration-none text-wrap text-black fs-3 fw-bold mb-0">
            {singlegroup?.groupName}
          </h1>
          <div className="d-flex gap-3">
            <Link
              to={`/groups/category/${singlegroup?.Category?.catName}`}
              className="text-decoration-none text-secondary underline"
            >
              <i className="bi bi-list me-1"></i>
              {singlegroup?.Category?.catName}
            </Link>
            <Link
              to={`/groups/country/${singlegroup?.country}`}
              className="text-decoration-none text-secondary underline"
            >
              <i className="bi bi-globe me-1"></i>
              {singlegroup?.country}
            </Link>
            <Link
              to={`/groups/language/${singlegroup?.Language}`}
              className="text-decoration-none text-secondary underline"
            >
              <i className="bi bi-translate me-1"></i>
              {singlegroup?.Language}
            </Link>
          </div>
          {/* <p>2024-01-12 12:09:20</p> */}
          <div
            className="border border-2 bg-light rounded p-2"
            style={{ width: "-webkit-fill-available" }}
          >
            <p className="m-0">{singlegroup?.groupDesc}</p>
          </div>


        {/* ✅ SEO-friendly dynamic description */}

        <div className="group-invite__description">
          <p>
            The WhatsApp group <span className="highlight">{singlegroup?.groupName} </span> 
            is a <span className="highlight">{singlegroup?.Language}</span> WhatsApp group. 
            It is a <span className="highlight">{singlegroup?.Category?.catName}</span> WhatsApp group, 
            and is a <span className="highlight">{singlegroup?.country}</span> WhatsApp group. 
            To join this group click on <span className="highlight join-btn">'Join Group'</span> Button.
          </p>
        </div>



        <div className="d-flex gap-3 p-2">
        
        <Link
          className="btn btn-primary"
          to={`/joingroup/${singlegroup?.groupLink.substring(
            singlegroup?.groupLink.lastIndexOf("/") + 1
          )}?groupName=${encodeURIComponent(singlegroup?.groupName)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Join Group
        </Link>


          <button
            className="btn btn-success"
            onClick={() => {
              window.open(shareOnWhatsApp(singlegroup?.groupLink), "_blank");
            }}
          >
            Share Group
          </button>
        </div>
        </div>
        <div className="ms-3">
          <p>
            <button
              className="btn btn-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseWidthExample"
              aria-expanded="false"
              aria-controls="collapseWidthExample"
            >
              Report Group
            </button>
          </p>
          <div className="d-flex flex-column">
            <div
              className="collapse collapse-horizontal me-3 mb-4"
              id="collapseWidthExample"
            >
              <div className="border border-3 p-3 rounded bg-light">
                <select className="form-select mb-3" id="reasonCategorySelect"
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}>
                  <option selected value="">Report For</option>
                  <option value="Fake/Spam/Fraud">Fake/Spam/Fraud</option>
                  <option value="Inappropriate">Inappropriate</option>
                  <option value="Link Revoked">Link Revoked</option>
                  <option value="Gruop is Full">Gruop is Full</option>
                  <option value="Group in wrong Category">
                    Group in wrong Category
                  </option>
                  <option value="Religious Hateful">Religious Hateful</option>
                  <option value="Remove my Group">Remove my Group</option>
                  <option value="Child Pornography">Child Pornography</option>
                  <option value="Other">Other</option>
                </select>
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    placeholder="Leave a comment here"
                    id="reasonDetails"
                    className={`form-control ${
                      reasonDetailsError ? "is-invalid" : ""
                    }`}
                    value={reasonDetails}
                    onChange={(e) => {
                      setReasonDetails(e.target.value);
                      setreasonDetailsError("");
                    }}
                  />
                  {reasonDetailsError && (
                    <div className="invalid-feedback">{reasonDetailsError}</div>
                  )}
                  <label for="reasonDetails">Reasons for reporting group</label>
                </div>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseWidthExample"
                  aria-expanded="false"
                  aria-controls="collapseWidthExample"
                  onClick={() => handlereportGroup(singlegroup?.groupId)}
                  disabled={!reasonDetails.trim() || reasonCategory === ""}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mt-5 text-center">Related Groups</h5>
      {relatedData && relatedData.value && Array.isArray(relatedData.value) && relatedData.value.slice(0, visibleGroups).map((rData, index) => (
        <React.Fragment key={rData.groupId}>
          <div className="mt-4 mb-4 d-flex justify-content-center">
            <div className="card card_w">
              <div className="card-body">
                <img
                  src={getAbsoluteImageUrl(rData.GroupImage)}
                  onError={(e) => {
                    e.target.src = replacelogo; // Replace with your default image URL
                  }}
                  width={"8%"}
                  className="rounded-circle"
                  alt={rData.groupName || 'Related Group Image'}
                />
                <div className="heading-div">
                  <h5>
                    <Link
                      to={`/groupinvite?id=${rData.groupId}&catId=${rData.catId}`}
                      className="text-black text-decoration-none fw-bold underline"
                      onClick={() => {
                        window.scrollTo(0,0);
                      }}
                    >
                      {rData.groupName}
                    </Link>
                  </h5>
                  <div>
                    <Link
                      to={`/groups/category/${rData?.Category?.catName}`}
                      className="text-decoration-none text-secondary underline"
                    >
                      <i class="bi bi-list"></i> {rData.Category.catName}
                    </Link>
                    <Link
                      to={`/groups/country/${rData?.country}`}
                      className="text-decoration-none text-secondary underline"
                    >
                      <i class="bi bi-globe"></i> {rData.country}
                    </Link>
                    <Link
                      to={`/groups/language/${rData?.Language}`}
                      className="text-decoration-none text-secondary underline"
                    >
                      <i class="bi bi-translate"></i> {rData.Language}
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-right ps-4 pe-4">
                  <Link
                    to={`/groupinvite?id=${rData.groupId}&catId=${rData.catId}`}
                    className="text-decoration-none text-black underline"
                    onClick={() => {
                      window.scrollTo(0,0);
                    }}
                  >
                    {truncateDescription(rData.groupDesc)}
                  </Link>
                  {rData.groupDesc && rData.groupDesc.length > 25 && (
                    <Link
                      className="text-decoration-none underline"
                      to={`/groupinvite?id=${rData.groupId}&catId=${rData.catId}`}
                      onClick={() => {
                        window.scrollTo(0,0);
                      }}
                    >
                      Read more
                    </Link>
                  )}
                </p>
                <hr />
              </div>
              <div className="ps-4 pe-4 d-flex justify-content-between">
                <Link
                  to={`/joingroup/${rData?.groupLink.substring(
                    rData?.groupLink.lastIndexOf("/") + 1
                  )}?groupName=${encodeURIComponent(rData?.groupName)}`}
                  className="text-decoration-none text-black fw-bold fs-5 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    window.scrollTo(0,0);
                  }}
                >
                  Join Group
                </Link>
                <p className="social-icons-p d-flex align-items-center fs-5">
                  Share on :{" "}
                  <div className="social-icons-div ">
                    <a
                      href=""
                      onClick={() => {
                        window.open(shareOnWhatsApp(rData.groupLink), "_blank");
                      }}
                    >
                      <i className="bi bi-whatsapp text-success"></i>
                    </a>
                    <a
                      href=""
                      onClick={() => {
                        window.open(shareOnInstagram(rData.groupLink), "_blank");
                      }}
                    >
                      <i
                        className="bi bi-instagram"
                        style={{ color: "rgb(214 0 255)" }}
                      ></i>
                    </a>
                    <a
                      href=""
                      onClick={() => {
                        window.open(shareOnTelegram(rData.groupLink), "_blank");
                      }}
                    >
                      <i className="bi bi-telegram"></i>
                    </a>
                  </div>
                </p>
              </div>
            </div>
          </div>
          
          {/* Ad after every 2 related groups */}
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
     
      {relatedData && relatedData.value && visibleGroups < relatedData.value.length && (
        <div className="d-flex justify-content-start mt-3">
          <button className="btn btn-primary" onClick={() => setVisibleGroups(prev => prev + 2)}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupInvite;

