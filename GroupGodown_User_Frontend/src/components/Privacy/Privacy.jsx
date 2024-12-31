import React from "react";
import "./Privacy.css";
import { Helmet } from "react-helmet-async";
import metaImage from "../data/ggLogo.jpeg"
export default function Privacy() {
  return (

    <>
      <Helmet>
          <title>Privacy Policy | WhatsApp Group Links & Promotion | groupgodown.com</title>
          <meta property="og:title" content="Privacy Policy | WhatsApp Group Links & Promotion | groupgodown.com | Join Indian & Girls WhatsApp Groups"/>
          <meta property="og:site_name" content="Group Godown"/>
          <meta property="og:url" content="https://www.groupgodown.com/"/>
          <meta property="og:description" content="Join the best WhatsApp groups to connect with like-minded people! Discover how to promote your WhatsApp group and increase group members easily. Explore top groups today!" />
          <meta property="og:type" content="website"/>
          <meta property="og:image" content={metaImage}></meta>
          <meta property="og:locale" content="en_US" />
          <meta name="description" content="Learn how we safeguard your data while you add, promote, and join WhatsApp groups, including earning, share market, girls’ groups, and YouTube subscribe links." />
          <meta name="keywords" content="Free WhatsApp Group Promo, Add WhatsApp Group Links, Increase WhatsApp Group Members, WhatsApp Earning Group, Join WhatsApp groups" />
          <link rel="canonical" href="https://www.groupgodown.com/privacy/" />
          {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YSB821HQC6"></script>
      </Helmet>

      <div className="outer-div">
        <div className="privacy-main-div">
          <h5>Privacy Policy</h5>
          <p>
            At GroupGodown, we prioritize the protection of our visitors' privacy.
            We are dedicated to preserving the privacy and confidentiality of the
            information gathered from our visitors and the use of that information
            in accordance with GroupGodown's privacy principles. If you have any
            doubts or questions about this, please feel free to contact us.
          </p>
          <h5>Information Collection and Use</h5>
          <p>
            Visitors to this website voluntarily share certain information,
            primarily links of WhatsApp and Telegram groups. Other visitors then
            join these groups by clicking on these links. When visitors contact
            us, their name, email address, phone number, etc., may be collected.
            Additionally, we do not collect any other information about visitors.
            The information provided by visitors on the website is used to provide
            them with the services they request. It is also used for website
            improvements, providing better services, etc. Information about groups
            provided on the website is available to the public for sharing on
            social media platforms. Furthermore, this information is not used for
            any other purpose.
          </p>
          <p>
            Internet Protocol (IP) addresses, browser type, Internet service
            provider (ISP), date and time stamps, referred/exit pages, and
            possible clicks are logged using standard log files. This information
            is used for analysis, website management, tracking user movements, and
            improving user experience.
          </p>
          <h5>Cookies and Web Beacons</h5>
          <p>
            Similar to other websites, we use cookies and web beacons to collect
            and request preferences of our visitors and for tracking the number of
            visits to the pages provided. These cookies help optimize user
            experience by customizing content based on browser type, device
            preferences, and other relevant information. Users can choose to
            control their cookie preferences by adjusting settings in their web
            browser.
          </p>
          <h5>Advertising Partners</h5>
          <p>
            Some personalized advertisements may be distributed by advertising
            partners using cookies and web beacons. Each advertising partner
            adheres to their own privacy policies regarding user data and provides
            detailed information to users for managing data usage and opt-out
            options.
          </p>
          <h5>Third-Party Privacy Policies</h5>
          <p>
            The privacy policy of GroupGodown does not apply to third-party
            advertisers or websites. Therefore, we advise users to consult the
            respective privacy policies of these third-party advertisers for more
            detailed information. Information about how to opt out of specific
            options and how to cancel selected options may be included in these
            policies.
          </p>
          <h5>Data Protection Rights</h5>
          <p>
            We uphold various data protection rights, including access,
            rectification, erasure, restriction, objection, and data portability.
            Requests related to these rights may be made, and we are committed to
            promptly and transparently responding to such requests.
          </p>
          <h5>Legal Disclaimer</h5>
          <p>
            We reserve the right to disclose any personal information as required
            by law and when we believe that disclosure is necessary to safeguard
            our rights or to adhere to a judicial proceeding, court order, or
            legal process served on our website.
          </p>
          <h5>Data Retention</h5>
          <p>
            We retain your personal information only for as long as it is
            necessary to meet the objectives for which it was obtained or as
            mandated by relevant laws. Once the information is no longer needed,
            it is securely disposed of or anonymized. If you wish to request the
            deletion of your personal information, please contact us using the
            information provided below.
          </p>
          <h5>Children's Information</h5>
          <p>
            Ensuring the online safety of minors is paramount to us. We do not
            knowingly gather or store personally identifiable information from
            individuals under the age of 13. If you are a parent or guardian and
            believe that your child's information has been collected, please reach
            out to us immediately for swift action to remove the information.
          </p>
          <h5>Changes to Our Privacy Policy</h5>
          <p>
            GroupGodown.com may update this privacy statement from time to time.
            The current version will always be posted here.
          </p>
          <h5>Consent</h5>
          <p>
            By using this website, you consent to our terms and conditions of use
            as well as our privacy policy.
          </p>
          <p>
            Please report any violations of these terms and conditions or rules
            using our contact form: <a href="/Contact">Contact</a> 
          </p>
        </div>
      </div>
    </>

    
  );
}
