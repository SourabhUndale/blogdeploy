import useDataFetch from './useDataFetch';

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
  return useDataFetch('https://base.groupgodown.com/api/Category', []);
};

export const useApplicationTypes = () => {
  return useDataFetch('https://base.groupgodown.com/api/Application', []);
};

export const useGroups = () => {
  return useDataFetch('https://base.groupgodown.com/api/Group/id/Groups', []);
};
