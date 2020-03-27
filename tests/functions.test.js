const functions = require('./functions');

test('Adds 2 + 2 to equal 4', () => {
  expect(functions.add(2,2)).toBe(4); // toBe is called a matcher
})

test('Admin should be in usernames', () => {
  usernames = ['john', 'joe', 'admin'];
  expect(usernames).toContain('admin');
})

test('Game should be California', async () => {
  expect.assertions(1);
  const destName = 'California';
  const destId = '5e5bc92240094f758eaaebfe';
  
  const data = await functions.fetchGame(destId);
  expect(data.name).toEqual(destName);
})