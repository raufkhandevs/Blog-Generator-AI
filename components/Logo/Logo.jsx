import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo = () => {
  return (
    <div className="text-3xl text-center py-4 font-heading">
      ArchBlogs
      <FontAwesomeIcon
        icon={faBrain}
        className="text-2xl pl-2 text-slate-400"
      />
    </div>
  );
};

export default Logo;
