import {
  Helmet,
  Member,
  User,
  Notification,
  Sound_Notification,
  Media,
  Report,
  Project,
  Project_Board,
  OtherUserLocation,
  MyLocation,
  File,
  ShareFile
} from "./reducer";
import axios from "axios";
import { async } from "@firebase/util";

export enum Action {
  SET_LOCATION = 'SET_LOCATION',
  SET_SELECTED_LOCATIONS = 'SET_SELECTED_LOCATIONS',
  SET_SHARE_FILE = 'SET_SHARE_FILE',
  SET_MY_LOCATION = 'SET_MY_LOCATION',
  SET_FILE = 'SET_FILE',
  SET_OTHER_USER_LOCATIONS = 'SET_OTHER_USER_LOCATIONS',
  SET_PROJECT = 'SET_PROJECT',
  SET_PROJECT_BOARD = 'SET_PROJECT_BOARD',
  SET_VISIBLECHATBOX = 'SET_VISIBLECHATBOX',
  SET_VISIBLEFILEBOX = 'SET_VISIBLEFILEBOX',
  SET_VISIBLEDELETE = 'SET_VISIBLEDELETE',
  SET_TOKEN = 'SET_TOKEN',
  SET_USER = 'SET_USER',
  SET_PRO = 'SET_PRO',
  SET_AUTHSTATUS = 'SET_AUTHSTATUS',
  SET_LOGINSTATUS = 'SET_LOGINSTATUS',
  SET_SIGNUPSTATUS = 'SET_SIGNUPSTATUS',
  SET_ADDPROJECTSTATUS = 'SET_ADDPROJECTSTATUS',
  SET_SELECTED_PROJECT = 'SET_SELECTED_PROJECT',
  SET_NOTIFICATION = 'SET_NOTIFICATION',
  SET_SOUND_NOTIFICATION = 'SET_SOUND_NOTIFICATION',
  SET_SELECTEDHELMET = 'SET_SELECTEDHELMET',
  SET_MEDIAS = 'SET_MEDIAS',
  TOGGLE_MEDIA_CHECKED = 'TOGGLE_MEDIA_CHECKED',
  SET_MEDIA_FILTER = 'SET_MEDIA_FILTER',
  SET_VISIBLE_DETAIL_MODAL = 'SET_VISIBLE_DETAIL_MODAL',
  SET_SELECTED_MEDIA = 'SET_SELECTED_MEDIA',
  SET_REPORTS = 'SET_REPORTS',
  SET_REPORT_FILTER = 'SET_REPORT_FILTER',
  SET_SELECTED_REPORT = 'SET_SELECTED_REPORT',
  SET_SEARCH = 'SET_SEARCH',
  SET_COMPANY_ID = 'SET_COMPANY_ID',
  SET_ADDREPORTMODAL = 'SET_ADDREPORTMODAL',
  ADD_MEDIA = 'ADD_MEDIA',
  SET_ORDER = 'SET_ORDER',
  SET_PAGE = 'SET_PAGE',
  SET_ITEM_COUNT = 'SET_ITEM_COUNT',
  SET_PAGE_SIZE = 'SET_PAGE_SIZE',
  SET_IS_DELETING = 'SET_IS_DELETING',
  SET_IS_DOWNLOADING = 'SET_IS_DOWNLOADING',
}

const API_URL = process.env.API_URL;

export const setLocations = (locations: Helmet[]) => ({
  type: Action.SET_LOCATION,
  payload: locations,
});

export const setSelectedLocations = (locations: Helmet[]) => ({
  type: Action.SET_SELECTED_LOCATIONS,
  payload: locations,
});

export const setMyLocation = (myLocation: MyLocation) => ({
  type: Action.SET_MY_LOCATION,
  payload: myLocation
});

export const setFile = (file: File[]) => ({
  type: Action.SET_FILE,
  payload: file
});

export const setOtherUserLocations = (otherUserLocations: OtherUserLocation[]) => ({
  type: Action.SET_OTHER_USER_LOCATIONS,
  payload: otherUserLocations
})

export const setProjects = (projects: Member[]) => ({
  type: Action.SET_PROJECT,
  payload: projects,
});

export const setProjectBoard = (project_boards: Project_Board[]) => ({
  type: Action.SET_PROJECT_BOARD,
  payload: project_boards,
});

export const handleChatBox = (visible: boolean) => ({
  type: Action.SET_VISIBLECHATBOX,
  payload: visible,
});

export const handleFileBox = (visible: boolean) => ({
  type: Action.SET_VISIBLEFILEBOX,
  payload: visible,
});

export const projectDelete = (visible: boolean) => ({
  type: Action.SET_VISIBLEDELETE,
  payload: visible,
});

export const setToken = (token: string) => ({
  type: Action.SET_TOKEN,
  payload: token,
});

export const setUser = (user: User) => ({
  type: Action.SET_USER,
  payload: user,
});

export const setPro = (project: Project) => ({
  type: Action.SET_PRO,
  payload: project,
});

export const setLoginStatus = (status: string) => ({
  type: Action.SET_LOGINSTATUS,
  payload: status,
});

export const setSignupStatus = (status: string) => ({
  type: Action.SET_SIGNUPSTATUS,
  payload: status,
});

export const setAddProjectStatus = (status: string) => ({
  type: Action.SET_ADDPROJECTSTATUS,
  payload: status,
});

export const handleNotification = (notification: Notification) => ({
  type: Action.SET_NOTIFICATION,
  payload: notification,
});

export const handleSoundNotification = (soundnotification: Sound_Notification) => ({
  type: Action.SET_SOUND_NOTIFICATION,
  payload: soundnotification,
});

export const setSelectedHelmet = (helmet: Helmet) => ({
  type: Action.SET_SELECTEDHELMET,
  payload: helmet,
});

export const setShareFile = (shareFile: ShareFile[]) => ({
  type: Action.SET_SHARE_FILE,
  payload: shareFile,
});

export const login = (user: { email: string, password: string, code: string }) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/api/login`, user)

      if (res.data.success) {
        dispatch(setToken(res.data.token));
        localStorage.setItem('token', res.data.token);

        const newUser = {
          id: res.data.user.dataValues.id,
          first_name: res.data.user.dataValues.first_name,
          last_name: res.data.user.dataValues.last_name,
          email: res.data.user.dataValues.email,
          company: res.data.user.dataValues.company,
          company_id: res.data.user.dataValues.company_id,
          phone_number: res.data.user.dataValues.phone_number,
          privilege: res.data.user.dataValues.privilege
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        dispatch(setUser(newUser));

        dispatch(setLoginStatus("success"));
      } else {
        if (res.data.message === "User not found") dispatch(setLoginStatus('無効なユーザー名!'));
        else dispatch(setLoginStatus('無効なパスワードです!'));
      }
    } catch (e) {
      console.log(e, 'error');

      dispatch(setLoginStatus('内部サーバーエラー!'));
    }
  };
};

export const signup = (user: { email: string, password: string, company: string, first_name: string, last_name: string, phone_number: string }) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/api/signup`, user);

      if (res.data.success) dispatch(setSignupStatus("success"));
      else if (res.data.message === "Email already exists") dispatch(setSignupStatus("既存のメール！"));
    } catch (e) {
      console.log(e, 'error');

      dispatch(setSignupStatus('内部サーバーエラー!'));
    }
  };
};

export const getFile = (token: string, helmet_id: number) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/helmet/${helmet_id}/share`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        dispatch(setFile(res.data.data));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  }
}

export const addFile = (file: File, helmet_id: number, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/api/helmet/${helmet_id}/share`, file, { headers: { 'x-access-token': token } });

      if (res.data.success) dispatch(getFile(token, helmet_id));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const addProject = (project: Project, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/api/project`, project, { headers: { 'x-access-token': token } });

      if (res.data.success) dispatch(setAddProjectStatus(token));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const getProjectBoard = (company_id: string, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/company/${company_id}`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        let project_boards: Project_Board[] = [];
        res.data.data.projects.map((el: any) => {
          const projects_boards = { key: el.id, id: el.id, title: el.title, address: el.address, create_date: el.createdAt, owner_user_id: el.owner_user_id, owner_first_name: el.user.first_name, owner_last_name: el.user.last_name, company_id: el.company_id, company_name: el.company_name, status: false };
          project_boards.push(projects_boards);
        });
        dispatch(setProjectBoard(project_boards));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const removePorject = (id: string, token: string, company_id: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.delete(`${API_URL}/api/project/${id}`, { headers: { 'x-access-token': token } });

      if (res.data.success) dispatch(getProjectBoard(company_id, token));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const downloadProject = (id: string, token: string, company_id: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/project/download/${id}`, { headers: { 'x-access-token': token } })

      if (res.data.success) dispatch(getProjectBoard(company_id, token));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const setSelectProject = (id: number) => ({
  type: Action.SET_SELECTED_PROJECT,
  payload: id,
});

export const addMember = (member: Member, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/api/helmet`, member);

      if (res.data.success) dispatch(getProjects(member.company_id, token));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const editMember = (member: Member, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.patch(`${API_URL}/api/helmet/${member.id}`, member);

      if (res.data.success) dispatch(getProjects(member.company_id, token));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const removeMember = (member: Member, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.delete(`${API_URL}/api/helmet/${member.id}`);

      if (res.data.success) dispatch(getProjects(member.company_id, token));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const logout = () => {
  localStorage.clear();

  location.href = "/";
};

export const getLocations = (company_id: string, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/helmet?company_id=${company_id}`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        let locations: Helmet[] = [];

        res.data.data.map((el: any, index: number) => {
          if (el.trtc_id && el.is_online) {
            const location = { location: { lat: el.location_lat, lng: el.location_lng }, title: el.name, projectId: el.project_id, trtcId: el.trtc_id, key: el.id, id: el.id, name: el.name, deviceId: el.device_id, parentId: 2 };

            locations.push(location);
          }
        });

        dispatch(setLocations(locations));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const getShareFile = (helmet_id: string, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/helmet/${helmet_id}/share`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        dispatch(setShareFile(res.data.data));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const getOtherUserLocations = (token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/location`, { headers: { 'x-access-token': token } })
      if (res.data.success) {
        const otherUserLocations: OtherUserLocation[] = res.data.data as OtherUserLocation[];
        dispatch(setOtherUserLocations(otherUserLocations))
      }
    } catch (e) {
      console.log(e, 'error')
    }
  }
}

export const updateMyLocation = (token: string, location_lat: number, location_lng: number) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      await axios.post(`${API_URL}/api/location`,
        { location_lat: location_lat, location_lng: location_lng },
        { headers: { 'x-access-token': token } })
      dispatch(setMyLocation({ lat: location_lat, lng: location_lng }))
    } catch (e) {
      console.log(e, 'error')
    }
  }
}

export const getProjects = (company_id: number, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.get(`${API_URL}/api/helmet?company_id=${company_id}`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        let projects: Member[] = [];

        res.data.data.map((el: any) => {
          const project = { key: el.id, id: el.id, name: el.name, team: el.team || '', society: el.Company.name || '', helmetNumber: el.helmet_number || '', phoneNumber: el.phone_number || '', email: el.email, project_id: el.project_id, company_id: el.company_id };

          projects.push(project);
        });

        dispatch(setProjects(projects));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const getMedias = (token: string, project_id: number, filter: any) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const params = filter ? `?from=${filter.from}&to=${filter.to}` : '';
      const res = await axios.get(`${API_URL}/api/media/${project_id}${params}`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        dispatch(setMedias(res.data.data));
        dispatch(setIsDeleting(false));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const setMedias = (medias: Media[]) => ({
  type: Action.SET_MEDIAS,
  payload: medias,
});

export const setIsDeleting = (isDeleting: boolean) => ({
  type: Action.SET_IS_DELETING,
  payload: isDeleting,
});

export const deleteMedia = (path: string, token: string, project_id: number, showMessage: () => void) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.delete(`${API_URL}/api/media/${project_id}/${path}`, { headers: { 'x-access-token': token } });
      if (res.status === 200) {
        dispatch(getMedias(token, project_id, null));
        showMessage();
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const setIsDownloading = (isDownloading: boolean) => ({
  type: Action.SET_IS_DOWNLOADING,
  payload: isDownloading,
});

const downloadAction = (downloadItem: any, name: string) => {
  // 取得したデータをバイナリデータに変換してダウンロードする
  const fileUrl = window.URL.createObjectURL(new Blob([downloadItem]))
  const virtualElement = document.createElement("a");
  virtualElement.href = fileUrl;
  virtualElement.setAttribute("download", name);
  document.body.appendChild(virtualElement);
  virtualElement.click();
}

export const downloadMedias = (path: string, project_id: number, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      dispatch(setIsDownloading(true));
      const res = await axios.get(
        `${API_URL}/api/media/download/${project_id}/${path}`,
        {
          headers: { 'x-access-token': token },
          responseType: "arraybuffer"
        }
      );
      if (res.status === 200) {
        downloadAction(res.data, path);
        dispatch(getMedias(token, project_id, null));
        dispatch(setIsDownloading(false));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const getReports = (token: string, project_id: number, filter: any) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const params = filter ? `?from=${filter.from}&to=${filter.to}` : '';
      const res = await axios.get(`${API_URL}/api/report/${project_id}${params}`, { headers: { 'x-access-token': token } });

      if (res.data.success) {
        dispatch(setReports(res.data.data));
        dispatch(setIsDeleting(false));
      }

    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const addReport = (report: Report, project_id: number, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.post(`${API_URL}/api/report/${project_id}`, report, { headers: { 'x-access-token': token } });

      if (res.data.success) dispatch(getReports(token, project_id, null));
      else {
        console.log(res.data.message);
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const setReports = (report: Report[]) => ({
  type: Action.SET_REPORTS,
  payload: report,
});

export const deleteReport = (path: string, project_id: number, token: string, showMessage: () => void) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      const res = await axios.delete(`${API_URL}/api/report/${project_id}/${path}`, { headers: { 'x-access-token': token } });
      if (res.status === 200) {
        dispatch(getReports(token, project_id, null));
        showMessage();
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};

export const downloadReports = (path: string, project_id: number, token: string) => {
  return async (dispatch: (arg0: any) => void) => {
    try {
      dispatch(setIsDownloading(true));
      const res = await axios.get(
        `${API_URL}/api/report/download/${project_id}/${path}`,
        {
          headers: { 'x-access-token': token },
          responseType: "arraybuffer"
        }
      );
      if (res.status === 200) {
        downloadAction(res.data, path);
        dispatch(getReports(token, project_id, null));
        dispatch(setIsDownloading(false));
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };
};


export const toggleVideoChecked = (index: number) => ({
  type: Action.TOGGLE_MEDIA_CHECKED,
  payload: index,
});

export const setMediaFilter = (filter: any) => ({
  type: Action.SET_MEDIA_FILTER,
  payload: filter,
});

export const setReportFilter = (filter: any) => ({
  type: Action.SET_REPORT_FILTER,
  payload: filter,
});

export const setVisibleDetailModal = (value: boolean) => ({
  type: Action.SET_VISIBLE_DETAIL_MODAL,
  payload: value,
});

export const setSelectedMedia = (id: number) => ({
  type: Action.SET_SELECTED_MEDIA,
  payload: id,
});

export const setSelectedReport = (url: string) => ({
  type: Action.SET_SELECTED_REPORT,
  payload: url,
});

export const setSearch = (search: string) => ({
  type: Action.SET_SEARCH,
  payload: search,
});

export const setCompanyID = (company_id: string) => ({
  type: Action.SET_COMPANY_ID,
  payload: company_id,
});

export const setVisibleAddReportModal = (visible: boolean) => ({
  type: Action.SET_ADDREPORTMODAL,
  payload: visible,
});

export const addMedia = (media: Media) => ({
  type: Action.ADD_MEDIA,
  payload: media,
});

export const setOrder = (order: string) => ({
  type: Action.SET_ORDER,
  payload: order,
})

export const setPage = (page: number) => ({
  type: Action.SET_PAGE,
  payload: page,
})

export const setItemCount = (itemCount: number) => ({
  type: Action.SET_ITEM_COUNT,
  payload: itemCount,
})

export const setPageSize = (pageSize: number) => ({
  type: Action.SET_PAGE_SIZE,
  payload: pageSize,
})
