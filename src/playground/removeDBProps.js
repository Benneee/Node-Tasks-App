function removeDBProps(obj) {
  if (!obj) {
    return;
  } else {
    const keys = Object.keys(obj);
    const wantedKeys = keys.filter(key => key !== "_id" && key !== "__v");
    return wantedKeys;
  }
}

module.exports = removeDBProps;
