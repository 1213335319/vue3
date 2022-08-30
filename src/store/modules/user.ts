import userApis from "@/axios/userApi";
import User from "@/entities/user";
import { cookies } from "@/utils/storage";

const TOKEN_KEY = "App.user.token";

export interface UserState {
  token: string;
  user: User | null;
}

const user = {
  state: () => ({
    token: "",
    user: null,
  }),

  mutations: {
    SET_TOKEN: (state: UserState, token: string) => {
      state.token = token;
      cookies.set(TOKEN_KEY, token);
    },
    SET_USER: (state: UserState, user: User | null) => {
      state.user = user;
    },
  },

  actions: {
    login(
      context: { commit: (arg0: string, arg1: string | User | null) => void },
      data: any
    ): Promise<User | null> {
      return new Promise((resolve, reject) => {
        console.log("store login : ", data);
        userApis
          .login(data)
          .then((user: User) => {
            context.commit("SET_TOKEN", user.token || "");
            context.commit("SET_USER", user);
            resolve(user);
          })
          .catch((error: any) => {
            context.commit("SET_TOKEN", "");
            context.commit("SET_USER", null);
            reject(error);
          });
      });
    },
  },
};

export default user;
