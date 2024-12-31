import React, { useEffect, useState } from "react";
import "./Home.css";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; 
import useDataFetch from "../../useDataFetch";
import link from "../../../link.json";
import axios from "axios";
import { useSearch } from "../../SearchContext";
import replacelogo from "/ggLogo.jpeg"
  
function GroupInvite() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const catId = searchParams.get("catId");

  const obaseUri = JSON.parse(JSON.stringify(link));
  const baseUri = obaseUri.DefaultbaseUri;
  const defualtgroupImg = obaseUri.defaultgroupImg;

  const { data: singlegroup } = useDataFetch(`${baseUri}api/Groups/` + id, []);

  const { data: relatedData } = useDataFetch(
    `${baseUri}api/Groups/id/Groups?catId=${catId}`,
    []
  );

  const shareOnInstagram = (inWhatsapp) => {
    const currentUrl = window.location.href;
    const instaMessage = `Check out this link: ${currentUrl}`;
    window.open(
      `https://www.instagram.com/direct/new/?text=${instaMessage}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = (whWhatsapp) => {
    const currentUrl = window.location.href;
    const whatsappMessage = `Check out this link: ${currentUrl}`;

    const message = encodeURIComponent(
      `Join our WhatsApp group: ${whatsappMessage}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareOnTelegram = (teWhatsapp) => {
    // Replace [your Telegram group link here] with your actual Telegram group link

    const currentUrl = window.location.href;
    const TelegramMessage = `Check out this link: ${currentUrl}`;

    //const message = encodeURIComponent(`Join our Telegram group: ${teWhatsapp}`);
    window.open(`https://t.me/share/url?url=${TelegramMessage}`, "_blank");
  };

  const navigate = useNavigate();

  const handleGroupClick = (groupId, catId) => {
    //alert('Join Clicked');
    navigate(`/groupinvite?id=${groupId}&catId=${catId}`);
    window.scrollTo(0,0);
  };

  const truncateDescription = (description) => {
    return description.length > 25
      ? description.substring(0, 25) + "..."
      : description;
  };

  const [reasonCategory, setReasonCategory] = useState("");
  const [reasonCategoryError, setreasonCategoryError] = useState("");
  const [reasonDetailsError, setreasonDetailsError] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");

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
        <title>{singlegroup.groupName}</title>
        <meta property="og:title" content={singlegroup.groupName} />
        <meta property="og:site_name" content="Group Godown" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={singlegroup.groupDesc}
        />
        <meta property="og:image" content={singlegroup.groupImage || replacelogo} />
        <meta property="og:locale" content="en_US" />
      </Helmet>

      <div className="d-flex justify-content-center flex-column border border-3 bg-light rounded">
        <div className="d-flex flex-column gap-2 align-items-center p-3">
          <img
            src={singlegroup.groupImage}
            onError={(e) => {
              e.target.src = replacelogo; // Replace with your default image URL
            }}
            width={"10%"}
            className="rounded-circle"
          />
          <p className="text-decoration-none text-wrap text-black fs-3 fw-bold mb-0">
            {singlegroup.groupName}
          </p>
          <div className="d-flex gap-3">
            <a
              href=""
              className="text-decoration-none text-secondary underline"
            >
              <i className="bi bi-list me-1"></i>
              {singlegroup.catName}
            </a>
            <a
              href=""
              className="text-decoration-none text-secondary underline"
            >
              <i className="bi bi-globe me-1"></i>
              {singlegroup.country}
            </a>
            <a
              href=""
              className="text-decoration-none text-secondary underline"
            >
              <i className="bi bi-translate me-1"></i>
              {singlegroup.language}
            </a>
          </div>
          {/* <p>2024-01-12 12:09:20</p> */}
          <div
            className="border border-2 bg-light rounded p-2"
            style={{ width: "-webkit-fill-available" }}
          >
            <p className="m-0">{singlegroup.groupDesc}</p>
          </div>
          <div className="d-flex gap-3 p-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  "/joingroup/" +
                    singlegroup.groupLink.substring(
                      singlegroup.groupLink.lastIndexOf("/") + 1
                    )
                );
              }}
            >
              Join Group
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                shareOnWhatsApp(singlegroup.groupLink);
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
                  onClick={() => handlereportGroup(singlegroup.groupId)}
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
      {relatedData.map((rData) => (
        <div className="mt-4 mb-4 d-flex justify-content-center">
          <div className="card card_w">
            <div className="card-body">
              <img
                src={rData.groupImage}
                onError={(e) => {
                  e.target.src = replacelogo; // Replace with your default image URL
                }}
                width={"8%"}
                className="rounded-circle"
              />
              <div className="heading-div">
                <h5>
                  <a
                    href=""
                    className="text-black text-decoration-none fw-bold underline"
                    onClick={() => {
                      event.preventDefault();
                      handleGroupClick(rData.groupId, rData.catId);
                    }}
                  >
                    {rData.groupName}
                  </a>
                </h5>
                <div>
                  <a
                    href=""
                    className="text-decoration-none text-secondary underline"
                  >
                    <i class="bi bi-list"></i> {rData.catName}
                  </a>
                  <a
                    href=""
                    className="text-decoration-none text-secondary underline"
                  >
                    <i class="bi bi-globe"></i> {rData.country}
                  </a>
                  <a
                    href=""
                    className="text-decoration-none text-secondary underline"
                  >
                    <i class="bi bi-translate"></i> {rData.language}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <p className="text-right ps-4 pe-4">
                <a
                  href=""
                  className="text-decoration-none text-black underline"
                >
                  {truncateDescription(rData.groupDesc)}
                </a>
                {rData.groupDesc.length > 25 && (
                  <Link
                    className="text-decoration-none underline"
                    onClick={() => {
                      event.preventDefault();
                      handleGroupClick(rData.groupId, rData.catId);
                    }}
                  >
                    Read more
                  </Link>
                )}
              </p>
              <hr />
            </div>
            <div className="ps-4 pe-4 d-flex justify-content-between">
              <a
                href=""
                className="text-decoration-none text-black fw-bold fs-5 underline"
                onClick={() => {
                  event.preventDefault();
                  handleGroupClick(rData.groupId, rData.catId);
                }}
              >
                Join Group
              </a>
              <p className="social-icons-p d-flex align-items-center fs-5">
                Share on :{" "}
                <div className="social-icons-div ">
                  <a
                    href=""
                    onClick={() => {
                      shareOnWhatsApp(rData.groupLink);
                    }}
                  >
                    <i className="bi bi-whatsapp text-success"></i>
                  </a>
                  <a
                    href=""
                    onClick={() => {
                      shareOnInstagram(rData.groupLink);
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
                      shareOnTelegram(rData.groupLink);
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
  );
}

export default GroupInvite;
