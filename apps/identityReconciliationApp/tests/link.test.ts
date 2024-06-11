import app from '../src/app';
import supertest from 'supertest';
import { describe, it, expect } from '@jest/globals';

describe('GET /identify', ()=>{
    it('200 if both email and phone number present', async ()=>{
        return supertest(app)
           .post('/identify')
           .send({
                email:"newEmail@gmail.com",
                phoneNumber:"123456"
           })
           .expect(200)
           .expect('Content-Type',/application\/json/)
    });

    it('200 if email present and  phone number is not present', async ()=>{
        return supertest(app)
           .post('/identify')
           .send({
                email:"newEmail@gmail.com",
                phoneNumber:null
           })
           .expect(200)
           .expect('Content-Type',/application\/json/)
    });

    it('200 if email is not present and  phone number is present', async ()=>{
        return supertest(app)
           .post('/identify')
           .send({
                email:null,
                phoneNumber:"123456"
           })
           .expect(200)
           .expect('Content-Type',/application\/json/)
    });

    it('400 if both email and phone number is not present', async ()=>{
        return supertest(app)
           .post('/identify')
           .send({
                email:null,
                phoneNumber:null
           })
           .expect(400)
           .expect('Content-Type',/application\/json/)
    });

});  