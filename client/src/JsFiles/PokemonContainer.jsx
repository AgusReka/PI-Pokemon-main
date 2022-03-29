import { PokemonCard } from "./PokemonCards";
import React, { createRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../CssFiles/PokeHome.css";
import { Filtros } from "./PokedexComponentes/Filtros";
const axios = require("axios").default;

export const PokemonContainer = () => {
  const pokemons = useSelector((state) => state);
  const [pokemonsCopy, usePokemonsCopy] = useState();
  const dispatch = useDispatch();
  const [min, useMin] = useState(0);
  const [max, useMax] = useState(12);
  const [name, useName] = useState("");
  const RandomKey = () => {
    return Math.floor(Math.random() * 999999) + 1;
  };
  const TraerDatosDeLaApi = async () => {
    const datosPokemon = await (
      await axios.get("http://localhost:3001/pokemons")
    ).data;
    console.log("Se trajeron los Datos");
    usePokemonsCopy(datosPokemon);
    return datosPokemon;
  };
  const TraerPokePorNombre = async (props) => {
    const datosPokemon = await (await axios.get(
      `http://localhost:3001/pokemons?name=${props}`
    )).data;
    return datosPokemon;
  };
  const mandarLosDatos = async (proms) => {
    await dispatch({
      type: "TraerDatos",
      payload: await proms,
    });
    //console.log(proms)
  };
  let pokemonArray = [];
  pokemonArray = pokemons.slice(min, max);
  const Next = () => {
    useMin(min + 12);
    useMax(max + 12);
  };
  const Prev = () => {
    useMin(min - 12);
    useMax(max - 12);
  };
  const ResetLimits = () => {
    useMin(0);
    useMax(12);
  };
  const filtrarPorName = async (e) => {
    e.preventDefault();
    if (name === "") {
      dispatch({
        type: "Reset",
      });
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(pokemonsCopy);
      if (pokemonsCopy) mandarLosDatos(pokemonsCopy);
      else await mandarLosDatos(await TraerDatosDeLaApi());
      ResetLimits();
    } else {
      await mandarLosDatos([await TraerPokePorNombre(name)]);
    }
  };
  const HandleName = (e) => {
    useName(e.target.value);
  };

  useEffect(async () => {
    if (pokemons.length === 0) {
      await mandarLosDatos(await TraerDatosDeLaApi());
    }
  }, []);

  return (
    <div className="ContenedorPokedex">
      <h1 className="TituloPokedex"> Esta es la Pokedex</h1>
      <nav className="PokedexNav">
        {min > 0 ? (
          <button className="ButtonFlecha" onClick={Prev}>
            &lt;
          </button>
        ) : (
          <button className="ButtonFlecha">&lt;</button>
        )}
        {max < pokemons.length ? (
          <button className="ButtonFlecha" onClick={Next}>
            &gt;
          </button>
        ) : (
          <button className="ButtonFlecha">&gt;</button>
        )}

        <Filtros params={pokemonsCopy} />

        <form onSubmit={filtrarPorName} className={"SearchName"}>
          <input
            type="text"
            onChange={HandleName}
            placeholder={"Busqueda Por Nombre:"}
          />
          <button type="submit">Buscar</button>
        </form>
      </nav>
      <div className="PokeContainer">
        {pokemons.length < 1 ? <h1>Cargando...</h1> : <></>}
        {pokemonArray.map((el) => {
          return <PokemonCard key={RandomKey()} params={el} />;
        })}
      </div>
    </div>
  );
};
