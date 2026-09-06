import axios, { Axios } from "axios"
import {test, expect, describe, it, beforeAll} from "bun:test"

const BACKEND_URL = "http://localhost:3001"

const EMAIL = `ankit${Math.random()}@gmail.com`
const EMAIL2 = `ankit${Math.random()}@gmail.com`

describe("all organization test", async () => {
    let jwtToken = ""
    let jwtToken2 = ""
    let user1Org = ""

    beforeAll(async () => {
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            email: EMAIL,
            password: "asfuegiubergu"
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            email: EMAIL,
            password: "asfuegiubergu"
        })

        jwtToken = response.data.token

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            email: EMAIL2,
            password: "asfuegiubergu"
        })

        const response2 = await axios.post(`${BACKEND_URL}/api/v1/login`, {
            email: EMAIL2,
            password: "asfuegiubergu"
        })

        jwtToken2 = response2.data.token

        const response3 = await axios.post(`${BACKEND_URL}/api/v1/organization/create`, {
            name: "cal.com",
            description: "meetings website"
        }, {
            headers: {
                Authorization: jwtToken
            }
        })

        user1Org = response3.data.orgId
    })

    describe("organization creation test", async () => {
        it("is able to create an organization with right inputs", async() => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/organization/create`, {
                name: "cal.com",
                description: "meetings website"
            }, {
                headers: {
                    Authorization: jwtToken
                }
            })
            expect(response.data.success).toBe(true)
        })

        it("it fails to create an organization if name is missing", async() => {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/organization/create`, {
                    description: "meetings website"
                }, {
                    headers: {
                        Authorization: jwtToken
                    }
                })
                expect.fail()
            } catch (e) {
                
            }
        })
    })

    describe("organization updation tests", async () => {
        it("is not able to update the organization if user doesn't own the organization", async() => {
            try {
                await axios.patch(`${BACKEND_URL}/api/v1/organization/${user1Org}`, {
                    name: "cal.com",
                    description: "meetings website"
                }, {
                    headers: {
                        Authorization: jwtToken2
                    }
                })
                expect.fail()
            } catch (e) {
                
            }
        })

        it("is fails to update the organization if passed inputs are not valid", async() => {
            try {
                await axios.patch(`${BACKEND_URL}/api/v1/organization/${user1Org}`, {
        
                }, {
                    headers: {
                        Authorization: jwtToken
                    }
                })
                expect.fail()
            } catch (e) {
                
            }
        })
    })
})