async function getPivotTable() {
  return axios.get(`${API_URL}/pivot-table`);
}

export { getPivotTable };
