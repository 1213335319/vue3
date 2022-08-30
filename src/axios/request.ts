import axios from ".";
// import qs from "qs";

// 主要用于封装基于axios配置的get/post/put/delete等使用方法。
export class request {
  static get = (url: string, params?: any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url, { params: params })
        .then((res: unknown) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };

  static post = (url: string, params?: any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}
