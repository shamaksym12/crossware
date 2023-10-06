import { Media, Report } from 'redux/app';
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { setItemCount } from "redux/app/actions";

export const cls = (styles: any[]) => {
    return styles.join(" ").trim();
};

export const formatNumber = (num: number) => {
    return num > 9 ? num : '0' + num;
};

export const dateString = (date: Date) => {
    return `${date.getFullYear()}/${formatNumber(date.getMonth() + 1)}/${date.getDate()}`;
};

export const dateList = (num: number) => {
    const today = new Date();
    const list = [];

    for (let i = 0; i < num; i++) {
        const date = new Date(today.getTime() - 24 * 60 * 60 * 1000 * i);

        list[i] = dateString(date);
    }

    return list;
}

export const old_to_new = (a: Media | Report, b: Media| Report) => {
    return (new Date(a.date)).getTime() - (new Date(b.date)).getTime()
  };
  
export const new_to_old = (a: Media | Report, b: Media | Report) => {
    return (new Date(b.date)).getTime() - (new Date(a.date)).getTime()
  };

export const mediafilter = (items: Media[]) => {
  const dispatch = useDispatch();
  const { order, mediaFilter, search, itemCount } = useSelector(getAppState);
  const ret = items.sort(order === "new" ? new_to_old : old_to_new)
  .filter((media: Media) => ((mediaFilter.checked === "all" || mediaFilter.checked === "checked" && media.checked || mediaFilter.checked === "unchecked" && !media.checked) && (mediaFilter.type === "all" || mediaFilter.type === media.type) && (search === "" || media.name.includes(search) || media.title.includes(search))))
  if (itemCount !== ret.length) dispatch(setItemCount(ret.length));
  return ret;
}

export const reportfilter = (items: Report[]) => {
  const dispatch = useDispatch();
  const { order, mediaFilter, search, itemCount } = useSelector(getAppState);
  const ret = items.sort(order === "new" ? new_to_old : old_to_new)
  .filter((media: Report) => (mediaFilter.checked === "all" || mediaFilter.checked === "checked" && media.status || mediaFilter.checked === "unchecked" && !media.status) && (search === "" || media.name.includes(search) || media.title.includes(search)))
  if (itemCount !== ret.length) dispatch(setItemCount(ret.length));
  return ret;
}