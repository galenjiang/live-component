const agentList = [{
  name: '全部',
  value: 'all',
}, {
  name: 'web',
  value: 'web',
}, {
  name: '移动端',
  value: 'mobile',
}, {
  name: 'IOS',
  value: 'ios',
}, {
  name: '安卓',
  value: 'andriod',
}];
const detectionList = [{
  name: '曝光',
  value: 'view',
}, {
  name: '点击',
  value: 'click',
}];

export default {
  monitor: {
    agentList,
    detectionList,
  },
};
