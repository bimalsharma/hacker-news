import http from "../http-common";

const getAll = (params) => {
  return http.get("/search", { params });
};

const TutorialService = {
  getAll,
};

export default TutorialService;
