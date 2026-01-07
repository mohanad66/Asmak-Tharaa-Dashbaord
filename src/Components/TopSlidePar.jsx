import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function TopSlidePar() {
  const { t } = useTranslation();
  const userName = localStorage.name || t('user');
  const userRole = localStorage.role || t('user_role');

  return (
    <div className="d-flex align-items-center justify-content-between header-row px-4 pt-2">
      <div>
        <h4 className="mb-1">{t('welcome_back')}, {userName} !</h4>
        <div className="text-muted small">
          {t('best_time_to_manage_finances')}
        </div>
      </div>

      <div className="search-and-actions d-flex align-items-center gap-3 d-none d-md-flex">
        <div className="actions d-flex align-items-center gap-2">
          <div className="d-flex align-items-center user-sm">
            <hr />
            <div className="text-end">
              <div className="fw-semibold">{userName}</div>
              <div className="small text-muted">{userRole}</div>
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