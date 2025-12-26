import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
function TopSlidePar() {
  return (
    <div className="d-flex align-items-center justify-content-between header-row px-4 pt-2">
      <div>
        <h4 className="mb-1">welcome back , {localStorage.name} !</h4>
        <div className="text-muted small">
          it is the best time to manage your finances
        </div>
      </div>

      {/* <div className="search-box d-flex align-items-center border p-1 rounded d-none d-md-flex">
        <input
          className="form-control search-input border-0"
          placeholder="Search product"
        />
        <button style={{ border: 0, background: "#fff" }}>
          <i className="bi bi-search search-icon"></i>
        </button>
      </div> */}

      <div className="search-and-actions d-flex align-items-center gap-3 d-none d-md-flex">
        <div className="actions d-flex align-items-center gap-2">
          {/* <button className="btn btn-light icon-btn position-relative">
            <i className="bi bi-chat-left-text"></i>
          </button>
          <button className="btn btn-light icon-btn position-relative">
            <i className="bi bi-bell"></i>
          </button> */}

          <div className="d-flex align-items-center user-sm">
            <hr />
            <div className="text-end">
              <div className="fw-semibold">{localStorage.name}</div>
              <div className="small text-muted">{localStorage.role}</div>
            </div>
            <Link to='/profile'>
              <AccountCircleIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopSlidePar;
