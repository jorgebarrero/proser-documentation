(keyup)='updateFilter($event, rows, originalRows, "inv_agent_name")'
  
  rows;
  originalRows;


this.rows = res;
this.originalRows = res;



updateFilter(event, rows, originalRows, field) {
  const val = event.target.value.toLowerCase();
  const temp = originalRows.filter(function(d) {
    return d[field] ? d[field].toLowerCase().indexOf(val) !== -1 || !val : '';
  });
  this.rows = temp
}

onGetAll() {
  this.rows = this.originalRows;
}
