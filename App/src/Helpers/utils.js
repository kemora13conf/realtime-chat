import Cookies from "js-cookie";

export const downloadFile = (_id, filename) => {
  const url = `${import.meta.env.VITE_API}/conversations/Messages-files/${_id}?token=${Cookies.get('jwt')}`;
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
