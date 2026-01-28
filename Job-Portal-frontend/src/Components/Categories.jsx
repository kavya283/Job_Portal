import "../styles/Categories.css";
import {
  FaCalculator,
  FaChalkboardTeacher,
  FaCogs,
  FaTshirt,
  FaUserTie,
  FaPaintBrush,
  FaFlask,
  FaHospital
} from "react-icons/fa";

function Categories() {
  return (
    <div className="categories">
      <div className="category-card">
        <FaCalculator />
        <p>Accounting / Finance</p>
      </div>

      <div className="category-card">
        <FaChalkboardTeacher />
        <p>Education / Training</p>
      </div>

      <div className="category-card">
        <FaCogs />
        <p>Engineer / Architects</p>
      </div>

      <div className="category-card">
        <FaTshirt />
        <p>Garments / Textile</p>
      </div>

      <div className="category-card">
        <FaUserTie />
        <p>HR / Org Development</p>
      </div>

      <div className="category-card">
        <FaPaintBrush />
        <p>Design / Creative</p>
      </div>

      <div className="category-card">
        <FaFlask />
        <p>Research / Consultancy</p>
      </div>

      <div className="category-card">
        <FaHospital />
        <p>Medical / Pharma</p>
      </div>
    </div>
  );
}

export default Categories;
