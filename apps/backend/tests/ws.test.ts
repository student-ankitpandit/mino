import axios, { Axios } from "axios"
import {test, expect, describe, it, beforeAll} from "bun:test"

const BACKEND_URL = "http://localhost:3001"
const WS_URL = "ws://localhost:3002"

const EMAIL = `ankit${Math.random()}@gmail.com`
const EMAIL2 = `ankit${Math.random()}@gmail.com`

describe("realtime tests", async() => {
    let jwtToken = ""
    let jwtToken2 = ""
    let user1Org = ""
    let boardId = ""

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

        const response4 = await axios.post(`${BACKEND_URL}/api/v1/board/create`, {
            title: "devops team board",
            orgId: user1Org            
        }, {
            headers: {
                Authorization: jwtToken
            }
        })

        boardId = response4.data.data

        const response5 = await axios.post(`${BACKEND_URL}/api/v1/invite`, {
            email: EMAIL2,
            orgId: user1Org
        }, {
            headers: {
                Authorization: jwtToken
            }
        })

        await axios.post(`${BACKEND_URL}/api/v1/accept-invite/${response5.data.invitationId}`, {
            
        }, {
            headers: {
                Authorization: jwtToken2
            }
        })
    })

    it("shouldn't able to connect if the token is invalid", async() => {
        await new Promise((resolve, reject) => {
            const ws = new WebSocket(`${WS_URL}?token=sjhgfwfbqkfshjiudbggkjhwfwgolikfbwf`)

            ws.onclose = resolve
        })
    })

    it("should be able to connect if the token is valid", async() => {
        await new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(`${WS_URL}?token=${jwtToken}`)

            ws.onclose = () => {
                expect.fail()
                resolve()
            }

            ws.onopen = () => {
                setTimeout(() => {
                    resolve()
                }, 3000)
            }
        })
    })

    it("if 1 joins to the board user 2 should receive the join event", async () => {
        const ws1 = new WebSocket(`${WS_URL}?token=${jwtToken}`)
        const ws2 = new WebSocket(`${WS_URL}?token=${jwtToken2}`)

        await Promise.all([new Promise((resolve) => ws1.onopen = resolve), new Promise((resolve) => ws2.onopen = resolve)]) //hard to understand

        ws1.send(JSON.stringify({
            type: "join",
            boardId: boardId
        }))

        await new Promise((resolve) => setTimeout(resolve, 100))

        await new Promise<void>((resolve) => {
            ws2.send(JSON.stringify({
                type: "join",
                boardId: boardId
            }))
            
            let receivedMsg = 0
            ws1.onmessage = (ev) => {
                const parsedData = JSON.parse(ev.data)
                if(receivedMsg == 0) {
                    expect(parsedData.type).toBe("initial_state")
                    receivedMsg++
                } else {
                    expect(parsedData.type).toBe("join")
                    resolve()
                }
            }
        })
    })
}) 