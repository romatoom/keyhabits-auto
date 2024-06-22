async function getShopsCarsTable() {
  return axios.get(`${API_URL}/shops-cars/pivot-table`);
}

export { getShopsCarsTable };
