import express, { json } from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

// Creamos una instancia del cliente de Prisma para interactuar con la base de datos
const prisma = new PrismaClient()

// Creamos una aplicación de Express
const app = express()

// Middleware para que Express pueda manejar JSON en las solicitudes
app.use(json())

// Middleware para permitir solicitudes desde otros dominios (CORS)
app.use(cors())

// Ruta para el registro de usuarios
app.post('/sign-up', async (req, res) => {
    try {
        // Extraemos el email y la contraseña del cuerpo de la solicitud
        const { email, password } = req.body

        // Creamos un nuevo usuario en la base de datos con el email y la contraseña proporcionados
        const result = await prisma.user.create({ data: { email, password } })

        // Enviamos una respuesta con los datos del usuario creado y un mensaje de éxito
        res.json({ data: result, message: 'User created' })
    } catch (error) {
        // Si ocurre un error, lo registramos en la consola
        console.error(error);
        if (error instanceof Error) {
            // Si el error es una instancia de Error, enviamos un mensaje de error en la respuesta
            res.json({ error: error.message })
            return
        }

        // Si el error no es una instancia de Error, enviamos el error tal cual en la respuesta
        res.json({ error })
    }
})

// Ruta para el inicio de sesión de usuarios
app.post('/login', async (req, res) => {
    // Extraemos el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body

    // Registramos el cuerpo de la solicitud en la consola
    console.log('req.body', req.body);

    // Buscamos un usuario en la base de datos que coincida con el email y la contraseña proporcionados
    const result = await prisma.user.findFirst({ where: { email, password } })

    // Si no encontramos un usuario, enviamos una respuesta con un error 404
    if (!result) {
        res.status(404).json({ error: 'User not found' })
        return
    }

    // Si encontramos un usuario, enviamos una respuesta con los datos del usuario
    res.json({
        data: result
    })
})

// Iniciamos el servidor en el puerto 8000 y registramos un mensaje en la consola
app.listen(8000, () => {
    console.log('Server ready! http://localhost:8000');
})