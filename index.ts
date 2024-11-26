import express, { json } from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

const prisma = new PrismaClient()

const app = express()

app.use(json())

app.use(cors())

app.post('/sign-up', async (req, res) => {
    try {
        const { email, password } = req.body

        const result = await prisma.user.create({ data: { email, password } })

        res.json({ data: result, message: 'User created' })
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.json({ error: error.message })
            return
        }

        res.json({ error })
    }
})

app.post('/login', async (req, res) => {

    const { email, password } = req.body

    console.log('req.body', req.body);

    const result = await prisma.user.findFirst({ where: { email, password } })

    if (!result) {
        res.status(404).json({ error: 'User not found' })
        return
    }

    res.json({
        data: result
    })
})

app.listen(8000, () => {
    console.log('Server ready! http://localhost:8000');
})