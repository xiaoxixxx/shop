function groupByPropertyId(arr) {
  let grouped = {};
  arr.forEach(subArray => {
    subArray.forEach(obj => {
      if (!grouped[obj.propertyId]) {
        grouped[obj.propertyId] = [];
      }
      grouped[obj.propertyId].push(obj);
    });
  });
  return grouped;
}

function cartesianProductOfGroups(groups) {
  let keys = Object.keys(groups);
  if (keys.length === 0) return [];

  // 递归函数，用于计算笛卡尔积
  function cartesianProductHelper(index) {
    if (index === keys.length) {
      return [[]]; // 基础情况：当索引超出范围时，返回包含一个空数组的数组
    }

    let currentGroup = groups[keys[index]];
    let results = cartesianProductHelper(index + 1); // 递归调用下一个属性集合

    let combinedResults = [];
    currentGroup.forEach(item => {
      results.forEach(result => {
        combinedResults.push([item].concat(result)); // 将当前项与之前的结果组合
      });
    });

    return combinedResults;
  }

  return cartesianProductHelper(0);
}

export default function generateCombinations(inputArray) {
  let groupedByPropertyId = groupByPropertyId(inputArray);
  return cartesianProductOfGroups(groupedByPropertyId);
}




