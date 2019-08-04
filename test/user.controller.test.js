const request = require('supertest');
const expect = require('chai').expect;

const { host, port, apiPrefix } = require('../src/config/config.json');
const { decode } = require('../src/utils/jwt');
const { USER_EXISTS, USER_NOT_FOUND } = require('../src/constants/infoMessages.constant');

const HOST = `${host}:${port}`;

const TEST_USER = {
    email: 'TEST@TEST.com',
    name: 'TEST',
    password: 'TEST1'
};

const BLOCK_USER_ID = '5cfebba2fcc260027aac2182';

let token,
    tokenData;

describe('user.controller integration tests', () => {
    describe('POST : /users/register', () => {
        it('should register a new user', done => {
            request(HOST)
                .post(`${apiPrefix}/users/register`)
                .send(TEST_USER)
                .expect(201)
                .end(done);
        });

        it('should not register a user if one with the same email already exists', done => {
            request(HOST)
                .post(`${apiPrefix}/users/register`)
                .send(TEST_USER)
                .expect(409)
                .expect(res => {
                    const { info } = res.body;

                    expect(info).to.eql(USER_EXISTS);
                })
                .end(done);
        });
    });

    describe('POST : /users/login', () => {
        it('should login user', done => {
            request(HOST)
                .post(`${apiPrefix}/users/login`)
                .send(TEST_USER)
                .expect(200)
                .expect(res => {
                    token = res.text;
                    tokenData = decode(token);

                    expect(tokenData).to.have.all.keys('header', 'payload', 'signature');
                })
                .end(err => err ? done(err) : done());
        });

        it('should return 404 if user not found', done => {
            const NOT_EXISTING_USER = {
                email: undefined,
                password: undefined
            };

            request(HOST)
                .post(`${apiPrefix}/users/login`)
                .send(NOT_EXISTING_USER)
                .expect(404)
                .expect(res => {
                    const { info } = res.body;

                    expect(info).to.eql(USER_NOT_FOUND);
                })
                .end(done);
        });
    });

    describe('GET : /users', () => {
        it('should return users list',  done => {
            request(HOST)
                .get(`${apiPrefix}/users`)
                .set('Cookie', [`token=${token}`])
                .expect(200)
                .expect(res => {
                    const { data } = res.body;

                    expect(data).to.have.all.keys('userList', 'banList');
                    expect(data.userList).to.be.an('array');
                    expect(data.banList).to.be.an('array');
                })
                .end(done);
        });
    });

    describe('PUT : /users/:id', () => {
        it('should update the user', done => {
            request(HOST)
                .put(`${apiPrefix}/users/${tokenData.payload.id}`)
                .set('Cookie', [`token=${token}`])
                .send({ name: 'NEW_NAME'})
                .expect(204)
                .end(done);
        });
    });

    describe('PUT : /users/:id/block', () => {
        it('should block user', done => {
            request(HOST)
                .put(`${apiPrefix}/users/${BLOCK_USER_ID}/block`)
                .set('Cookie', [`token=${token}`])
                .expect(204)
                .end(done);
        });
    });

    describe('PUT : /users/:id/unblock', () => {
        it('should unblock user', done => {
            request(HOST)
                .put(`${apiPrefix}/users/${BLOCK_USER_ID}/unblock`)
                .set('Cookie', [`token=${token}`])
                .expect(204)
                .end(done);
        });
    });

    describe('DELETE : /users/:id', () => {
        it('should remove user', done => {
            request(HOST)
                .delete(`${apiPrefix}/users/${tokenData.payload.id}`)
                .set('Cookie', [`token=${token}`])
                .expect(204)
                .end(done);
        });
    });
});
