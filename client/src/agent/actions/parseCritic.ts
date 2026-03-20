export const parseCritic = (critiqueRaw: string) => {
  try {
    const json = JSON.parse(critiqueRaw);
    return json;
  } catch {
    return { retry: false };
  }
};
