import React from "react";
import Container from "components/Container";
import Search from "assets/image/icon/search.png";
import SearchActive from "assets/image/icon/search-active.png";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchBox = () => {
  const dispatch = useDispatch();
  const { search } = useSelector(
    getAppState
  );
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleSearch = (e: any) => {
    dispatch(setSearch(e.target.value));
  };
  const toSearch = () => {
    if (search) navigate('/camera');
  };

  return (
    <Container className="searchBoxContainer">
      <input type="text" placeholder={t("search.searchbar")} value={search} onChange={handleSearch} />
      {search ? 
      <img src={SearchActive} className="" onClick={toSearch} /> :
      <img src={Search} className="" />}
    </Container>
  );
};

export default SearchBox;
