const request = require('supertest');
const express = require('express');
const fs = require('fs');
const app = require('../index');//Necesitamos exportar 'app' desde index.js

describe('Api de usuario', () => {
    const testUser = {id: 'test123', name: 'Test User', email: 'test@example.com'};

    afterAll(() => {
        //Limpieza: eliminar usuario de prueba si existe
        const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
        const filtered = users.filter(user => user.id !== testUser.id);
        fs.writeFileSync('users.json', JSON.stringify(filtered, null, 2), 'utf8');
    });

    it ('Debe responder el endpoint raiz', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toMatch(/Servidor en ejecucion/i);
    });
    it ('Debe crear un nuevo usuario', async () => {
        const response = await request(app).post('/users').send(testUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.user).toMatchObject(testUser);
    });

    it('Debe obtener todos los usuarios', async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('Debe buscar el usuario creado', async () => {
        const response = await request(app).get(`/users/${testUser.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.user).toMatchObject(testUser);
    });

});
