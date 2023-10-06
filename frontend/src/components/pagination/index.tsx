import React, { useEffect } from 'react';
import { Pagination as AntdPagination } from 'antd';
import { setPage, setPageSize } from "redux/app/actions";
import { useDispatch, useSelector } from "react-redux";
import { getAppState } from "redux/app/selectors";

import './pagination.scss';

const Pagination = () => {
  const dispatch = useDispatch();
  const { page, itemCount } = useSelector(
    getAppState
  );

  const handlePageChange = (page: number, pageSize: number) => {
    dispatch(setPage(page));
  }

  const handlePageSizeChange = (current: number, size: number) => {
    dispatch(setPage(1));
    dispatch(setPageSize(size));
  }

  return (
    <AntdPagination onChange={handlePageChange} onShowSizeChange={handlePageSizeChange} total={itemCount} current={page} defaultPageSize={8} pageSizeOptions={[8, 16, 24, 32]}/>
  );
};

export default Pagination;
