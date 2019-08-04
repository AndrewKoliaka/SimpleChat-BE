const request = require('supertest');
const expect = require('chai').expect;

const {host, port, apiPrefix} = require('../src/config/config.json');
const {decode} = require('../src/utils/jwt');
const {registerTestUser, removeTestUser} = require('./testHelper');

const HOST = `${host}:${port}`;
const ROOM_MANDATORY_PROPERTIES = ['_id', 'name', 'participants', 'adminId', 'dateCreated'];

let token,
    tokenData,
    roomId;

describe('room.controller integration tests', () => {
    before(() => registerTestUser()
        .then(res => {
            token = res.text;
            tokenData = decode(token)
        }));

    describe('POST : /rooms', () => {
        it('should create a new room', () => {
            const REQUEST_PAYLOAD = {
                name: 'Test room',
                participants: [tokenData.payload.id, '5d221d0debdff04850ea407e']
            };

            return request(HOST)
                .post(`${apiPrefix}/rooms`)
                .set('Cookie', [`token=${token}`])
                .send(REQUEST_PAYLOAD)
                .expect(201)
                .expect(res => {
                    const {data} = res.body;

                    roomId = data._id;

                    expect(data).to.include.all.keys(ROOM_MANDATORY_PROPERTIES);
                    expect(data.adminId).to.eql(tokenData.payload.id);
                });
        });
    });

    describe('GET : /rooms/:id', () => {
        it('should return room data', () => {
            return request(HOST)
                .get(`${apiPrefix}/rooms/${roomId}`)
                .set('Cookie', [`token=${token}`])
                .expect(200)
                .expect(res => {
                    const {data} = res.body;

                    expect(data).to.include.all.keys(ROOM_MANDATORY_PROPERTIES);
                    expect(data.participants[0]).to.have.keys(['_id', 'name', 'email']);
                });
        });
    });

    describe('GET : /rooms', () => {
        it('should return room list', () => {
            return request(HOST)
                .get(`${apiPrefix}/rooms`)
                .set('Cookie', [`token=${token}`])
                .expect(200)
                .expect(res => {
                    const {data} = res.body;

                    expect(data).to.be.an('array');
                    expect(data[0]).to.include.all.keys(ROOM_MANDATORY_PROPERTIES);
                });
        });
    });

    describe('GET : /rooms/:id/messages', () => {
        it('should return messages array', () => {
            return request(HOST)
                .get(`${apiPrefix}/rooms/${roomId}/messages`)
                .set('Cookie', [`token=${token}`])
                .expect(200)
                .expect(res => {
                    const { data } = res.body;

                    expect(data).to.be.an('array');
                });
        });
    });

    describe('PUT : /rooms/:id', () => {
        it('should update participants and name for room', () => {
            const REQUEST_PAYLOAD = {
                name: 'NEW_ROOM_NAME',
                participants: [tokenData.payload.id, '5d221d0debdff04850ea407e', '5d221d0debdff04850ea407b']
            };

            return request(HOST)
                .put(`${apiPrefix}/rooms/${roomId}`)
                .set('Cookie', [`token=${token}`])
                .send(REQUEST_PAYLOAD)
                .expect(204);
        });
    });

    describe('PUT : /rooms/:id/add', () => {
        it('should add participant to existing room', () => {
            return request(HOST)
                .put(`${apiPrefix}/rooms/${roomId}/add`)
                .set('Cookie', [`token=${token}`])
                .send({ id: '5d4745ecd67d792c5f6dbf0d' })
                .expect(204);
        });
    });

    describe('PUT : /rooms/:id/leave', () => {
        it('should remove participant from existing room', () => {
            return request(HOST)
                .put(`${apiPrefix}/rooms/${roomId}/leave`)
                .set('Cookie', [`token=${token}`])
                .expect(204);
        });
    });

    describe('DELETE : /rooms/:id', () => {
        it('should delete room', () => {
            return request(HOST)
                .delete(`${apiPrefix}/rooms/${roomId}`)
                .set('Cookie', [`token=${token}`])
                .expect(204);
        });
    });

    after(() => removeTestUser(tokenData.payload.id, token));
});
