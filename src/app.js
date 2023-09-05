import express from "express";
import db from "./utils/database.js";
import User from "./models/user.model.js";
import 'dotenv/config';

User;

const PORT = process.env.PORT ?? 8000;
console.log(process.env)
db.authenticate()
  .then(() => console.log("Conexion correcta"))
  .catch((err) => console.log(err));

db.sync()
  .then(() => {
    console.log("base de datos sincronizada");
  })
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

app.get("/", (res, req) => {
  res.send("OK");
});

//CREATE user;
// Cuando se  haga un request a /users POST crear un usuario

app.post("/users", async (req, res) => {
  try {
    const { body } = req;
    // mandar esta info a la bd
    const user = await User.create(body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

//READ Uers => devolver un json con todos los usuarios en la base de datos

app.get('/users', async ( req, res ) => {
  try {
      const users = await User.findAll();
      res.json(users);
  } catch (error) {
      res.status(400).json(error);
  }
});

//GET /users/:id
// ? como mandamos el id en este get?

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)
        res.json( user )
    } catch (error) {
        res.status(400).json( error )
    }
})

// UPDATE ..... WHERE id = 5;
// PUT '/users' --> path params
// la información a actualizar por el body

app.put('/users/:id', async ( req, res) => {
    try {
        const { id } = req.params
        const { body } = req
        const user = await User.update(body, {
            where: {id}
        })
        res.json(user)
    } catch (error) {
        res.status(400).json( error )
    }
});

//DELETE ....WHERE id = 1;
// DELETE '/users' => path params

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        await User.destroy({
            where: {id}
        })
        res.status(204).end()
    } catch (error) {
        res.status(400).json( error )
    }
})

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});
