export function setCookie(name: string, value: any, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  if (typeof document !== "undefined") {
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
}
export function deleteCookie(name: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  if (typeof document !== "undefined") {
    document.cookie = name + "=" + expires + "; path=/";
  }
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const cookies =
    typeof document !== "undefined" ? document.cookie.split(";") : [];

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(nameEQ)) {
      return trimmedCookie.substring(nameEQ.length);
    }
  }
  return null;
}

// setCookie("user_email","bobthegreat@gmail.com",30); //set "user_email" cookie, expires in 30 days
// const userID=getCookie("uuid");//"jbjkbkbjh

export const helper = {
  toCurrency: (val: number, currency = "$") => {
    if (!val) return `${currency} 0.0`;
    return currency + val?.toFixed(2)?.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  },
};
