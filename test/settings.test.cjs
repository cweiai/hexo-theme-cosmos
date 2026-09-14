'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { merge,safeUrl,path,json } = require('../lib/settings.cjs');
test('nested arrays replace defaults, including explicit empty arrays', () => {
  const defaults={navigation:[{route:'home'}],about:{profile:{name:'Default',facts:[{label:'Location',value:'A'}]}}};
  const result=merge(defaults,{navigation:[],about:{profile:{facts:[{label:'Location',value:'B'}]}}});
  assert.deepEqual(result.navigation,[]);
  assert.deepEqual(result.about.profile.facts,[{label:'Location',value:'B'}]);
  assert.equal(result.about.profile.name,'Default');
  assert.equal(defaults.about.profile.facts[0].value,'A');
});
test('unsafe config URLs and prototype keys cannot become executable links', () => {
  for (const value of ['javascript:alert(1)','data:text/html,x','//evil.test','java\nscript:x','/\\evil.test']) assert.equal(safeUrl(value),'');
  for (const value of ['/about/','https://example.org','mailto:hello@example.org','#main']) assert.equal(safeUrl(value),value);
  assert.equal(merge(JSON.parse('{"__proto__":{"polluted":true}}')).polluted,undefined);
});
test('route traversal and script closing sequences are rejected or escaped', () => {
  assert.throws(()=>path('../about'));
  assert.throws(()=>path('https://example.org'));
  assert.equal(path('/notes/'),'notes');
  assert.ok(!json({text:'</script><script>alert(1)</script>'}).includes('<'));
});
