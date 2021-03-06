import { DemoProject } from '../src';

test('Demo Project', () => {
  const project = new DemoProject({
    name: 'test',
    cdkVersion: '1.80.0',
    defaultReleaseBranch: 'main',
  });

  expect(project.cdkVersion).toEqual('^1.80.0');
  expect(project.srcdir).toEqual('src');
  expect(project.libdir).toEqual('lib');
});