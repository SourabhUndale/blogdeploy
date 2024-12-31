import React from "react";
import "./Home.css";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import metaImage from "../data/ggLogo.jpeg"

function JoinGroup() {
  let { grouplink } = useParams();

  return (
    
    <div className="d-flex justify-content-center ">
      
      <Helmet>
        <title>WhatsApp Group Links | Join Indian & Girls WhatsApp Groups | groupgodown.com</title>
        <meta property="og:title" content="WhatsApp Group Links | Join Indian & Girls WhatsApp Groups"/>
        <meta property="og:site_name" content="Group Godown"/>
        <meta property="og:url" content="https://www.groupgodown.com/"/>
        <meta property="og:description" content="Join the best WhatsApp groups to connect with like-minded people! Discover how to promote your WhatsApp group and increase group members easily. Explore top groups today!" />
        <meta property="og:type" content="website"/>
        <meta property="og:image" content={metaImage}></meta>
        <meta property="og:locale" content="en_US" />
        <meta name="description" content="Enjoy connecting with people" />
      </Helmet>

      <div className="col-12 p-3">
        <div className="border border-3 bg-light p-4 rounded">
          <h4>You can find join button bellow</h4>
          <h6>What is GroupGodown?</h6>
          <p>
          GroupGodown is best whatsapp group link providing plateform where user
            can promote their groups world widely and join many other groups. We
            have several group category like business, education, health,
            social, job, sports etc. We have large audience from country like
            India, USA, etc.
          </p>
          <h6>Why GroupGodown?</h6>
          <p>
          GroupGodown is provide 99.99% Active whatsapp group link. Our system
            will identify rekoved group link and remove them immediatly. No
            limit on adding and joining groups.
          </p>
          <h6>How to promote group link?</h6>
          <p>
            Copy group invite link from whatsapp and past it on add group page
            and fill other detail like country, category, language, tags and
            description. click here to publish new whatsapp group.
          </p>
          <h6>How to remove your group from GroupGodown?</h6>
          <p>
            Open your group in GroupGodown and click on *Report this group link.
            choose one option and tell other detail like admin contact number.
          </p>
          <h6>What is Whatsapp?</h6>
          <p>
            WhatsApp Messenger: More than 2 billion people in over 180 countries
            use WhatsApp to stay in touch with friends and family, anytime and
            anywhere. WhatsApp is free and offers simple, secure, reliable
            messaging and calling, available on phones all over the world.
          </p>
          <h4>Click on bellow button to join whatsapp group</h4>
          <h5>You will be redirected to group in whatsapp...</h5>
          <div className="d-flex justify-content-center p-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                window.open(
                  `https://chat.whatsapp.com/invite/${grouplink}`,
                  "_blank"
                );
              }}
            >
              Join Group Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinGroup;
