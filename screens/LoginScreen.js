import { useContext, useState } from "react";
import { Alert } from "react-native";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/UI/LoadingOverlay";

import { login } from "../firebase/auth";
import { AuthContext } from "../store/auth-context";

export default function LoginScreen() {
  const authCtx = useContext(AuthContext);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { token, userID } = await login(email, password);
      authCtx.authenticate(token, userID);
    } catch (error) {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="로그인 중입니다..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}
