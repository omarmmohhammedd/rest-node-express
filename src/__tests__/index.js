const request = require("supertest")
const { config } = require("dotenv")
const { PrismaClient } = require("@prisma/client")
const { default: app } = require("../App")
const { validateUser } = require("../Controllers/Admin")
const { redisClient } = require("../Config/Socket")





describe('Unit Test', () => {

    config()

    const prisma = new PrismaClient()

    beforeAll(async () => await prisma.$connect())

    const n_username = `testUser${(Math.random() * 10000).toFixed(0)}`

    describe("Auth Handler", () => {

        describe('Register', () => {

            it("Should Create User And Return Status Code 201", async () => {

                const res = await request(app)
                    .post('/api/auth/register')
                    .send({ username: n_username, password: '2172001' })

                expect(res.statusCode)
                    .toBe(201)
            })

            it("Should Return Username Exists", async () => {
                const res = await request(app)
                    .post('/api/auth/register')
                    .send({ username: 'test', password: '2172001' })

                expect(res.statusCode).toBe(403)

            })


            it('Should Return Bad Request', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ username: 'te', password: '201010' })

                expect(res.badRequest)

                expect((JSON.parse(res.text)).errors.errors[0].msg)
                    .toBe('Please Add Valid Username with min 3 characters')
            })

        })

        describe('Login', () => {

            it('Should Return Success Login', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ username: 'test', password: '2172001' })
                
                expect(res.statusCode)
                    .toBe(200)
                expect(res.body)
                    .toStrictEqual({ user: { id: 6, username: 'test', role: 'User' }, token: expect.any(String) })
            })

            it('Should Return User Not Found ', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ username: 'omartest', password: '201010' })
                
                expect(res.statusCode)
                    .toBe(404)
            })

            it('Should Return bad request', async () => {
                const res = await request(app)
                    .post('/api/auth/login')
                    .send({ username: 'test', password: '201010' })
                
                expect(res.badRequest)

                expect((JSON.parse(res.text)).message).toBe('Password Not Match')
            })
        })
    })

    describe("Admin Handler", () => {

        const header_token = { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjkzNDI0NzA4fQ.MZhNARs8xyo2zeMvxplEPohG8f4UoiPJo4g2sk0BkM0" }

        describe("Vaildate User", () => {

            it("Should Return User", async () => {
                const res = await validateUser(1)
                expect(res).toStrictEqual({ id: 1, username: "Omar", role: "User", password: expect.any(String) })
            })

            it("Should Return Not Found", async () => {
                await validateUser(3).catch(e => {
                    expect(e.statusCode).toBe(404)
                    expect(e.message).toBe("User Not Found")

                })

            })
        })

        describe("Get Users", () => {

            it("Should Return All Users", async () => {
                const res = (await request(app).get('/api/admin/user')
                    .set({ "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjkzNDI0NzA4fQ.MZhNARs8xyo2zeMvxplEPohG8f4UoiPJo4g2sk0BkM0" }))

                expect(res.statusCode).toBe(200)

                expect(res.body).toStrictEqual({ users: expect.any(Array) })
            })

            it("Should Get Pagination Of Users", async () => {
                const res = (await request(app).get('/api/admin/user?count=10&page=1').set({ "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjkzNDI0NzA4fQ.MZhNARs8xyo2zeMvxplEPohG8f4UoiPJo4g2sk0BkM0" }))
                expect(res.statusCode).toBe(200)
                expect(res.body).toStrictEqual({ users: expect.any(Array) })
            })

            it("Should Return UnAuthorized", async () => {
                const res = await request(app).get('/api/admin/user')
                expect(res.statusCode).toBe(401)
            })
        })

        describe("Update User", () => {

            it("Should Update User Info", async () => {
                const res = await request(app).patch('/api/admin/user/6').set(header_token).send({ "username": n_username })
                expect(res.statusCode).toBe(201)
                expect(res.body).toStrictEqual({ user: { id: 6, username: n_username, role: 'User' } })
            })

            it("Should Return Bad Request", async () => {
                const res = await request(app).patch('/api/admin/user/36').set(header_token).send({ "username": 'as' })
                expect((JSON.parse(res.text)).errors.errors[0].msg).toBe('Please Add Valid Username with min 3 characters')
                expect(res.statusCode).toBe(400)
            })

            it("Should Return Not Found", async () => {
                const res = await request(app).patch('/api/admin/user/200').set(header_token).send({ "username": 'tests' })
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe("User Not Found")
            })

        })

        describe("Delete User", () => {
            it("Should Delete a user and Return statusCode 200", async () => {
                const res = await request(app)
                    .delete('/api/admin/user/38')
                    .set(header_token)
                expect(res.statusCode).toBe(200)
            })

            it("Should Return user not found", async () => {
                const res = await request(app)
                    .delete('/api/admin/user/200')
                    .set(header_token)
                expect(res.statusCode).toBe(404)
                expect(res.body.message).toBe("User Not Found")
            })
        })
    })

    describe("Post", () => {

        const header_token = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVzZXIiLCJpYXQiOjE2OTM0MjQ2OTB9.dRdgfPQDyb0ofattUd5_LOPTuvyM0EAYoN_sYNqkHOU' }

        const n_post = `post${Math.random() * 10000 .toFixed(0)}`

        describe("Get Posts", () => {

            it("Should Return List Of Posts", async () => {
                const res = await request(app).get('/api/post/').set(header_token)
                expect(res.statusCode).toBe(200)
                expect(res.body).toStrictEqual({ posts: expect.any(Array) })
            })

            it("Should Return UnAuthorized Error ", async () => {
                const res = await request(app).get('/api/post')
                expect(res.statusCode).toBe(401)
                expect((JSON.parse(res.text)).message).toBe('Please Provide Valid Token')
            })

            it("Should Return Pagination Of Posts", async () => {
                const res = await request(app).get('/api/post?count=10&page=1').set(header_token)
                expect(res.statusCode).toBe(200)
                expect(res.body).toStrictEqual({ posts: expect.any(Array) })
            })
        })

        describe("Get Post", () => {

            it("Should Return A Post", async () => {
                const res = await request(app)
                    .get('/api/post/12')
                    .set(header_token)
                
                expect(res.statusCode)
                    .toBe(200)

                expect(res.body)
                    .toStrictEqual({ post: expect.any(Object) })
            })

            it("Should Return UnAuthorized Error ", async () => {
                const res = await request(app)
                    .get('/api/post/12')
                
                expect(res.statusCode)
                    .toBe(401)
                
                expect((JSON.parse(res.text)).message)
                    .toBe('Please Provide Valid Token')
            })

            it("Should Return Not Found ", async () => {
                const res = await request(app)
                    .get('/api/post/1').set(header_token)
                
                expect(res.statusCode)
                    .toBe(500)
                
                expect((JSON.parse(res.text)).message).toBe("Post Not Found")
            })
        })


        describe("Add Post", () => {

            it("Should Create A Post", async () => {
                const res = await request(app)
                    .post('/api/post')
                    .set(header_token)
                    .send({ title: n_post, description: `${n_post} description` })
                
                expect(res.statusCode)
                    .toBe(201)
                
                expect(res.body)
                    .toStrictEqual({ post: expect.any(Object) })
            })

            it("Should Return UnAuthorized Error ", async () => {
                const res = await request(app)
                    .post('/api/post')
                
                expect(res.statusCode)
                    .toBe(401)
                
                expect((JSON.parse(res.text)).message)
                    .toBe('Please Provide Valid Token')
            })

            it("Should Return Bad Request ", async () => {
                const res = await request(app)
                    .post('/api/post')
                    .set(header_token)
                    .send({ title: n_post, description: '12' })
                
                expect(res.statusCode)
                    .toBe(400)
                
                expect((JSON.parse(res.text)).errors.errors[(JSON.parse(res.text)).errors.errors.length - 1].msg)
                    .toBe("Please Add Valid Description To Post With Min 10 characters")
            })

        })

        describe("Update Post", () => {

            it("Should Update Post", async () => {
                const res = await request(app)
                    .patch('/api/post/13')
                    .set(header_token)
                    .send({ title: n_post })

                expect(res.statusCode)
                    .toBe(201)

                expect(res.body)
                    .toStrictEqual({ post: expect.any(Object) })
            })

            it("Should Return Not Found Error ", async () => {
                const res = await request(app)
                    .patch('/api/post/10')
                    .set(header_token)
                
                expect(res.statusCode)
                    .toBe(500)
                
                expect((JSON.parse(res.text)).message)
                    .toBe("Post Not Found")
            })

            it("Should Return Bad Request ", async () => {
                const res = await request(app)
                    .patch('/api/post/13')
                    .set(header_token)
                    .send({ description: '12' })

                expect(res.statusCode)
                    .toBe(400)

                expect((JSON.parse(res.text)).errors.errors[(JSON.parse(res.text)).errors.errors.length - 1].msg)
                    .toBe("Please Add Valid Description To Post With Min 10 characters")
            })

        })

        describe("Delete Post", () => {

            it("Should Delete Post", async () => {
                const res = await request(app)
                    .delete('/api/post/17')
                    .set(header_token)

                expect(res.statusCode)
                    .toBe(200)
            })

            it("Should Return Not Found Error ", async () => {
                const res = await request(app)
                    .patch('/api/post/10')
                    .set(header_token)

                expect(res.statusCode)
                    .toBe(500)
                
                expect((JSON.parse(res.text)).message)
                    .toBe("Post Not Found")
            })

        })

        describe("Likes", () => {

            it("Should Toggle Like On Post", async () => {
                const res = await request(app).patch('/api/post/like/13')
                    .set(header_token)
                
                expect(res.statusCode)
                    .toBe(200)
                
                expect(res.body)
                    .toStrictEqual({ post: expect.any(Object) })
            })

            it("Should Return Not Found Post", async () => {
                const res = await request(app)
                    .patch('/api/post/like/10')
                    .set(header_token)
                
                expect(res.statusCode)
                    .toBe(500)
                
                expect((JSON.parse(res.text)).message)
                    .toBe("Post Not Found")
            })

        })

        describe("Comments", () => {

            it("Should Add Comment To Post", async () => {
                const res = await request(app)
                    .post('/api/post/comment/13')
                    .set(header_token)
                    .send({ body: "Test Comment" })

                expect(res.statusCode).toBe(201)
                expect(res.body).toStrictEqual({ comment: expect.any(Object) })
            })

            it("Should Return Not Found", async () => {
                const res = await request(app)
                    .post('/api/post/comment/55')
                    .set(header_token)
                    .send({ body: "Test Comment" })

                expect(res.statusCode).toBe(500)
                expect((JSON.parse(res.text)).message).toBe("Post Not Found")
            })

            it("Should Delete Comment From Post", async () => {
                const res = await request(app)
                    .delete('/api/post/comment/8')
                    .set(header_token)

                expect(res.statusCode).toBe(200)
            })

        })

    })

    describe("Chats", () => {

        const header_token = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlVzZXIiLCJpYXQiOjE2OTM0MjQ2OTB9.dRdgfPQDyb0ofattUd5_LOPTuvyM0EAYoN_sYNqkHOU' }

        describe("Get Converstions", () => {

            it("Should Return List Of All Converstions", async () => {
                const res = await request(app)
                    .get("/api/chat")
                    .set(header_token)

                expect(res.statusCode).toBe(200)

                expect(res.body).toStrictEqual({ conversations: expect.any(Object) })
            })

            it("Should Return Converstion Between two users", async () => {
                const res = await request(app)
                    .get("/api/chat/2")
                    .set(header_token)

                expect(res.statusCode).toBe(200)
            })

            it("Should Return Converstion Not Found", async () => {
                const res = await request(app)
                    .get("/api/chat/1")
                    .set(header_token)
                
                expect(res.statusCode)
                    .toBe(404)
                
                expect((JSON.parse(res.text)).message)
                    .toBe("Conversation not found")
            })
        })

    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

})

jest.setTimeout(10000)