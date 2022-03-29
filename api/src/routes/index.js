const { Router } = require('express');
const funciones = require("./RouterFunctions/router_functions")
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

router.get("/pokemons", funciones.getAllPokemons);
router.get("/pokemonsDataBase", funciones.getAllPokemonsDataBase);
router.get("/pokemons/:id", funciones.getPokemonById);
router.get("/types", funciones.getAllTypes);
router.post("/pokemons", funciones.createNewPokemon);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
