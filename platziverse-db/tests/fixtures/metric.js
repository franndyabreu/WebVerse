"use strict";

const metric = {
  id: 1,
  type: "memory",
  value: "705",
  uuid: "xxx",
  createdAt: new Date(),
  updatedAt: new Date()
};

const metrics = [
  metric,
  extendObj(metric, { id: 2, type: "cpu", uuid: "yyy" }),
  extendObj(metric, { id: 3, type: "memory", value: "200", uuid: "yyy" }),
  extendObj(metric, { id: 4, type: "memory", value: "300", uuid: "zzz" }),
  extendObj(metric, { id: 5, type: "cpu", value: "100", uuid: "xxx" }),
  extendObj(metric, { id: 6, type: "cpu", value: "400", uuid: "yyy" }),
  extendObj(metric, { id: 7, type: "cpu", value: "250", uuid: "xxx" })
];

function extendObj(obj, values) {
  const clone = Object.assign({}, obj);
  return Object.assign(clone, values);
}

module.exports = {
  single: metric,
  all: metrics,
  findByAgentUuid: uuid => {
    let result = new Set();
    result.add(metrics.filter(m => m.uuid === uuid).map(m => m.type));
    return result;
  },

  findByTypeAgentUuid: (type, uuid) => {
    let result = metrics.filter(m => m.type === type && m.uuid === uuid);
    return result.sort((a, b) => a.createdAt - b.createdAt);
  }
};
