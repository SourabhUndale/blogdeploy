import React from "react";
import "./Home.css";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import metaImage from "../data/ggLogo.jpeg"
import link from "../../../link.json";

function JoinGroup() {
  // All hooks at the top
  let { grouplink } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const groupName = searchParams.get("groupName") || "WhatsApp Group";
  const adsenseClient = link.adsenseClient;
  const adsenseSlot = link.adsenseSlot;
  React.useEffect(() => {
    if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        // ignorez
      }
    }
  }, []);

  return (
    
    <div className="d-flex justify-content-center ">
      
      <Helmet>
        <title>{`${groupName} | WhatsApp Group Link | ${window.location.hostname.replace(/^www\./, '').split('.')[0].replace(/^\w/, c => c.toUpperCase())}`}</title>
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${groupName} | Join WhatsApp Group`} />
        <meta property="og:site_name" content="Group Godown" />
        <meta property="og:url" content="https://www.groupgodown.com/"/>
        <meta property="og:description" content={`Join the ${groupName} WhatsApp group and connect with like-minded people. Explore more active WhatsApp groups on GroupGodwon!`} />
        <meta property="og:type" content="artical" />
        <meta property="og:image" content={`{https://www.groupgodown.com/}${metaImage}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content={`${groupName} WhatsApp group`} />
        <meta property="og:locale" content="en_US" /> 

        {/* SEO Meta Tags */}
        <meta name="description" content={`Join the ${groupName} WhatsApp group and connect with friends. Discover more active WhatsApp groups on GroupGodwon!`} />  
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
          
          {/* Ad above the Join Group Now button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <ins className="adsbygoogle"
              style={{ display: 'block', width: '100%', maxWidth: 728, minHeight: 90 }}
              data-ad-client={adsenseClient}
              data-ad-slot={adsenseSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
          
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
          
          {/* Ad below the Join Group Now button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <ins className="adsbygoogle"
              style={{ display: 'block', width: '100%', maxWidth: 728, minHeight: 90 }}
              data-ad-client={adsenseClient}
              data-ad-slot={adsenseSlot}
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
          </div>
          <hr className="my-4 " />
          <div className="p-3">
            <h4>Benefits for Users</h4>
            <p>
              Joining groups on GroupGodown is great for you! You can meet new people, learn skills, and grow your business. Farmers can sell produce directly, students can get study tips, and businesses can find new customers. With 99.99% active WhatsApp group links, you’ll always connect with lively communities!
            </p>
            <h4>Follow Group Rules</h4>
            <p>
              Every group has its own rules. Before joining or after, ask the admin about WhatsApp group guidelines. Follow them to keep the group friendly and safe for everyone.
            </p>
            <h4>How to Leave a Group</h4>
            <p>
              Want to leave a group? Open WhatsApp, tap the group name, scroll down, and hit “Exit Group.” It’s simple, and you can join new groups anytime on GroupGodown!
            </p>
            <h4>Protect Privacy</h4>
            <p>
              Keep your privacy and others’ safe! Don’t share personal info like phone numbers or addresses unless necessary. Respect others’ privacy too for a secure experience on GroupGodown.
            </p>
            <h4>Share GroupGodown with Others</h4>
            <p>
              Love GroupGodown? Spread the word! Share our link (<a href="https://www.groupgodown.com">https://www.groupgodown.com</a>) with friends and family so they can join active WhatsApp groups too. Help our community grow!
            </p>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default JoinGroup;
