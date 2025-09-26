import useDataFetch from './useDataFetch';
import link from "../../../link.json";

const obaseUri = JSON.parse(JSON.stringify(link));
export const baseUri = obaseUri.DefaultbaseUri;


export const useCountries = () => {
  return useDataFetch(
    'https://geodata.phplift.net/api/index.php?type=getCountries',
    []
  );
};

export const useLanguages = () => {
  return useDataFetch('./src/assets/lang.json', []);
};

export const useCategories = () => {
  return useDataFetch(`${baseUri}api/Category`, []);
};

export const useApplicationTypes = () => {
  return useDataFetch(`${baseUri}api/Application`, []);
};

export const useGroups = () => {
  return useDataFetch(`${baseUri}api/Group/id/Groups`, []);
};
