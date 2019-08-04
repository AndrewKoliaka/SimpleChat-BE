const request = require('supertest');

const { host, port, apiPrefix } = require('../src/config/config.json');

const HOST = `${host}:${port}`;
const TEST_USER = {
    email: 'TEST@TEST.com',
    name: 'TEST',
    password: 'TEST1'
};

export function registerTestUser () {
    return request(HOST)
        .post(`${apiPrefix}/users/register`)
        .send(TEST_USER)
        .expect(201);
}

export function removeTestUser (userId, token) {
    return request(HOST)
        .delete(`${apiPrefix}/users/${userId}`)
        .set('Cookie', [`token=${token}`])
        .expect(204);
}
