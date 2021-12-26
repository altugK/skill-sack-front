import left from "../assets/left.png";
import right from "../assets/right.png";

const TopBar = (props) => {
  return (
    <div className="shadow-sm bg-light mb-3 text-sm-center">
      <img src={left} width="110" alt="Skill Sack Logo" />
      <img src={right} width="110" alt="Skill Sack Logo" />
    </div>
  );
};
export default TopBar;
