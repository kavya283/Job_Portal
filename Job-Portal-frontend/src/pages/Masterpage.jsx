import { useNavigate } from "react-router-dom";
import "../assets/index.css";
import IMG1 from "../assets/masterpage.png";

const Masterpage = () => {
  const navigate = useNavigate();

  return (
    /* This wrapper now uses var(--bg) from your index.css */
    <div className="master-page-wrapper d-flex align-items-center justify-content-center">
      {/* Replaced 'card' with 'custom-master-card' to use your theme variables */}
      <div className="custom-master-card shadow-lg border-0" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="row g-0" style={{ minHeight: "520px" }}>

          {/* LEFT IMAGE */}
          <div className="col-md-6 d-none d-md-flex">
            <img
              src={IMG1}
              alt="Role Selection"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "1rem",
                borderBottomLeftRadius: "1rem",
              }}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-md-6 d-flex align-items-center">
            <div className="p-5">
              {/* Added 'theme-heading' class to ensure text flips to white in dark mode */}
              <h1 className="theme-heading" style={{ fontSize: "42px", fontWeight: 600, lineHeight: "1.2" }}>
                Select <br /> who you are
              </h1>

              <div className="d-flex flex-column gap-3 mt-4">
                <button
                  className="primary-btn py-3" /* Using your primary-btn class */
                  onClick={() => navigate("/emplogin")}
                >
                  Employer
                </button>

                <button
                  className="secondary-btn-outline py-3" 
                  onClick={() => navigate("/candidate/login")}
                >
                  Job Seeker
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Masterpage;