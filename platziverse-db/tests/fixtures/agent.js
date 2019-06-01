"use strict";

const agent = {
  id: 1,
  uuid: "yyy-yyy-yyy",
  name: "fixture",
  username: "franndy",
  hostname: "test-host",
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const agents = [
  agent,
  extendObj(agent, {
    id: 2,
    uuid: "TTT-TTT-TTT",
    connected: false,
    username: "test"
  }),
  extendObj(agent, {
    id: 3,
    uuid: "TTT-TTF-TTT"
  }),
  extendObj(agent, {
    id: 4,
    uuid: "TTT-TTT-TTZ",
    username: "test"
  })
];

function extendObj(obj, values) {
  const clone = Object.assign({}, obj);
  return Object.assign(clone, values);
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === "platzi"),
  findByUuid: id => agents.filter(({ uuid }) => uuid === id).shift(),
  findById: id => agents.filter(a => a.id === id).shift()
};
