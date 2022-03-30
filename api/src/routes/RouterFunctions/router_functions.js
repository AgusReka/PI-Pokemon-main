const { json } = require("body-parser");
const { Pokemon, Tipos } = require("../../db.js");
const axios = require("axios").default;

const getAllPokemons = async (req, res) => {
  try {
    const pokeFromDataBase = await getPokemonsFromDatabase();
    
    if (req.query.name) {
      const found = pokeFromDataBase.find((e) => {
       return e.name.toLowerCase() === req.query.name.toLowerCase();
      });
      if(found) res.send(found);
      res.send(await getPokemonByName(req.query.name, null));
    } else {
      const pokemon = async () => {
        return (await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=40`))
          .data.results;
      };
      const datos = await pokemon();
      const pokeDatos = await Promise.all(
        datos.map(async (el) => {
          const ret = await getPokemonByName(null, el.url);
          return await ret;
        })
      );
      console.log("ASDASDASD", pokeFromDataBase);
      res.send([...pokeFromDataBase, ...pokeDatos]);
    }
  } catch (error) {
    return res.send("No Se Encontro Ese Pokemon");
  }
};
const getAllPokemonsDataBase = async (req, res) => {
  const pokeFromDataBase = await getPokemonsFromDatabase();
  res.send(pokeFromDataBase);
};
const getPokemonByName = async (name, url) => {
  let pokemon;
  if (!url && name) {
    let pokeName = name[0].toLowerCase() + name.substring(1);
    pokemon = (await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`))
      .data;
  } else if (url && !name) {
    pokemon = (await axios.get(url)).data;
  }
  const pokemonInfo = {
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.substring(1),
    pokedex_id: pokemon.id,
    sprite: pokemon.sprites.other["official-artwork"].front_default,
    types: pokemon.types.map((el) => {
      return {
        name: el.type.name.charAt(0).toUpperCase() + el.type.name.substring(1),
        url: el.type.url,
      };
    }),
    stats: pokemon.stats.map((el) => {
      return {
        name: el.stat.name,
        value: el.base_stat
      };
    }),
  };
  pokemonInfo.stats = [
    ...pokemonInfo.stats,
    { name: "height", value: pokemon.height },
    { name: "weight", value: pokemon.weight },
  ];
  return pokemonInfo;
};
const getPokemonById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new Error("No hay ID");
    }
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    );
    if (!data) {
      throw new Error("No se encontro el pokemon con esa ID");
    }
    const pokemonInfo = {
      name: data.name,
      pokedex_id: data.id,
      sprite: data.sprites.other["official-artwork"].front_default, //llaves: {} || corchetes: [], es para mi no para vos
      types: data.types.map((el) => {
        return {
          name: el.type.name,
          url: el.type.url,
        };
      }),
      stats: data.stats.map((el) => {
        return {
          name: el.stat.name,
          value: el.base_stat,
        };
      }),
    };
    pokemonInfo.stats = [
      ...pokemonInfo.stats,
      { name: "height", value: data.height },
      { name: "weight", value: data.weight },
    ];
    res.send(pokemonInfo);
  } catch (error) {
    return res.send("No Se Encontro Ese Pokemon");
  }
};
const createNewPokemon = async (req, res) => {
  const datos = req.body;
  console.log(datos);
  const createdPoke = await Pokemon.create({
    name: datos.name,
    vida: datos.vida,
    fuerza: datos.fuerza,
    defensa: datos.defensa,
    velocidad: datos.velocidad,
    altura: datos.altura,
    peso: datos.peso,
    sprite: datos.sprite,
  });

  const tiposCrear = await Tipos.findAll({
    where: {
      name: datos.tipos,
    },
  });
  //console.log(tiposCrear);
  //console.log(datos);
  await createdPoke.addTipos(tiposCrear);
  res.send(datos);
};
const getAllTypes = async (req, res) => {
  const datos = async () => {
    return (await axios.get(`https://pokeapi.co/api/v2/type`)).data.results;
  };

  const tipos = await datos();
  let tiposDatabase = await Tipos.findAll();
  if (tiposDatabase.length < 1) {
    tipos.forEach(async (el) => {
      await Tipos.create(
        {
          name: el.name,
        },
        { fields: ["name"] }
      );
    });

    let idIncremental = 0;
    const tiposReturn = tipos.map((el) => {
      return {
        name: el.name,
        id: idIncremental++,
      };
    });
    res.send(tiposReturn);
    console.log("Se trajeron los tipos");
  } else {
    res.send(await datos());
    console.log("Ya estan los tipos cargados");
  }
};
const getPokemonsFromDatabase = async () => {
  let pokemonsDataBase = await Pokemon.findAll({
    include: Tipos,
  });
  return pokemonsDataBase;
};
const allFunctiones = {
  getAllPokemons,
  getAllPokemonsDataBase,
  getPokemonById,
  getAllTypes,
  createNewPokemon,
};

module.exports = allFunctiones;
