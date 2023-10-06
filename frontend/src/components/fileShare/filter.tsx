import React, { useState } from 'react';
import Container from "components/Container";
import Search from "assets/image/icon/search-white.png";
import { Select, Button } from 'antd';
import Calendar from 'react-calendar';
import Close from "assets/image/icon/close.png";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "redux/app/actions";
import { getAppState } from "redux/app/selectors";
import { useTranslation } from "react-i18next";

const FileFilter = () => {
  const dispatch = useDispatch();
  const { order } = useSelector(
    getAppState
  );

  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [startPeriod, setStartPeriod] = useState<Date>();
  const [endPeriod, setEndPeriod] = useState<Date>();

  const { Option } = Select;

  const { t } = useTranslation();

  const handleOrder = (value: string) => {
    dispatch(setOrder(value))
  };

  const showCalendar = () => {
    setVisibleCalendar(true);
  };

  const hideCalendar = () => {
    setVisibleCalendar(false);
  };

  const formatShortWeekday = (_locale: any, date: { getDay: () => number; }) => [t("cal.day1"), t("cal.day2"), t("cal.day3"), t("cal.day4"), t("cal.day5"), t("cal.day6"), t("cal.day7")][date.getDay()];

  const formatMonthYear = (_locale: any, date: any) => {
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
  };

  const handelPeriod = (date: any[]) => {
    console.log(date);
    if (date.length) {
      setStartPeriod(date[0]);
      setEndPeriod(date[1]);
    }
  };

  const formatNumber = (num: number) => {
    return num > 9 ? num : `0${num}`;
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${formatNumber(date.getMonth() + 1)}/${formatNumber(date.getDate())}`;
  };

  return (
      <Container className="filterWrap">
          <div className="leftFilter">
              <Select defaultValue={order} className="selectBox" onChange={handleOrder}>
                  <Option value="new">{t("img.filterNew")}</Option>
                  <Option value="old">{t("img.filterOld")}</Option>
              </Select>
              <div className="favorite" onClick={showCalendar}>{t("img.period")}</div>
              {visibleCalendar && <div className="calendarWrap">
                <img src={Close} className="closeCalendar" onClick={hideCalendar} alt="" />
                <Calendar onChange={handelPeriod} value={[startPeriod, endPeriod]} selectRange formatShortWeekday={formatShortWeekday} formatMonthYear={formatMonthYear} />
                <Button type="primary" onClick={hideCalendar}>{t("img.period2")}</Button>
              </div>}
              {!visibleCalendar && startPeriod && endPeriod && <div className="period">{`${formatDate(startPeriod)} から ${formatDate(endPeriod)} まで`}</div>}
          </div>
          <div className="rightSearchWrap">
            <div className="description"><br/></div>
            <div className='rightSearch'>
              <input type="text"placeholder={t("img.search2")} />
              <div className="searchIcon">
                  <img src={Search} alt="" />
              </div>
            </div>
          </div>
      </Container>
    );
};

export default FileFilter;
