import { OwnUserProfile } from "../Types/interfaces";
const useCookie = () => {
  const setCookie = (name: string, value: OwnUserProfile, days = 1) => {
    //e tarkoittaa nollien määrää lopussa. 864e5 on 86400000
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      JSON.stringify(value)
    )};expires=${expires};path=/;secure;samesite=strict`;
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : null;
    }
  };

  const clearCookie = (name: string) => {
    document.cookie = `${name}=;xepires=Thu, 01 jan 1970 00:00:00 GTML;path=/;secure;samesite=strict`;
  };
  return { setCookie, getCookie, clearCookie };
};

export default useCookie;
