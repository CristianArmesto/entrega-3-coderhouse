const fs = require('fs')

const express = require('express')

const app = express()

const puerto = 8080

class Contenedor {
    constructor(rutaDelArchivo) {
        this.nombre = rutaDelArchivo;
        fs.promises.writeFile(`./${rutaDelArchivo}`, "")
    }

    async save(objeto) {
        try {
            let data = await fs.promises.readFile(this.nombre)
            if (data.length == 0) {
                let id = {
                    'id': 1
                }
                let newObject = Object.assign(objeto, id)
                const jsonData = [newObject]
                await fs.promises.writeFile(this.nombre, JSON.stringify(jsonData))
                return id
            } else {
                const contenido = JSON.parse(data)
                let lastIndex= contenido.length-1
                let newId = contenido[lastIndex].id +1
                let newObject = Object.assign(objeto, {
                    'id': newId
                })
                contenido.push(newObject)
                await fs.promises.writeFile(this.nombre, JSON.stringify(contenido, null, 2))
                return newId
            }

        } catch (error) {
            console.log("ERROR  DETECTADO")
            console.log(error)
        }

    }
    async load() {
        return JSON.parse(await fs.promises.readFile(this.nombre, 'utf-8'))
    }
    async getById(id) {
        try {
            const contenido = await this.load()
            let objeto = contenido.find(el => el.id == id)
            if (objeto == undefined) {
                return null
            }
            return objeto
        } catch (error) {
            console.log(`Error en getById:${error}`)
        }

    }
    async getAll() {
        try {
            const contenido = await this.load()
            return contenido
        } catch (error) {
            console.log(`Error en getAll:${error}`)
        }
    }
    async deleteById(id) {
        try {
            const contenido = await this.load()
            let objeto = contenido.filter(item => item.id != id)
            await fs.promises.writeFile(this.nombre, JSON.stringify(objeto))

        } catch (error) {
            console.log(`Error en getById:${error}`)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.nombre, "")
        } catch (error) {
            console.log(`Error en deleteAll:${error}`)
        }

    }

}

const product = new Contenedor('productos.txt')

const listaProductos = async (req, res) => {
    const respuesta = await productos.getAll()
    res.send(respuesta)
}

const productoRandom = async (req, res) => {
    const respuesta = await productos.getRandom()
    res.send(respuesta)
}

app.get('/productos', listaProductos)
app.get('/productoRandom', productoRandom)

app.listen(puerto, () => {
    console.log('escuchando')
})