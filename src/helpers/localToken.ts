const TOKEN_KEY = 'token';

const save = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const load = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const remove = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export default {
  load,
  remove,
  save,
};
