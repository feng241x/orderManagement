import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { getInfo, myAxios } from "@/api";
import { removeToken, setToken } from "@/utils";
import router from "next/router";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state: any, action: any) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state: any, action: any) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state: any) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state: string, action: any) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props: any) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let token = "";

    try {
      token = localStorage.getItem("token") || "";
    } catch (err) {
      console.error(err);
    }

    if (token) {
      // 获取当前用户信息
      const userData: any = await getInfo();
      if (userData) {
        const userInfo = userData?.userInfo;
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: userInfo,
        });
      } else {
        signOut();
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (username: string, password: string) => {
    // 登录接口逻辑
    return myAxios
      .post("/login", {
        username,
        password,
      })
      .then(async (token: any) => {
        if (!token) return;
        setToken(token);
        // 获取当前用户信息
        const userData: any = await getInfo();
        const user = userData["userInfo"];
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user,
        });
        router.push("/orderManagement");
        return true;
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const signUp = () => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    removeToken();
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
