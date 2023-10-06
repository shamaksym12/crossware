import { Action, setIsDownloading } from './actions';

export type Helmet = {
  location: {
    lat: number,
    lng: number
  };
  id: string;
  trtcId: string;
  deviceId: string;
  title: string;
  projectId: string;
  key: string;
}

export type Project = {
  id: string;
  title: string;
  address: string;
  // owner_user_id: string;
}

export type Project_Board = {
  id: string;
  key: string;
  title: string;
  address: string;
  create_date: string;
  owner_user_id: string;
  owner_first_name: string;
  owner_last_name: string;
  company_id: string;
  company_name: string;
  status: boolean;
}

export type Member = {
  id: string;
  key: string;
  name: string;
  team: string;
  society: string;
  helmetNumber: string;
  phoneNumber: string;
  email: string;
  company_id: number;
  project_id: number;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone_number: string;
  company_id: string;
};

export type Notification = {
  title: string;
  content: string;
  show: boolean;
};

export type Sound_Notification = {
  title: string;
  content: string;
  show: boolean;
};

export type Media = {
  id: number;
  title: string;
  name: string;
  date: string;
  duration: string;
  checked: boolean;
  url: string;
  type: string;
  content: string[];
};

export type Report = {
  id: number;
  title: string;
  content: string[];
  date: string;
  name: string;
  status: boolean;
  url: string;
};

export type ShareFile = {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

export type File = {
  name: string;
  size: number;
  type: string;
  filepath: string;
};

export type MyLocation = {
  lat: number,
  lng: number
}

export type OtherUserLocation = {
  id: number,
  first_name: string,
  last_name: string,
  email: string
  phone_number: string,
  location_lat: number,
  location_lng: number
}

export const emptyReport = {
  id: -1,
  name: "",
  title: "",
  content: [],
  date: "",
  url: "",
  status: false
}

export interface AppState {
  locations: Helmet[];
  selectedLocations: Helmet[];
  shareFile: ShareFile[];
  myLocation: MyLocation;
  otherUserLocations: OtherUserLocation[];
  project: Project[];
  project_board: Project_Board[];
  members: Member[];
  visibleChatBox: boolean;
  visibleFileBox: boolean;
  visibleProjectDelete: boolean;
  user: User;
  token: string;
  loginStatus: string;
  addProjectStatus: string;
  signupStatus: string;
  notification: Notification;
  soundnotification: Sound_Notification;
  selectedHelmet: Helmet;
  medias: Media[];
  reports: Report[];
  mediaFilter: { checked: string, type: string };
  visibleDetailModal: boolean;
  selectedMedia: Media;
  selectedReport: Report;
  search: string;
  visibleAddReportModal: boolean;
  order: string;
  page: number;
  itemCount: number;
  pageSize: number;
  isDeleting: boolean;
  isDownloading: boolean;
}

export const initialState: AppState = {
  locations: [],
  selectedLocations: [],
  shareFile: [],
  myLocation: { lat: 35, lng: 139 },
  otherUserLocations: [],
  project: [],
  project_board: [],
  members: [],
  visibleChatBox: false,
  visibleFileBox: false,
  visibleProjectDelete: false,
  user: JSON.parse(localStorage.getItem('user')!),
  token: localStorage.getItem('token') || "",
  loginStatus: "",
  addProjectStatus: "",
  signupStatus: "",
  notification: {
    title: "",
    content: "",
    show: false
  },
  soundnotification: {
    title: "",
    content: "",
    show: false
  },
  selectedHelmet: {
    location: {
      lat: 0,
      lng: 0
    },
    id: '',
    trtcId: '',
    deviceId: '',
    title: '',
    projectId: '',
    key: '',
  },
  medias: [],
  reports: [],
  mediaFilter: { checked: "unchecked", type: "all" },
  visibleDetailModal: false,
  selectedMedia: {
    id: 1,
    title: "4ゲート進捗確認",
    date: "2021/12/26 14:12",
    name: "木村 智樹",
    duration: "15:32",
    checked: true,
    url: "1970-01-01_12-02-22.mp4",
    type: "video",
    content: []
  },
  selectedReport: emptyReport,
  search: "",
  visibleAddReportModal: false,
  order: "new",
  page: 1,
  itemCount: 1,
  pageSize: 8,
  isDeleting: false,
  isDownloading: false,
};

export const appReducer = (state: AppState = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case Action.SET_LOCATION: {
      return { ...state, locations: action.payload };
    }

    case Action.SET_SELECTED_LOCATIONS: {
      return { ...state, selectedLocations: action.payload };
    }

    case Action.SET_SHARE_FILE: {
      return { ...state, shareFile: action.payload }
    }

    case Action.SET_MY_LOCATION: {
      return { ...state, myLocation: action.payload }
    }

    case Action.SET_OTHER_USER_LOCATIONS: {
      return { ...state, otherUserLocations: action.payload }
    }

    case Action.SET_PROJECT: {
      return { ...state, members: action.payload };
    }

    case Action.SET_PROJECT_BOARD: {
      return { ...state, project_board: action.payload }
    }

    case Action.SET_VISIBLECHATBOX: {
      return { ...state, visibleChatBox: action.payload };
    }

    case Action.SET_VISIBLEFILEBOX: {
      return { ...state, visibleFileBox: action.payload };
    }

    case Action.SET_VISIBLEDELETE: {
      return { ...state, visibleProjectDelete: action.payload };
    }

    case Action.SET_TOKEN: {
      return { ...state, token: action.payload };
    }

    case Action.SET_USER: {
      return { ...state, user: action.payload };
    }

    case Action.SET_LOGINSTATUS: {
      return { ...state, loginStatus: action.payload };
    }

    case Action.SET_SIGNUPSTATUS: {
      return { ...state, signupStatus: action.payload };
    }

    case Action.SET_NOTIFICATION: {
      return { ...state, notification: action.payload };
    }

    case Action.SET_SOUND_NOTIFICATION: {
      return { ...state, soundnotification: action.payload };
    }

    case Action.SET_SELECTEDHELMET: {
      return { ...state, selectedHelmet: action.payload };
    }

    case Action.SET_MEDIAS: {
      return { ...state, medias: action.payload };
    }

    case Action.TOGGLE_MEDIA_CHECKED: {
      let new_medias = state.medias;

      new_medias.map(media => {
        if (media.id === action.payload) media.checked = !media.checked;
      });

      return { ...state, vidoes: new_medias };
    }

    case Action.SET_MEDIA_FILTER: {
      let newFilter = state.mediaFilter;

      if (action.payload.checked) newFilter.checked = action.payload.checked;
      if (action.payload.type) newFilter.type = action.payload.type;

      return { ...state, mediaFilter: newFilter };
    }

    case Action.SET_VISIBLE_DETAIL_MODAL: {
      return { ...state, visibleDetailModal: action.payload };
    }

    case Action.SET_SELECTED_MEDIA: {
      const selectedMedia = state.medias.filter(media => media.id === action.payload);

      return { ...state, selectedMedia: selectedMedia[0] };
    }

    case Action.SET_REPORTS: {
      return { ...state, reports: action.payload };
    }

    case Action.SET_REPORT_FILTER: {
      let newFilter = state.mediaFilter;

      if (action.payload.checked) newFilter.checked = action.payload.checked;
      if (action.payload.type) newFilter.type = action.payload.type;

      return { ...state, mediaFilter: newFilter };
    }

    case Action.SET_VISIBLE_DETAIL_MODAL: {
      return { ...state, visibleDetailModal: action.payload };
    }

    case Action.SET_SELECTED_REPORT: {
      const selectedReport = state.reports.filter(report => report.url === action.payload);

      return { ...state, selectedReport: selectedReport.length ? selectedReport[0] : emptyReport };
    }

    case Action.SET_SEARCH: {
      return { ...state, search: action.payload };
    }

    case Action.SET_ADDREPORTMODAL: {
      return { ...state, visibleAddReportModal: action.payload };
    }

    case Action.ADD_MEDIA: {
      let newMedias = state.medias;
      newMedias.push(action.payload);

      return { ...state, medias: newMedias };
    }

    case Action.SET_ORDER: {
      return { ...state, order: action.payload }
    }

    case Action.SET_PAGE: {
      return { ...state, page: action.payload }
    }

    case Action.SET_ITEM_COUNT: {
      return { ...state, itemCount: action.payload }
    }

    case Action.SET_PAGE_SIZE: {
      return { ...state, pageSize: action.payload }
    }

    case Action.SET_IS_DELETING: {
      return { ...state, isDeleting: action.payload }
    }

    case Action.SET_IS_DOWNLOADING: {
      return { ...state, isDownloading: action.payload }
    }

    default:
      return state;
  }
};
