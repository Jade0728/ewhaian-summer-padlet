import { axiosInstance } from "./../lib/axios.js";

const api = axiosInstance;

//인터셉터: 로그인 정보 전달
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 서버의 _id -> id 매핑을 표준화
const normalize = (doc) => {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { id: _id ?? doc.id, ...rest };
};

export const getQuestions = async () => {
  const { data } = await axiosInstance.get("/questions"); // baseURL = .../api
  const list =
    (Array.isArray(data) && data) ||
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data?.results) && data.results) ||
    (Array.isArray(data?.questions) && data.questions) ||
    [];

  return list.map(normalize);
};

export const createQuestionAPI = async ({ title, content }) => {
  const { data } = await axiosInstance.post("/questions", { title, content });
  return normalize(data);
};

export const updateQuestionAPI = async ({ id, title, content }) => {
  const { data } = await axiosInstance.patch(`/questions/${id}`, { title, content });
  return normalize(data);
};

export const deleteQuestionAPI = async (id) => {
  await axiosInstance.delete(`/questions/${id}`);
  return true;
};

export const toggleLikeAPI = async (id) => {
  const { data } = await axiosInstance.post(`/questions/${id}/like`);
  return normalize(data);
};